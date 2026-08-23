import sys
import os
import json
import asyncio
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from backend.database import engine, Base, get_db, SessionLocal
    from backend import models, schemas
    from backend.seed_data import seed_database
    from backend.ai_engine import perform_ai_triage
    from backend.kafka import (
        get_kafka_producer,
        get_kafka_consumer,
        KafkaTopics,
        EventTypes,
        EventFactory,
        kafka_settings
    )
    from backend.kafka.outbox import process_outbox_events
    from backend.kafka.consumer import sse_broadcaster
except ModuleNotFoundError:
    from database import engine, Base, get_db, SessionLocal
    import models, schemas
    from seed_data import seed_database
    from ai_engine import perform_ai_triage
    from kafka import (
        get_kafka_producer,
        get_kafka_consumer,
        KafkaTopics,
        EventTypes,
        EventFactory,
        kafka_settings
    )
    from kafka.outbox import process_outbox_events
    from kafka.consumer import sse_broadcaster

logger = logging.getLogger("main")
logging.basicConfig(level=logging.INFO)

# Initialize DB tables and seed data
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title="AI Chikitsalya Backend API",
    description="Event-Driven Healthcare Integration Layer with Apache Kafka",
    version="2.0.0"
)

# CORS configuration allowing official render frontend and localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-chikitsalya-frontend.onrender.com",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Background Tasks & Lifespan
outbox_task = None

@app.on_event("startup")
async def startup_event():
    global outbox_task
    logger.info("Initializing AI Chikitsalya Backend with Kafka Event Bus...")
    producer = get_kafka_producer()
    await producer.start()
    outbox_task = asyncio.create_task(process_outbox_events())

@app.on_event("shutdown")
async def shutdown_event():
    global outbox_task
    if outbox_task:
        outbox_task.cancel()
    producer = get_kafka_producer()
    await producer.stop()

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

# Helper: Safely publish event asynchronously without blocking API request
def publish_domain_event(topic: str, event, db: Session):
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(get_kafka_producer().publish_event(topic=topic, event=event, db=db))
    except RuntimeError:
        asyncio.run(get_kafka_producer().publish_event(topic=topic, event=event, db=db))

# ==========================================
# HEALTH & OBSERVABILITY ENDPOINTS
# ==========================================

@app.get("/")
@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "AI Chikitsalya Backend API",
        "version": "2.0.0",
        "kafka_enabled": kafka_settings.enabled,
        "kafka_connected": get_kafka_producer().is_connected(),
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/kafka/health")
def kafka_health_check(db: Session = Depends(get_db)):
    producer = get_kafka_producer()
    consumer = get_kafka_consumer()

    outbox_pending = db.query(models.KafkaOutboxEvent).filter(models.KafkaOutboxEvent.status == "PENDING").count()
    outbox_published = db.query(models.KafkaOutboxEvent).filter(models.KafkaOutboxEvent.status == "PUBLISHED").count()
    outbox_dlt = db.query(models.KafkaOutboxEvent).filter(models.KafkaOutboxEvent.status == "DLT").count()

    return {
        "kafka_enabled": kafka_settings.enabled,
        "producer_connected": producer.is_connected(),
        "bootstrap_servers": kafka_settings.bootstrap_servers,
        "client_id": kafka_settings.client_id,
        "outbox_metrics": {
            "pending": outbox_pending,
            "published": outbox_published,
            "dlt": outbox_dlt
        },
        "consumer_stats": consumer.get_stats(),
        "topics": [
            KafkaTopics.PATIENT_EVENTS,
            KafkaTopics.APPOINTMENT_EVENTS,
            KafkaTopics.CONSULTATION_EVENTS,
            KafkaTopics.REFERRAL_EVENTS,
            KafkaTopics.DIAGNOSTIC_EVENTS,
            KafkaTopics.PRESCRIPTION_EVENTS,
            KafkaTopics.PHARMACY_EVENTS,
            KafkaTopics.FOLLOWUP_EVENTS,
            KafkaTopics.NOTIFICATION_EVENTS,
            KafkaTopics.FACILITY_EVENTS,
            KafkaTopics.ANALYTICS_EVENTS
        ]
    }

# ==========================================
# REAL-TIME SSE EVENT STREAM FOR FRONTEND
# ==========================================

