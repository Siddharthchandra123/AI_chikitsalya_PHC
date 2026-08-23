import sys
import os
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from backend.database import Base
except ModuleNotFoundError:
    from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(String, nullable=False, default="PATIENT") # PATIENT, HEALTH_WORKER, DOCTOR, PHC_ADMIN, HOSPITAL_ADMIN, DISTRICT_ADMIN
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    level = Column(String, nullable=False) # District, Block, PHC, Sub-centre, Rural Hospital, District Hospital
    district = Column(String, nullable=False)
    block = Column(String, nullable=False)
    address = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    capabilities_json = Column(Text, default="{}")
    specialties_json = Column(Text, default="[]")
    total_beds = Column(Integer, default=0)
    available_beds = Column(Integer, default=0)
    icu_beds = Column(Integer, default=0)
    available_icu_beds = Column(Integer, default=0)
    operating_hours = Column(String, default="24/7")

class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, index=True) # e.g. PAT-1001
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    village = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    blood_group = Column(String, default="Unknown")
    emergency_contact = Column(String, nullable=True)
    registered_at = Column(DateTime, default=datetime.utcnow)
    risk_level = Column(String, default="LOW") # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String, default="REGISTERED") # REGISTERED, IN_OPD, DIAGNOSTICS, ADMITTED, REFERRED, DISCHARGED

class Vitals(Base):
    __tablename__ = "vitals"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    temperature = Column(Float, nullable=True) # in °F
    bp_systolic = Column(Integer, nullable=True)
    bp_diastolic = Column(Integer, nullable=True)
    pulse = Column(Integer, nullable=True)
    sp_o2 = Column(Integer, nullable=True)
    respiratory_rate = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    recorded_by = Column(String, default="System")

class CareTimelineEvent(Base):
    __tablename__ = "care_timeline_events"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    event_type = Column(String, nullable=False) # REGISTRATION, SYMPTOMS, AI_TRIAGE, CONSULTATION, DIAGNOSTICS, PRESCRIPTION, REFERRAL, TREATMENT, FOLLOW_UP
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=True)
    actor_name = Column(String, default="Health Worker")
    status = Column(String, default="COMPLETED")
    metadata_json = Column(Text, default="{}")

class Referral(Base):
    __tablename__ = "referrals"

    id = Column(String, primary_key=True, index=True) # e.g. REF-2026-001
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    originating_facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    destination_facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    referring_user = Column(String, nullable=False)
    reason = Column(Text, nullable=False)
    priority = Column(String, default="ROUTINE") # ROUTINE, URGENT, EMERGENCY
    required_specialty = Column(String, nullable=True)
    required_diagnostics = Column(String, nullable=True)
    status = Column(String, default="CREATED") # CREATED, SENT, ACCEPTED, APPOINTMENT_SCHEDULED, PATIENT_SEEN, COMPLETED, CANCELLED, EXPIRED, REJECTED
    created_at = Column(DateTime, default=datetime.utcnow)
    appointment_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)

class FollowUp(Base):
    __tablename__ = "follow_ups"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=True)
    health_worker_name = Column(String, default="ASHA Worker")
    due_date = Column(DateTime, nullable=False)
    status = Column(String, default="PENDING") # PENDING, COMPLETED, MISSED, CANCELLED
    risk_level = Column(String, default="LOW")
    notes = Column(Text, nullable=True)
    completed_at = Column(DateTime, nullable=True)

class QueueEntry(Base):
    __tablename__ = "queue_entries"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    doctor_name = Column(String, nullable=True)
    department = Column(String, default="General OPD")
    queue_number = Column(Integer, nullable=False)
    priority = Column(String, default="NORMAL") # NORMAL, URGENT, EMERGENCY
    status = Column(String, default="WAITING") # WAITING, WITH_DOCTOR, DIAGNOSTICS, COMPLETED, CANCELLED
    checked_in_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    specialty = Column(String, nullable=False)
    qualification = Column(String, nullable=False)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    is_available = Column(Boolean, default=True)
    teleconsult_available = Column(Boolean, default=True)
    max_daily_opd = Column(Integer, default=50)
    current_opd_count = Column(Integer, default=0)

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    doctor_name = Column(String, nullable=False)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    diagnosis = Column(String, nullable=False)
    medicines_json = Column(Text, nullable=False) # JSON array of {name, dosage, frequency, duration}
    notes = Column(Text, nullable=True)

class DiagnosticTest(Base):
    __tablename__ = "diagnostic_tests"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # Lab, Imaging, Pathology, ECG
    estimated_wait_mins = Column(Integer, default=15)

class DiagnosticReport(Base):
    __tablename__ = "diagnostic_reports"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    test_name = Column(String, nullable=False)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=True)
    ordered_by = Column(String, default="Dr. Medical Officer")
    status = Column(String, default="PENDING") # PENDING, PROCESSING, READY
    result_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    generic_name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    unit = Column(String, default="Tablets")

class MedicineInventory(Base):
    __tablename__ = "medicine_inventory"

    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=False)
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=False)
    stock_quantity = Column(Integer, default=0)
    low_stock_threshold = Column(Integer, default=50)
    last_updated = Column(DateTime, default=datetime.utcnow)

class Teleconsultation(Base):
    __tablename__ = "teleconsultations"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    doctor_name = Column(String, nullable=False)
    health_worker_name = Column(String, nullable=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=True)
    scheduled_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="SCHEDULED") # SCHEDULED, ACTIVE, COMPLETED, CANCELLED
    room_url = Column(String, nullable=True)
    notes = Column(Text, nullable=True)

class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, default="System")
    role = Column(String, default="HEALTH_WORKER")
    action = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(Text, nullable=True)
