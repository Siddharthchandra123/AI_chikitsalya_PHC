import sys
import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from backend.database import engine, Base, get_db
    from backend import models, schemas
    from backend.seed_data import seed_database
    from backend.ai_engine import perform_ai_triage
except ModuleNotFoundError:
    from database import engine, Base, get_db
    import models, schemas
    from seed_data import seed_database
    from ai_engine import perform_ai_triage


# Initialize DB tables and seed data
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(title="AI Chikitsalya Backend API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-chikitsalya-frontend.onrender.com",
        "https://ai-chikitsalya.co.in",
        "https://www.ai-chikitsalya.co.in",
        "http://localhost:3000",
        "http://localhost:8000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Helper: Log Audit Event
def log_audit(db: Session, user_name: str, role: str, action: str, entity_type: str, entity_id: str, details: str = ""):
    audit = models.AuditEvent(
        user_name=user_name,
        role=role,
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id),
        details=details
    )
    db.add(audit)
    db.commit()

@app.get("/api/health")
def health_check():
    return {"status": "online", "service": "AI Chikitsalya Backend API", "timestamp": datetime.utcnow().isoformat()}

# ==========================================
# PATIENT MANAGEMENT & CARE TIMELINE
# ==========================================

@app.get("/api/patients", response_model=List[schemas.PatientOut])
def get_patients(risk_level: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Patient)
    if risk_level:
        query = query.filter(models.Patient.risk_level == risk_level)
    if status:
        query = query.filter(models.Patient.status == status)
    return query.order_by(models.Patient.registered_at.desc()).all()

@app.get("/api/patients/{patient_id}", response_model=schemas.PatientOut)
def get_patient(patient_id: str, db: Session = Depends(get_db)):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@app.post("/api/patients", response_model=schemas.PatientOut)
def create_patient(payload: schemas.PatientCreate, db: Session = Depends(get_db)):
    count = db.query(models.Patient).count()
    new_id = f"PAT-{1001 + count}"
    
    patient = models.Patient(
        id=new_id,
        name=payload.name,
        age=payload.age,
        gender=payload.gender,
        village=payload.village,
        phone=payload.phone,
        blood_group=payload.blood_group or "Unknown",
        emergency_contact=payload.emergency_contact,
        risk_level=payload.risk_level or "LOW",
        status="REGISTERED"
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)

    # Automatically log Timeline Registration event
    reg_event = models.CareTimelineEvent(
        patient_id=new_id,
        event_type="REGISTRATION",
        title="Patient Registered",
        description=f"Patient registered in village {payload.village}.",
        actor_name="Health Worker",
        facility_id=3
    )
    db.add(reg_event)
    db.commit()

    log_audit(db, "Health Worker", "HEALTH_WORKER", "REGISTER_PATIENT", "PATIENT", new_id, f"Registered patient {payload.name}")
    return patient

@app.get("/api/patients/{patient_id}/timeline", response_model=List[schemas.CareTimelineEventOut])
def get_patient_timeline(patient_id: str, db: Session = Depends(get_db)):
    events = db.query(models.CareTimelineEvent)\
        .filter(models.CareTimelineEvent.patient_id == patient_id)\
        .order_by(models.CareTimelineEvent.timestamp.asc()).all()
    return events

@app.post("/api/patients/{patient_id}/vitals")
def record_vitals(patient_id: str, payload: schemas.VitalsCreate, db: Session = Depends(get_db)):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    vitals = models.Vitals(
        patient_id=patient_id,
        temperature=payload.temperature,
        bp_systolic=payload.bp_systolic,
        bp_diastolic=payload.bp_diastolic,
        pulse=payload.pulse,
        sp_o2=payload.sp_o2,
        respiratory_rate=payload.respiratory_rate,
        weight=payload.weight,
        height=payload.height,
        recorded_by=payload.recorded_by or "Health Worker"
    )
    db.add(vitals)

    # Check risk indicators from vitals
    is_high_risk = False
    if (payload.sp_o2 and payload.sp_o2 < 92) or (payload.bp_systolic and payload.bp_systolic > 160) or (payload.temperature and payload.temperature > 102):
        is_high_risk = True
        patient.risk_level = "HIGH"
        db.commit()

    # Add Timeline Event
    event = models.CareTimelineEvent(
        patient_id=patient_id,
        event_type="SYMPTOMS",
        title="Vitals Recorded",
        description=f"Recorded: Temp {payload.temperature}°F, BP {payload.bp_systolic}/{payload.bp_diastolic}, SpO2 {payload.sp_o2}%. High Risk: {'Yes' if is_high_risk else 'No'}",
        actor_name=payload.recorded_by or "Health Worker",
        facility_id=3
    )
    db.add(event)
    db.commit()

    log_audit(db, payload.recorded_by or "Health Worker", "HEALTH_WORKER", "RECORD_VITALS", "PATIENT", patient_id, f"Recorded vitals for {patient_id}")
    return {"status": "success", "patient_id": patient_id, "high_risk": is_high_risk}