@app.get("/api/realtime/stream")
async def realtime_event_stream():
    """
    Server-Sent Events (SSE) stream allowing Next.js frontend to receive near-real-time
    updates when Kafka consumer events occur.
    Browser -> FastAPI SSE Endpoint -> Kafka Consumer. (Browser NEVER connects to Kafka directly).
    """
    async def event_generator():
        queue = sse_broadcaster.subscribe()
        try:
            # Initial connection ping
            yield f"data: {json.dumps({'type': 'connected', 'timestamp': datetime.utcnow().isoformat()})}\n\n"
            while True:
                data = await queue.get()
                yield data
        except asyncio.CancelledError:
            sse_broadcaster.unsubscribe(queue)

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.get("/api/notifications", response_model=List[Dict[str, Any]])
def get_notifications(target_role: Optional[str] = None, patient_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.InAppNotification)
    if target_role:
        query = query.filter(models.InAppNotification.target_role == target_role)
    if patient_id:
        query = query.filter(models.InAppNotification.patient_id == patient_id)
    
    notifications = query.order_by(models.InAppNotification.created_at.desc()).limit(30).all()
    return [{
        "id": n.id,
        "event_id": n.event_id,
        "target_role": n.target_role,
        "patient_id": n.patient_id,
        "facility_id": n.facility_id,
        "title": n.title,
        "message": n.message,
        "event_type": n.event_type,
        "is_read": n.is_read,
        "created_at": n.created_at.isoformat()
    } for n in notifications]

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

    # Timeline event
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

    # Kafka Event: patient.created
    event = EventFactory.create_patient_event(
        event_type=EventTypes.PATIENT_CREATED,
        patient_id=new_id,
        patient_data={
            "name": payload.name,
            "age": payload.age,
            "gender": payload.gender,
            "village": payload.village,
            "risk_level": payload.risk_level or "LOW"
        },
        facility_id=3
    )
    publish_domain_event(KafkaTopics.PATIENT_EVENTS, event, db)

    return patient

@app.get("/api/patients/{patient_id}/timeline", response_model=List[schemas.CareTimelineEventOut])
def get_patient_timeline(patient_id: str, db: Session = Depends(get_db)):
    return db.query(models.CareTimelineEvent)\
        .filter(models.CareTimelineEvent.patient_id == patient_id)\
        .order_by(models.CareTimelineEvent.timestamp.asc()).all()

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

    is_high_risk = False
    if (payload.sp_o2 and payload.sp_o2 < 92) or (payload.bp_systolic and payload.bp_systolic > 160) or (payload.temperature and payload.temperature > 102):
        is_high_risk = True
        patient.risk_level = "HIGH"

    event = models.CareTimelineEvent(
        patient_id=patient_id,
        event_type="SYMPTOMS",
        title="Vitals Recorded",
        description=f"Temp {payload.temperature}°F, BP {payload.bp_systolic}/{payload.bp_diastolic}, SpO2 {payload.sp_o2}%. High Risk: {'Yes' if is_high_risk else 'No'}",
        actor_name=payload.recorded_by or "Health Worker",
        facility_id=3
    )
    db.add(event)
    db.commit()

    log_audit(db, payload.recorded_by or "Health Worker", "HEALTH_WORKER", "RECORD_VITALS", "PATIENT", patient_id, f"Recorded vitals for {patient_id}")

    # Kafka Event: patient.updated / vitals.recorded
    vitals_event = EventFactory.create_patient_event(
        event_type=EventTypes.PATIENT_UPDATED,
        patient_id=patient_id,
        patient_data={
            "vitals": payload.dict(),
            "is_high_risk": is_high_risk,
            "risk_level": patient.risk_level
        },
        facility_id=3
    )
    publish_domain_event(KafkaTopics.PATIENT_EVENTS, vitals_event, db)

    return {"status": "success", "patient_id": patient_id, "high_risk": is_high_risk}

# ==========================================
# AI TRIAGE ENGINE
# ==========================================

