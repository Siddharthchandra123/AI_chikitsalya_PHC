from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class PatientCreate(BaseModel):
    name: str
    age: int
    gender: str
    village: str
    phone: Optional[str] = None
    blood_group: Optional[str] = "Unknown"
    emergency_contact: Optional[str] = None
    risk_level: Optional[str] = "LOW"

class PatientOut(BaseModel):
    id: str
    name: str
    age: int
    gender: str
    village: str
    phone: Optional[str] = None
    blood_group: Optional[str] = "Unknown"
    emergency_contact: Optional[str] = None
    registered_at: datetime
    risk_level: str
    status: str

    class Config:
        from_attributes = True

class VitalsCreate(BaseModel):
    patient_id: str
    temperature: Optional[float] = None
    bp_systolic: Optional[int] = None
    bp_diastolic: Optional[int] = None
    pulse: Optional[int] = None
    sp_o2: Optional[int] = None
    respiratory_rate: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    recorded_by: Optional[str] = "Health Worker"

class CareTimelineEventOut(BaseModel):
    id: int
    patient_id: str
    event_type: str
    title: str
    description: Optional[str] = None
    timestamp: datetime
    facility_id: Optional[int] = None
    actor_name: Optional[str] = "Health Worker"
    status: Optional[str] = "COMPLETED"

    class Config:
        from_attributes = True

class ReferralCreate(BaseModel):
    patient_id: str
    originating_facility_id: int
    destination_facility_id: int
    referring_user: str
    reason: str
    priority: str = "ROUTINE"
    required_specialty: Optional[str] = None
    required_diagnostics: Optional[str] = None

class ReferralStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None
    appointment_at: Optional[datetime] = None

class ReferralOut(BaseModel):
    id: str
    patient_id: str
    originating_facility_id: int
    destination_facility_id: int
    referring_user: str
    reason: str
    priority: str
    required_specialty: Optional[str] = None
    required_diagnostics: Optional[str] = None
    status: str
    created_at: datetime
    appointment_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class TriageRequest(BaseModel):
    symptoms: List[str]
    context: Optional[str] = None
    lang: Optional[str] = "en"
    offline: Optional[bool] = False

class TriageResponse(BaseModel):
    assessment_status: str
    condition: Optional[str] = None
    confidence: float
    risk_level: str
    risk_score: float
    high_risk_symptoms: List[str]
    is_emergency: bool
    emergency_message: Optional[str] = None
    precautions: List[str]
    reply: str
    follow_up_questions: List[str]
    top_predictions: List[dict]
    edge_ai: bool
    rag_used: bool

class FollowUpCreate(BaseModel):
    patient_id: str
    facility_id: Optional[int] = None
    health_worker_name: Optional[str] = "ASHA Worker"
    due_date: datetime
    risk_level: Optional[str] = "LOW"
    notes: Optional[str] = None

class FollowUpUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

class QueueCreate(BaseModel):
    patient_id: str
    facility_id: int
    department: Optional[str] = "General OPD"
    doctor_name: Optional[str] = None
    priority: Optional[str] = "NORMAL"

class PrescriptionCreate(BaseModel):
    patient_id: str
    doctor_name: str
    facility_id: Optional[int] = None
    diagnosis: str
    medicines: List[dict]
    notes: Optional[str] = None