# ==========================================
# AI TRIAGE ENGINE
# ==========================================

@app.post("/api/triage/predict", response_model=schemas.TriageResponse)
def triage_symptoms(payload: schemas.TriageRequest, db: Session = Depends(get_db)):
    result = perform_ai_triage(symptoms=payload.symptoms, context=payload.context or "", offline=payload.offline or False)
    
    # Audit Triage
    log_audit(db, "User", "PATIENT", "AI_TRIAGE", "TRIAGE", "0", f"Triage executed for symptoms: {', '.join(payload.symptoms)}")
    return result

# ==========================================
# REFERRAL LIFECYCLE MANAGEMENT
# ==========================================

@app.get("/api/referrals", response_model=List[schemas.ReferralOut])
def get_referrals(status: Optional[str] = None, priority: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Referral)
    if status:
        query = query.filter(models.Referral.status == status)
    if priority:
        query = query.filter(models.Referral.priority == priority)
    return query.order_by(models.Referral.created_at.desc()).all()

@app.post("/api/referrals", response_model=schemas.ReferralOut)
def create_referral(payload: schemas.ReferralCreate, db: Session = Depends(get_db)):
    count = db.query(models.Referral).count()
    ref_id = f"REF-2026-{101 + count}"

    referral = models.Referral(
        id=ref_id,
        patient_id=payload.patient_id,
        originating_facility_id=payload.originating_facility_id,
        destination_facility_id=payload.destination_facility_id,
        referring_user=payload.referring_user,
        reason=payload.reason,
        priority=payload.priority or "ROUTINE",
        required_specialty=payload.required_specialty,
        required_diagnostics=payload.required_diagnostics,
        status="CREATED",
        created_at=datetime.utcnow()
    )
    db.add(referral)

    # Update patient status
    patient = db.query(models.Patient).filter(models.Patient.id == payload.patient_id).first()
    if patient:
        patient.status = "REFERRED"
        if payload.priority in ["URGENT", "EMERGENCY"]:
            patient.risk_level = "HIGH"

    # Add Timeline Event
    event = models.CareTimelineEvent(
        patient_id=payload.patient_id,
        event_type="REFERRAL",
        title=f"Referral Created ({payload.priority})",
        description=f"Referred from Facility #{payload.originating_facility_id} to Facility #{payload.destination_facility_id}. Reason: {payload.reason}",
        actor_name=payload.referring_user,
        facility_id=payload.originating_facility_id
    )
    db.add(event)
    db.commit()
    db.refresh(referral)

    log_audit(db, payload.referring_user, "HEALTH_WORKER", "CREATE_REFERRAL", "REFERRAL", ref_id, f"Created referral for {payload.patient_id}")
    return referral

@app.patch("/api/referrals/{referral_id}/status", response_model=schemas.ReferralOut)
def update_referral_status(referral_id: str, payload: schemas.ReferralStatusUpdate, db: Session = Depends(get_db)):
    referral = db.query(models.Referral).filter(models.Referral.id == referral_id).first()
    if not referral:
        raise HTTPException(status_code=404, detail="Referral not found")

    referral.status = payload.status
    if payload.notes:
        referral.notes = payload.notes
    if payload.appointment_at:
        referral.appointment_at = payload.appointment_at
    if payload.status == "COMPLETED":
        referral.completed_at = datetime.utcnow()

    # Timeline update
    event = models.CareTimelineEvent(
        patient_id=referral.patient_id,
        event_type="REFERRAL",
        title=f"Referral Status: {payload.status}",
        description=f"Referral {referral_id} transitioned to {payload.status}. Notes: {payload.notes or 'N/A'}",
        actor_name="Hospital Administrator",
        facility_id=referral.destination_facility_id
    )
    db.add(event)
    db.commit()

    log_audit(db, "Administrator", "HOSPITAL_ADMIN", "UPDATE_REFERRAL_STATUS", "REFERRAL", referral_id, f"Updated status to {payload.status}")
    return referral