@app.post("/api/triage/predict", response_model=schemas.TriageResponse)
def triage_symptoms(payload: schemas.TriageRequest, db: Session = Depends(get_db)):
    result = perform_ai_triage(symptoms=payload.symptoms, context=payload.context or "", offline=payload.offline or False)
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

    patient = db.query(models.Patient).filter(models.Patient.id == payload.patient_id).first()
    if patient:
        patient.status = "REFERRED"
        if payload.priority in ["URGENT", "EMERGENCY"]:
            patient.risk_level = "HIGH"

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

    # Kafka Event: referral.created
    ref_event = EventFactory.create_referral_event(
        event_type=EventTypes.REFERRAL_CREATED,
        patient_id=payload.patient_id,
        referral_data={
            "referral_id": ref_id,
            "originating_facility_id": payload.originating_facility_id,
            "destination_facility_id": payload.destination_facility_id,
            "reason": payload.reason,
            "priority": payload.priority or "ROUTINE",
            "required_specialty": payload.required_specialty
        },
        actor_id=payload.referring_user,
        facility_id=payload.originating_facility_id
    )
    publish_domain_event(KafkaTopics.REFERRAL_EVENTS, ref_event, db)

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

    # Kafka Event: referral.accepted / referral.completed / referral.patient_seen
    ev_type = EventTypes.REFERRAL_UPDATED if payload.status != "ACCEPTED" else EventTypes.REFERRAL_ACCEPTED
    if payload.status == "COMPLETED":
        ev_type = EventTypes.REFERRAL_COMPLETED
    elif payload.status == "PATIENT_SEEN":
        ev_type = EventTypes.REFERRAL_PATIENT_SEEN

    ref_status_event = EventFactory.create_referral_event(
        event_type=ev_type,
        patient_id=referral.patient_id,
        referral_data={
            "referral_id": referral_id,
            "status": payload.status,
            "notes": payload.notes,
            "appointment_at": payload.appointment_at.isoformat() if payload.appointment_at else None
        },
        actor_id="Hospital Administrator",
        facility_id=referral.destination_facility_id
    )
    publish_domain_event(KafkaTopics.REFERRAL_EVENTS, ref_status_event, db)

    return referral

# ==========================================
# COMMAND CENTER TELEMETRY & APPOINTMENT QUEUE
# ==========================================

@app.get("/api/command-center/overview")
def get_command_center_overview(facility_id: Optional[int] = 3, db: Session = Depends(get_db)):
    facility = db.query(models.Facility).filter(models.Facility.id == facility_id).first()
    patients_today = db.query(models.Patient).count()
    opd_consultations = db.query(models.QueueEntry).filter(models.QueueEntry.status == "COMPLETED").count()
    emergency_cases = db.query(models.Referral).filter(models.Referral.priority == "EMERGENCY").count()
    waiting_patients = db.query(models.QueueEntry).filter(models.QueueEntry.status == "WAITING").count()
    active_doctors = db.query(models.Doctor).filter(models.Doctor.is_available == True).count()
    
    ref_incoming = db.query(models.Referral).filter(models.Referral.destination_facility_id == facility_id).count()
    ref_pending = db.query(models.Referral).filter(models.Referral.status == "SENT").count()
    ref_accepted = db.query(models.Referral).filter(models.Referral.status == "ACCEPTED").count()
    ref_completed = db.query(models.Referral).filter(models.Referral.status == "COMPLETED").count()

    low_stock = db.query(models.MedicineInventory)\
        .filter(models.MedicineInventory.facility_id == facility_id)\
        .filter(models.MedicineInventory.stock_quantity <= models.MedicineInventory.low_stock_threshold).count()

    return {
        "facility_name": facility.name if facility else "Primary Health Centre Shahpur",
        "facility_level": facility.level if facility else "PHC",
        "patients_today": patients_today,
        "opd_consultations": opd_consultations,
        "emergency_cases": emergency_cases,
        "waiting_patients": waiting_patients,
        "average_wait_mins": 18,
        "active_doctors": active_doctors,
        "total_beds": facility.total_beds if facility else 10,
        "available_beds": facility.available_beds if facility else 4,
        "referrals": {
            "incoming": ref_incoming,
            "pending": ref_pending,
            "accepted": ref_accepted,
            "completed": ref_completed,
            "overdue": 1
        },
        "low_stock_medicines_count": low_stock
    }

@app.get("/api/command-center/queue")
def get_command_center_queue(facility_id: Optional[int] = 3, db: Session = Depends(get_db)):
    entries = db.query(models.QueueEntry, models.Patient)\
        .join(models.Patient, models.QueueEntry.patient_id == models.Patient.id)\
        .order_by(models.QueueEntry.queue_number.asc()).all()

    return [{
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
    } for q, p in entries]

