import json
import logging
import asyncio
from datetime import datetime
from sqlalchemy.orm import Session

from backend.database import SessionLocal
from backend.models import KafkaOutboxEvent
from .config import kafka_settings
from .producer import get_kafka_producer
from .schemas import EventEnvelope
from .topics import KafkaTopics

logger = logging.getLogger("kafka.outbox")

async def process_outbox_events():
    """Background task to poll DB Outbox table and publish pending events to Kafka."""
    producer = get_kafka_producer()
    
    while True:
        try:
            await asyncio.sleep(kafka_settings.outbox_poll_interval_sec)
            
            # Check if producer is connected or try reconnecting
            if not producer.is_connected() and kafka_settings.enabled:
                await producer.start()

            if not producer.is_connected():
                continue

            db: Session = SessionLocal()
            try:
                pending_events = (
                    db.query(KafkaOutboxEvent)
                    .filter(KafkaOutboxEvent.status == "PENDING")
                    .order_by(KafkaOutboxEvent.created_at.asc())
                    .limit(20)
                    .all()
                )

                for entry in pending_events:
                    try:
                        payload_data = json.loads(entry.payload_json)
                        envelope = EventEnvelope(**payload_data)

                        if producer._producer and producer.is_connected():
                            await producer._producer.send_and_wait(
                                entry.topic,
                                value=envelope.dict(),
                                key=(envelope.patient_id or envelope.event_id).encode("utf-8")
                            )

                            entry.status = "PUBLISHED"
                            entry.published_at = datetime.utcnow()
                            db.commit()
                            logger.info(f"OUTBOX_PUBLISHED | event_id={entry.id} | topic={entry.topic}")
                        else:
                            break
                    except Exception as pub_err:
                        entry.retry_count += 1
                        entry.error_message = str(pub_err)
                        if entry.retry_count >= kafka_settings.max_retries:
                            entry.status = "DLT"
                            # Attempt sending to DLT topic
                            dlt_topic = KafkaTopics.get_dlt_topic(entry.topic)
                            try:
                                if producer._producer and producer.is_connected():
                                    await producer._producer.send_and_wait(dlt_topic, value=json.loads(entry.payload_json))
                            except Exception:
                                pass
                            logger.error(f"OUTBOX_MOVED_DLT | event_id={entry.id} | topic={dlt_topic} | retries={entry.retry_count}")
                        db.commit()
            finally:
                db.close()
        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error(f"Error in outbox processing loop: {e}")
            await asyncio.sleep(5)