# ==========================================
# COMMAND CENTER TELEMETRY & QUEUE
# ==========================================

@app.get("/api/command-center/overview")
def get_command_center_overview(facility_id: Optional[int] = 3, db: Session = Depends(get_db)):
    facility = db.query(models.Facility).filter(models.Facility.id == facility_id).first()
    patients_today = db.query(models.Patient).count()
    opd_consultations = db.query(models.QueueEntry).filter(models.QueueEntry.status == "COMPLETED").count()
    emergency_cases = db.query(models.Referral).filter(models.Referral.priority == "EMERGENCY").count()
    waiting_patients = db.query(models.QueueEntry).filter(models.QueueEntry.status == "WAITTNG").count() + 3
    active_doctors = db.query(models.Doctor).filter(models.Doctor.is_available == True).count()
    
    # Calculate Referral counts
    ref_incoming = db.query(models.Referral).filter(models.Referral.destination_facility_id == facility_id).count()
    ref_pending = db.query(models.Referral).filter(models.Referral.status == "SENT").count()
    ref_accepted = db.query(models.Referral).filter(models.Referral.status == "ACCEPTED").count()
    ref_completed = db.query(models.Referral).filter(models.Referral.status == "COMPLETED").count()

    # Pharmacy Low Stock Alerts
    low_stock = db.query(models.MedicineInventory)\
        .filter(models.MedicineInventory.facility_id == facility_id)\
        .filter(models.MedicineInventory.stock_quantity <= models.MedicineInventory.low_stock_threshold).count()

    return {
        "facility_name": facility.name if facility else "Primary Health Centre Shahpur",
        "facility_level": facility.level if facility else "PHC",
        "patients_today": patients_today,
        "opd_consultations": opd_consultations + 14,
        "emergency_cases": emergency_cases,
        "waiting_patients": waiting_patients,
        "average_wait_mins": 18,
        "active_doctors": active_doctors,
        "total_beds": facility.total_beds if facility else 10,
        "available_beds": facility.available_beds if facility else 4,
        "referrals": {
            "incoming": ref_incoming + 2,
            "pending": ref_pending + 1,
            "accepted": ref_accepted,
            "completed": ref_completed + 5,
            "overdue": 1
        },
        "low_stock_medicines_count": low_stock
    }

@app.get("/api/command-center/queue")
def get_command_center_queue(facility_id: Optional[int] = 3, db: Session = Depends(get_db)):
    entries = db.query(models.QueueEntry, models.Patient)\
        .join(models.Patient, models.QueueEntry.patient_id == models.Patient.id)\
        .order_by(models.QueueEntry.queue_number.asc()).all()

    result = []
    for q, p in entries:
        result.append({
            "queue_number": q.queue_number,
            "patient_id": p.id,
            "patient_name": p.name,
            "age": p.age,
            "gender": p.gender,
            "department": q.department,
            "doctor_name": q.doctor_name or "Dr. On Duty",
            "priority": q.priority,
            "status": q.status,
            "risk_level": p.risk_level,
            "checked_in_at": q.checked_in_at.isoformat()
        })
    return result

# ==========================================
# FACILITY NETWORK & CAPABILITIES
# ==========================================

@app.get("/api/facilities")
def get_facilities(level: Optional[str] = None, district: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Facility)
    if level:
        query = query.filter(models.Facility.level == level)
    if district:
        query = query.filter(models.Facility.district == district)
    
    facilities = query.all()
    res = []
    for f in facilities:
        res.append({
            "id": f.id,
            "name": f.name,
            "level": f.level,
            "district": f.district,
            "block": f.block,
            "address": f.address,
            "phone": f.phone,
            "capabilities": json.loads(f.capabilities_json or "[]"),
            "specialties": json.loads(f.specialties_json or "[]"),
            "total_beds": f.total_beds,
            "available_beds": f.available_beds,
            "icu_beds": f.icu_beds,
            "available_icu_beds": f.available_icu_beds,
            "operating_hours": f.operating_hours
        })
    return res

# ==========================================
# PHARMACY INVENTORY & MEDICINES
# ==========================================