@app.post("/api/command-center/queue")
@app.post("/api/appointments")
def create_appointment_queue(payload: schemas.QueueCreate, db: Session = Depends(get_db)):
    patient = db.query(models.Patient).filter(models.Patient.id == payload.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    count = db.query(models.QueueEntry).filter(models.QueueEntry.facility_id == payload.facility_id).count()
    queue_num = count + 1

    entry = models.QueueEntry(
        patient_id=payload.patient_id,
        facility_id=payload.facility_id,
        doctor_name=payload.doctor_name,
        department=payload.department or "General OPD",
        queue_number=queue_num,
        priority=payload.priority or "NORMAL",
        status="WAITING",
        checked_in_at=datetime.utcnow()
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    # Kafka Event: appointment.created
    appt_event = EventFactory.create_appointment_event(
        event_type=EventTypes.APPOINTMENT_CREATED,
        patient_id=payload.patient_id,
        appointment_data={
            "queue_id": entry.id,
            "queue_number": queue_num,
            "department": entry.department,
            "doctor_name": entry.doctor_name,
            "priority": entry.priority
        },
        facility_id=payload.facility_id
    )
    publish_domain_event(KafkaTopics.APPOINTMENT_EVENTS, appt_event, db)

    return {"status": "success", "queue_number": queue_num, "entry_id": entry.id}

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
    return [{
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
    } for f in facilities]

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

@app.post("/api/pharmacy/inventory/update")
def update_pharmacy_stock(inventory_id: int, stock_quantity: int, db: Session = Depends(get_db)):
    inv = db.query(models.MedicineInventory).filter(models.MedicineInventory.id == inventory_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    inv.stock_quantity = stock_quantity
    inv.last_updated = datetime.utcnow()
    db.commit()

    # Kafka Event: inventory.updated
    inv_event = EventFactory.create_pharmacy_event(
        event_type=EventTypes.INVENTORY_UPDATED,
        pharmacy_data={
            "inventory_id": inv.id,
            "medicine_id": inv.medicine_id,
            "new_stock": stock_quantity
        },
        facility_id=inv.facility_id
    )
    publish_domain_event(KafkaTopics.PHARMACY_EVENTS, inv_event, db)

    return {"status": "success", "inventory_id": inventory_id, "stock_quantity": stock_quantity}

@app.post("/api/prescriptions")
def create_prescription(payload: schemas.PrescriptionCreate, db: Session = Depends(get_db)):
    prescription = models.Prescription(
        patient_id=payload.patient_id,
        doctor_name=payload.doctor_name,
        facility_id=payload.facility_id or 3,
        diagnosis=payload.diagnosis,
        medicines_json=json.dumps(payload.medicines),
        notes=payload.notes,
        date=datetime.utcnow()
    )
    db.add(prescription)
    db.commit()
    db.refresh(prescription)

    # Kafka Event: prescription.created
    rx_event = EventFactory.create_prescription_event(
        event_type=EventTypes.PRESCRIPTION_CREATED,
        patient_id=payload.patient_id,
        prescription_data={
            "prescription_id": prescription.id,
            "doctor_name": payload.doctor_name,
            "diagnosis": payload.diagnosis,
            "medicines": payload.medicines
        },
        actor_id=payload.doctor_name,
        facility_id=payload.facility_id or 3
    )
    publish_domain_event(KafkaTopics.PRESCRIPTION_EVENTS, rx_event, db)

    return {"status": "success", "prescription_id": prescription.id}

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

@app.post("/api/diagnostics/request")
def request_diagnostic(patient_id: str, test_name: str, ordered_by: Optional[str] = "Dr. Medical Officer", db: Session = Depends(get_db)):
    report = models.DiagnosticReport(
        patient_id=patient_id,
        test_name=test_name,
        facility_id=3,
        ordered_by=ordered_by,
        status="PENDING",
        created_at=datetime.utcnow()
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    # Kafka Event: diagnostic.requested
    diag_event = EventFactory.create_diagnostic_event(
        event_type=EventTypes.DIAGNOSTIC_REQUESTED,
        patient_id=patient_id,
        diagnostic_data={
            "report_id": report.id,
            "test_name": test_name,
            "ordered_by": ordered_by
        },
        facility_id=3
    )
    publish_domain_event(KafkaTopics.DIAGNOSTIC_EVENTS, diag_event, db)

    return {"status": "success", "report_id": report.id}

@app.post("/api/diagnostics/result")
def post_diagnostic_result(report_id: int, result_summary: str, db: Session = Depends(get_db)):
    report = db.query(models.DiagnosticReport).filter(models.DiagnosticReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Diagnostic report not found")

    report.status = "READY"
    report.result_summary = result_summary
    report.completed_at = datetime.utcnow()
    db.commit()

    # Kafka Event: diagnostic.result.available
    res_event = EventFactory.create_diagnostic_event(
        event_type=EventTypes.DIAGNOSTIC_RESULT_AVAILABLE,
        patient_id=report.patient_id,
        diagnostic_data={
            "report_id": report.id,
            "test_name": report.test_name,
            "result_summary": result_summary
        },
        facility_id=report.facility_id
    )
    publish_domain_event(KafkaTopics.DIAGNOSTIC_EVENTS, res_event, db)

    return {"status": "success", "report_id": report.id}

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

@app.post("/api/followups")
def create_followup(payload: schemas.FollowUpCreate, db: Session = Depends(get_db)):
    fup = models.FollowUp(
        patient_id=payload.patient_id,
        facility_id=payload.facility_id or 3,
        health_worker_name=payload.health_worker_name or "ASHA Worker",
        due_date=payload.due_date,
        risk_level=payload.risk_level or "LOW",
        notes=payload.notes,
        status="PENDING"
    )
    db.add(fup)
    db.commit()
    db.refresh(fup)

    # Kafka Event: followup.created
    fup_event = EventFactory.create_followup_event(
        event_type=EventTypes.FOLLOWUP_CREATED,
        patient_id=payload.patient_id,
        followup_data={
            "followup_id": fup.id,
            "due_date": payload.due_date.isoformat(),
            "notes": payload.notes,
            "health_worker": payload.health_worker_name
        },
        facility_id=payload.facility_id or 3
    )
    publish_domain_event(KafkaTopics.FOLLOWUP_EVENTS, fup_event, db)

    return {"status": "success", "followup_id": fup.id}

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

    # Kafka Event: facility.incident.reported
    inc_event = EventFactory.create_incident_event(
        event_type=EventTypes.INCIDENT_REPORTED,
        incident_data={
            "incident_id": incident.id,
            "category": payload.category,
            "title": payload.title,
            "severity": incident.severity
        },
        facility_id=payload.facility_id,
        actor_id=payload.reported_by
    )
    publish_domain_event(KafkaTopics.FACILITY_EVENTS, inc_event, db)

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

# ==========================================
# KAFKA ANALYTICS METRICS ENDPOINT
# ==========================================

@app.get("/api/analytics/metrics")
def get_analytics_metrics(db: Session = Depends(get_db)):
    """
    Real operational metrics calculated from actual DB state and Kafka event counts.
    NO hardcoded dashboard values.
    """
    total_patients = db.query(models.Patient).count()
    high_risk_patients = db.query(models.Patient).filter(models.Patient.risk_level.in_(["HIGH", "CRITICAL"])).count()
    
    total_referrals = db.query(models.Referral).count()
    completed_referrals = db.query(models.Referral).filter(models.Referral.status == "COMPLETED").count()
    accepted_referrals = db.query(models.Referral).filter(models.Referral.status == "ACCEPTED").count()
    
    referral_completion_rate = round((completed_referrals / total_referrals * 100), 1) if total_referrals > 0 else 0.0

    total_followups = db.query(models.FollowUp).count()
    completed_followups = db.query(models.FollowUp).filter(models.FollowUp.status == "COMPLETED").count()
    missed_followups = db.query(models.FollowUp).filter(models.FollowUp.status == "MISSED").count()
    
    followup_completion_rate = round((completed_followups / total_followups * 100), 1) if total_followups > 0 else 0.0

    low_stock_items = db.query(models.MedicineInventory)\
        .filter(models.MedicineInventory.stock_quantity <= models.MedicineInventory.low_stock_threshold).count()

    total_incidents = db.query(models.FacilityIncident).count()
    open_incidents = db.query(models.FacilityIncident).filter(models.FacilityIncident.status == "OPEN").count()

    kafka_events_published = db.query(models.KafkaOutboxEvent).filter(models.KafkaOutboxEvent.status == "PUBLISHED").count()

    return {
        "patient_volume": {
            "total_registered": total_patients,
            "high_risk_count": high_risk_patients
        },
        "referral_metrics": {
            "total_referrals": total_referrals,
            "completed": completed_referrals,
            "accepted": accepted_referrals,
            "completion_rate_pct": referral_completion_rate
        },
        "followup_metrics": {
            "total": total_followups,
            "completed": completed_followups,
            "missed": missed_followups,
            "completion_rate_pct": followup_completion_rate
        },
        "pharmacy_metrics": {
            "low_stock_count": low_stock_items
        },
        "incident_metrics": {
            "total_reported": total_incidents,
            "open": open_incidents
        },
        "event_bus_metrics": {
            "kafka_enabled": kafka_settings.enabled,
            "events_published_total": kafka_events_published
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
