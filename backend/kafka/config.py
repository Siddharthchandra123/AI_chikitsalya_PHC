import os
from pydantic import BaseModel
from typing import Optional

class KafkaSettings(BaseModel):
    enabled: bool = os.getenv("KAFKA_ENABLED", "true").lower() in ("true", "1", "yes")
    bootstrap_servers: str = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
    client_id: str = os.getenv("KAFKA_CLIENT_ID", "ai-chikitsalya-api")
    
    # Security/Production Auth (Optional)
    username: Optional[str] = os.getenv("KAFKA_USERNAME", None)
    password: Optional[str] = os.getenv("KAFKA_PASSWORD", None)
    security_protocol: Optional[str] = os.getenv("KAFKA_SECURITY_PROTOCOL", "PLAINTEXT")
    sasl_mechanism: Optional[str] = os.getenv("KAFKA_SASL_MECHANISM", "PLAIN")
    
    # Resiliency settings
    max_retries: int = int(os.getenv("KAFKA_MAX_RETRIES", "3"))
    retry_backoff_ms: int = int(os.getenv("KAFKA_RETRY_BACKOFF_MS", "1000"))
    outbox_poll_interval_sec: float = float(os.getenv("KAFKA_OUTBOX_POLL_INTERVAL", "3.0"))

kafka_settings = KafkaSettings()