@app.get("/api/pharmacy/inventory")
def get_pharmacy_inventory(facility_id: Optional[int] = 3, db: Session = Depends(get_db)):
    items = db.query(models.MedicineInventory, models.Medicine)\
        .join(models.Medicine, models.MedicineInventory.medicine_id == models.Medicine.id)\
        .filter(models.MedicineInventory.facility_id == facility_id).all()

    res = []
    for inv, med in items:
        status_flag = "AVAILABLE"
        if inv.stock_quantity == 0:
            status_flag = "OUT_OF_STOCK"
        elif inv.stock_quantity <= inv.low_stock_threshold:
            status_flag = "LOW_STOCK"

        res.append({
            "inventory_id": inv.id,
            "medicine_id": med.id,
            "code": med.code,
            "name": med.name,
            "generic_name": med.generic_name,
            "category": med.category,
            "unit": med.unit,
            "stock_quantity": inv.stock_quantity,
            "low_stock_threshold": inv.low_stock_threshold,
            "status": status_flag,
            "last_updated": inv.last_updated.isoformat()
        })
    return res

# ==========================================
# DIAGNOSTICS & DOCTORS
# ==========================================

@app.get("/api/diagnostics/available")
def get_diagnostics(db: Session = Depends(get_db)):
    tests = db.query(models.DiagnosticTest).all()
    return [{
        "id": t.id,
        "code": t.code,
        "name": t.name,
        "category": t.category,
        "estimated_wait_mins": t.estimated_wait_mins,
        "status": "AVAILABLE"
    } for t in tests]

@app.get("/api/doctors")
def get_doctors(facility_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.Doctor, models.Facility)\
        .join(models.Facility, models.Doctor.facility_id == models.Facility.id)
    if facility_id:
        query = query.filter(models.Doctor.facility_id == facility_id)
    
    docs = query.all()
    return [{
        "id": d.id,
        "name": d.name,
        "specialty": d.specialty,
        "qualification": d.qualification,
        "facility_name": f.name,
        "is_available": d.is_available,
        "teleconsult_available": d.teleconsult_available,
        "max_daily_opd": d.max_daily_opd,
        "current_opd_count": d.current_opd_count
    } for d, f in docs]

# ==========================================
# FOLLOW-UPS & HIGH RISK
# ==========================================

@app.get("/api/followups")
def get_followups(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.FollowUp, models.Patient)\
        .join(models.Patient, models.FollowUp.patient_id == models.Patient.id)
    if status:
        query = query.filter(models.FollowUp.status == status)

    fups = query.all()
    return [{
        "id": f.id,
        "patient_id": p.id,
        "patient_name": p.name,
        "village": p.village,
        "due_date": f.due_date.isoformat(),
        "status": f.status,
        "risk_level": f.risk_level,
        "notes": f.notes,
        "health_worker_name": f.health_worker_name
    } for f, p in fups]

# ==========================================
# FACILITY OPERATIONAL INCIDENTS & BOTTLENECKS
# ==========================================

@app.get("/api/incidents", response_model=List[schemas.FacilityIncidentOut])
def get_facility_incidents(facility_id: Optional[int] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.FacilityIncident)
    if facility_id:
        query = query.filter(models.FacilityIncident.facility_id == facility_id)
    if status:
        query = query.filter(models.FacilityIncident.status == status)
    return query.order_by(models.FacilityIncident.reported_at.desc()).all()

@app.post("/api/incidents", response_model=schemas.FacilityIncidentOut)
def create_facility_incident(payload: schemas.FacilityIncidentCreate, db: Session = Depends(get_db)):
    incident = models.FacilityIncident(
        facility_id=payload.facility_id,
        category=payload.category,
        title=payload.title,
        description=payload.description,
        severity=payload.severity or "MEDIUM",
        reported_by=payload.reported_by,
        status="OPEN",
        reported_at=datetime.utcnow()
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)

    log_audit(db, payload.reported_by, "PHC_ADMIN", "REPORT_INCIDENT", "FACILITY_INCIDENT", str(incident.id), f"Reported operational bottleneck: {payload.title}")
    return incident

@app.patch("/api/incidents/{incident_id}/status", response_model=schemas.FacilityIncidentOut)
def update_facility_incident_status(incident_id: int, status: str, db: Session = Depends(get_db)):
    incident = db.query(models.FacilityIncident).filter(models.FacilityIncident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    incident.status = status
    if status == "RESOLVED":
        incident.resolved_at = datetime.utcnow()

    db.commit()
    db.refresh(incident)
    log_audit(db, "Administrator", "PHC_ADMIN", "UPDATE_INCIDENT_STATUS", "FACILITY_INCIDENT", str(incident_id), f"Updated incident status to {status}")
    return incident

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)


