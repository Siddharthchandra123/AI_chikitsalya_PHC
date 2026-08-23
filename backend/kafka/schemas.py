import uuid
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class EventEnvelope(BaseModel):
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_type: str
    event_version: int = 1
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    source: str = "ai-chikitsalya-backend"
    correlation_id: Optional[str] = None
    actor_id: Optional[str] = None
    patient_id: Optional[str] = None
    facility_id: Optional[int] = None
    data: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class EventProcessingResult(BaseModel):
    event_id: str
    event_type: str
    status: str  # SUCCESS, RETRY, FAILED_DLT
    consumer_group: str
    error: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
