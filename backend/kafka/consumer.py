import json
import logging
import asyncio
from typing import Dict, Any, List, Set
from datetime import datetime
from sqlalchemy.orm import Session

from backend.database import SessionLocal
from backend.models import InAppNotification, CareTimelineEvent, QueueEntry, Referral, FollowUp, Patient
from .config import kafka_settings
from .schemas import EventEnvelope
from .topics import KafkaTopics, EventTypes

logger = logging.getLogger("kafka.consumer")

# Real-time SSE Broadcaster for Next.js Frontend
class SSEBroadcaster:
    def __init__(self):
        self._subscribers: Set[asyncio.Queue] = set()

    def subscribe(self) -> asyncio.Queue:
        queue = asyncio.Queue()
        self._subscribers.add(queue)
        logger.info(f"New SSE client connected. Active connections: {len(self._subscribers)}")
        return queue

    def unsubscribe(self, queue: asyncio.Queue):
        if queue in self._subscribers:
            self._subscribers.remove(queue)
            logger.info(f"SSE client disconnected. Remaining connections: {len(self._subscribers)}")

    async def broadcast(self, data: Dict[str, Any]):
        if not self._subscribers:
            return
        dead_queues = set()
        msg = f"data: {json.dumps(data)}\n\n"
        for q in self._subscribers:
            try:
                await q.put(msg)
            except Exception:
                dead_queues.add(q)
        for dq in dead_queues:
            self.unsubscribe(dq)

sse_broadcaster = SSEBroadcaster()

# Idempotency cache to prevent processing duplicate event_ids
PROCESSED_EVENTS: Set[str] = set()

class KafkaConsumerService:
    def __init__(self):
        self.enabled = kafka_settings.enabled
        self.bootstrap_servers = kafka_settings.bootstrap_servers
        self._is_running = False
        self._consumed_counts: Dict[str, int] = {
            "phc": 0,
            "hospital": 0,
            "notifications": 0,
            "analytics": 0,
            "patient_records": 0
        }

    def process_event_sync(self, consumer_group: str, envelope: EventEnvelope):
        """Idempotently process domain event for specific consumer group."""
        dedup_key = f"{consumer_group}:{envelope.event_id}"
        if dedup_key in PROCESSED_EVENTS:
            logger.info(f"DUPLICATE_EVENT_SKIPPED | group={consumer_group} | event_id={envelope.event_id}")
            return

        db: Session = SessionLocal()
        try:
            event_type = envelope.event_type
            data = envelope.data

            # 1. NOTIFICATION CONSUMER GROUP
            if consumer_group == "notifications":
                title = f"Event: {event_type}"
                message = f"Details: {json.dumps(data)}"
                target_role = "PATIENT"

                if event_type == EventTypes.APPOINTMENT_CREATED:
                    title = "New Appointment Scheduled"
                    message = f"Queue #{data.get('queue_number')} for Patient {envelope.patient_id} at PHC."
                    target_role = "HEALTH_WORKER"
                elif event_type == EventTypes.REFERRAL_CREATED:
                    title = f"Referral Issued ({data.get('priority', 'ROUTINE')})"
                    message = f"Patient {envelope.patient_id} referred for {data.get('reason')}."
                    target_role = "DOCTOR"
                elif event_type == EventTypes.REFERRAL_ACCEPTED:
                    title = "Referral Accepted by Hospital"
                    message = f"Referral {data.get('referral_id')} has been accepted by specialist."
                    target_role = "HEALTH_WORKER"
                elif event_type == EventTypes.DIAGNOSTIC_RESULT_AVAILABLE:
                    title = "Diagnostic Result Ready"
                    message = f"Diagnostic report for {data.get('test_name')} is now available."
                    target_role = "PATIENT"
                elif event_type == EventTypes.PRESCRIPTION_CREATED:
                    title = "New Prescription Issued"
                    message = f"Prescription for {data.get('diagnosis')} issued by {data.get('doctor_name')}."
                    target_role = "PATIENT"
                elif event_type == EventTypes.FOLLOWUP_CREATED:
                    title = "Follow-Up Reminder Scheduled"
                    message = f"Follow-up visit due on {data.get('due_date')}."
                    target_role = "PATIENT"

                notification = InAppNotification(
                    event_id=envelope.event_id,
                    target_role=target_role,
                    patient_id=envelope.patient_id,
                    facility_id=envelope.facility_id,
                    title=title,
                    message=message,
                    event_type=event_type,
                    created_at=datetime.utcnow()
                )
                db.add(notification)
                db.commit()

            # 2. PHC OPERATIONAL CONSUMER GROUP
            elif consumer_group == "phc":
                if event_type == EventTypes.APPOINTMENT_CREATED:
                    logger.info(f"PHC_QUEUE_UPDATED | patient_id={envelope.patient_id} | queue_num={data.get('queue_number')}")

            # 3. HOSPITAL CONSUMER GROUP
            elif consumer_group == "hospital":
                if event_type in (EventTypes.REFERRAL_CREATED, EventTypes.REFERRAL_ACCEPTED):
                    logger.info(f"HOSPITAL_REFERRAL_SYNCED | ref_id={data.get('referral_id')} | priority={data.get('priority')}")

            # Mark processed
            PROCESSED_EVENTS.add(dedup_key)
            self._consumed_counts[consumer_group] = self._consumed_counts.get(consumer_group, 0) + 1

            # Broadcast SSE event to connected Next.js clients
            asyncio.create_task(sse_broadcaster.broadcast({
                "event_id": envelope.event_id,
                "event_type": envelope.event_type,
                "consumer_group": consumer_group,
                "patient_id": envelope.patient_id,
                "facility_id": envelope.facility_id,
                "timestamp": envelope.timestamp,
                "data": data
            }))

            logger.info(f"EVENT_CONSUMED | group={consumer_group} | event_id={envelope.event_id} | type={event_type}")
        except Exception as e:
            logger.error(f"EVENT_CONSUMPTION_FAILED | group={consumer_group} | event_id={envelope.event_id} | error={e}")
            db.rollback()
        finally:
            db.close()

    def get_stats(self) -> Dict[str, Any]:
        return {
            "is_running": self._is_running,
            "processed_events_total": len(PROCESSED_EVENTS),
            "consumer_counts": self._consumed_counts
        }

_consumer_service_instance = KafkaConsumerService()

def get_kafka_consumer() -> KafkaConsumerService:
    return _consumer_service_instance
