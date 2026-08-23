"""
Apache Kafka Event-Driven Integration Layer for AI Chikitsalya.
Provides producer, consumer, outbox pattern, topics, and EventEnvelope schemas.
"""

from .config import kafka_settings
from .topics import KafkaTopics, EventTypes
from .schemas import EventEnvelope
from .producer import KafkaProducerService, get_kafka_producer
from .consumer import KafkaConsumerService, get_kafka_consumer
from .events import EventFactory

__all__ = [
    "kafka_settings",
    "KafkaTopics",
    "EventTypes",
    "EventEnvelope",
    "KafkaProducerService",
    "get_kafka_producer",
    "KafkaConsumerService",
    "get_kafka_consumer",
    "EventFactory",
]
