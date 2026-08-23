import json
import logging
import asyncio
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime

from .config import kafka_settings
from .schemas import EventEnvelope
from .topics import KafkaTopics

logger = logging.getLogger("kafka.producer")
logging.basicConfig(level=logging.INFO)

# Optional Kafka client imports with graceful fallback
AIOKAFKA_AVAILABLE = False
try:
    from aiokafka import AIOKafkaProducer
    AIOKAFKA_AVAILABLE = True
except ImportError:
    AIOKafkaProducer = None

class KafkaProducerService:
    def __init__(self):
        self.enabled = kafka_settings.enabled
        self.bootstrap_servers = kafka_settings.bootstrap_servers
        self.client_id = kafka_settings.client_id
        self._producer = None
        self._is_connected = False

    async def start(self):
        """Initialize and start the Kafka producer if Kafka is enabled."""
        if not self.enabled:
            logger.info("Kafka is disabled via configuration (KAFKA_ENABLED=false). Using DB outbox pattern fallback.")
            return

        if not AIOKAFKA_AVAILABLE:
            logger.warning("aiokafka package not installed. Events will be stored in DB outbox.")
            return

        try:
            self._producer = AIOKafkaProducer(
                bootstrap_servers=self.bootstrap_servers,
                client_id=self.client_id,
                value_serializer=lambda v: json.dumps(v).encode("utf-8"),
                key_serializer=lambda k: k.encode("utf-8") if k else None,
                request_timeout_ms=3000,
            )
            await asyncio.wait_for(self._producer.start(), timeout=3.0)
            self._is_connected = True
            logger.info(f"Kafka Producer successfully connected to {self.bootstrap_servers}")
        except Exception as e:
            self._is_connected = False
            logger.warning(f"Kafka Producer connection failed: {e}. Falling back to DB Outbox pattern.")

    async def stop(self):
        if self._producer and self._is_connected:
            try:
                await self._producer.stop()
                self._is_connected = False
                logger.info("Kafka Producer stopped.")
            except Exception as e:
                logger.error(f"Error stopping Kafka Producer: {e}")

    def is_connected(self) -> bool:
        return self._is_connected

    async def publish_event(
        self,
        topic: str,
        event: EventEnvelope,
        db: Optional[Session] = None,
        key: Optional[str] = None
    ) -> bool:
        """
        Publish event to Kafka.
        If Kafka is disconnected or disabled, store event in DB Outbox table.
        API request will never fail due to Kafka unavailability.
        """
        event_dict = event.dict()
        event_key = key or event.patient_id or event.event_id

        if self.enabled and self._is_connected and self._producer:
            try:
                await self._producer.send_and_wait(topic, value=event_dict, key=event_key)
                logger.info(
                    f"EVENT_PUBLISHED | event_id={event.event_id} | event_type={event.event_type} | "
                    f"topic={topic} | patient_id={event.patient_id} | status=success"
                )
                return True
            except Exception as e:
                logger.error(f"EVENT_PUBLISH_FAILED | event_id={event.event_id} | topic={topic} | error={e}")
                self._is_connected = False

        # Fallback: Save to Outbox table in database
        if db:
            self.save_to_outbox(db, topic, event)
            logger.info(
                f"EVENT_STORED_OUTBOX | event_id={event.event_id} | event_type={event.event_type} | "
                f"topic={topic} | status=pending_outbox"
            )
        else:
            logger.warning(f"EVENT_UNSAVED | event_id={event.event_id} | topic={topic} | reason=no_db_session")
        
        return False

    def save_to_outbox(self, db: Session, topic: str, event: EventEnvelope):
        """Save event payload into DB outbox table for background retry."""
        try:
            from backend.models import KafkaOutboxEvent
            outbox_entry = KafkaOutboxEvent(
                id=event.event_id,
                event_type=event.event_type,
                topic=topic,
                payload_json=json.dumps(event.dict()),
                status="PENDING",
                retry_count=0,
                created_at=datetime.utcnow(),
                correlation_id=event.correlation_id
            )
            db.add(outbox_entry)
            db.commit()
        except Exception as e:
            logger.error(f"Failed to write outbox entry to DB: {e}")
            db.rollback()

_producer_service_instance = KafkaProducerService()

def get_kafka_producer() -> KafkaProducerService:
    return _producer_service_instance
