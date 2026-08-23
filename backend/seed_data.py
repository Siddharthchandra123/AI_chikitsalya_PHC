import sys
import os
import json
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from backend.database import SessionLocal, engine, Base
    from backend import models
except ModuleNotFoundError:
    from database import SessionLocal, engine, Base
    import models


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if facilities already exist
    if db.query(models.Facility).first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding AI Chikitsalya Database...")

    # 1. Facilities (Hierarchy)
    f1 = models.Facility(
        id=1,
        name="District Hospital Rampur",
        level="District Hospital",
        district="Rampur",
        block="Central",
        address="Station Road, Rampur HQ",
        phone="+91-595-2345678",
        capabilities_json=json.dumps(["ICU", "CT Scan", "Dialysis", "Emergency Surgery", "Teleconsultation", "24/7 Pharmacy", "Blood Bank"]),
        specialties_json=json.dumps(["General Medicine", "Pediatrics", "Cardiology", "Obstetrics & Gynecology", "Orthopedics", "General Surgery"]),
        total_beds=200,
        available_beds=42,
        icu_beds=20,
        available_icu_beds=5,
        operating_hours="24/7"
    )

    f2 = models.Facility(
        id=2,
        name="Block Community Hospital Bilaspur",
        level="Rural Hospital",
        district="Rampur",
        block="Bilaspur",
        address="Main Highway, Bilaspur",
        phone="+91-595-2345111",
        capabilities_json=json.dumps(["Emergency OPD", "General Surgery", "X-Ray", "Blood Storage", "Pharmacy", "Teleconsultation"]),
        specialties_json=json.dumps(["General Medicine", "Pediatrics", "Obstetrics & Gynecology", "General Surgery"]),
        total_beds=50,
        available_beds=14,
        icu_beds=4,
        available_icu_beds=1,
        operating_hours="24/7"
    )

    f3 = models.Facility(
        id=3,
        name="Primary Health Centre (PHC) Shahpur",
        level="PHC",
        district="Rampur",
        block="Bilaspur",
        address="Gram Panchayat Road, Shahpur",
        phone="+91-595-2345222",
        capabilities_json=json.dumps(["General OPD", "Basic Lab", "Delivery Room", "Pharmacy", "Cold Chain Storage"]),
        specialties_json=json.dumps(["General Medicine", "Maternal & Child Health"]),
        total_beds=10,
        available_beds=4,
        icu_beds=0,
        available_icu_beds=0,
        operating_hours="8:00 AM - 8:00 PM"
    )

    f4 = models.Facility(
        id=4,
        name="Primary Health Centre (PHC) Chandpur",
        level="PHC",
        district="Rampur",
        block="Shahabad",
        address="Near Bus Stand, Chandpur",
        phone="+91-595-2345333",
        capabilities_json=json.dumps(["General OPD", "Immunization", "Basic Pharmacy", "ASHA Hub"]),
        specialties_json=json.dumps(["General Medicine", "Preventive Healthcare"]),
        total_beds=6,
        available_beds=2,
        icu_beds=0,
        available_icu_beds=0,
        operating_hours="8:00 AM - 5:00 PM"
    )

    f5 = models.Facility(
        id=5,
        name="Health Sub-Centre Khedi",
        level="Sub-centre",
        district="Rampur",
        block="Bilaspur",
        address="School Chowk, Village Khedi",
        phone="+91-98765-43210",
        capabilities_json=json.dumps(["ASHA Triage", "ANM Vitals Check", "First Aid", "Point-of-Care Diagnostics"]),
        specialties_json=json.dumps(["Primary Triage", "Community Nursing"]),
        total_beds=2,
        available_beds=2,
        icu_beds=0,
        available_icu_beds=0,
        operating_hours="9:00 AM - 4:00 PM"
    )

    db.add_all([f1, f2, f3, f4, f5])
    db.commit()

    # 2. Doctors
    d1 = models.Doctor(id=1, name="Dr. Ramesh Sharma", specialty="General Medicine", qualification="MBBS, MD", facility_id=3, is_available=True, teleconsult_available=True, max_daily_opd=40, current_opd_count=18)
    d2 = models.Doctor(id=2, name="Dr. Sunita Patel", specialty="Obstetrics & Gynecology", qualification="MBBS, DGO", facility_id=2, is_available=True, teleconsult_available=True, max_daily_opd=30, current_opd_count=12)
    d3 = models.Doctor(id=3, name="Dr. Rajesh Kumar", specialty="Pediatrics", qualification="MBBS, DCH", facility_id=2, is_available=True, teleconsult_available=False, max_daily_opd=35, current_opd_count=22)
    d4 = models.Doctor(id=4, name="Dr. Vikramaditya Singh", specialty="Cardiology", qualification="MBBS, MD, DM", facility_id=1, is_available=True, teleconsult_available=True, max_daily_opd=25, current_opd_count=14)
    d5 = models.Doctor(id=5, name="Dr. Priya Verma", specialty="General Surgery", qualification="MBBS, MS", facility_id=1, is_available=False, teleconsult_available=False, max_daily_opd=20, current_opd_count=8)

    db.add_all([d1, d2, d3, d4, d5])
    db.commit()

    # 3. Medicines & Inventory
    m1 = models.Medicine(id=1, code="MED-PCM", name="Paracetamol 500mg", generic_name="Paracetamol", category="Analgesic / Antipyretic", unit="Tablets")
    m2 = models.Medicine(id=2, code="MED-AMX", name="Amoxicillin 500mg", generic_name="Amoxicillin", category="Antibiotic", unit="Capsules")
    m3 = models.Medicine(id=3, code="MED-ORS", name="Oral Rehydration Salts (ORS)", generic_name="ORS Sachet", category="Electrolytes", unit="Sachets")
    m4 = models.Medicine(id=4, code="MED-AZI", name="Azithromycin 250mg", generic_name="Azithromycin", category="Antibiotic", unit="Tablets")
    m5 = models.Medicine(id=5, code="MED-MET", name="Metformin 500mg", generic_name="Metformin", category="Anti-diabetic", unit="Tablets")
    m6 = models.Medicine(id=6, code="MED-AML", name="Amlodipine 5mg", generic_name="Amlodipine", category="Anti-hypertensive", unit="Tablets")
    
    db.add_all([m1, m2, m3, m4, m5, m6])
    db.commit()

    # Facility Inventory
    inv1 = models.MedicineInventory(facility_id=3, medicine_id=1, stock_quantity=1450, low_stock_threshold=200)
    inv2 = models.MedicineInventory(facility_id=3, medicine_id=2, stock_quantity=320, low_stock_threshold=100)
    inv3 = models.MedicineInventory(facility_id=3, medicine_id=3, stock_quantity=800, low_stock_threshold=150)
    inv4 = models.MedicineInventory(facility_id=3, medicine_id=4, stock_quantity=45, low_stock_threshold=50) # LOW STOCK!
    inv5 = models.MedicineInventory(facility_id=3, medicine_id=5, stock_quantity=0, low_stock_threshold=50)  # OUT OF STOCK!

    inv6 = models.MedicineInventory(facility_id=1, medicine_id=1, stock_quantity=5000, low_stock_threshold=500)
    inv7 = models.MedicineInventory(facility_id=1, medicine_id=4, stock_quantity=1200, low_stock_threshold=200)
    inv8 = models.MedicineInventory(facility_id=1, medicine_id=5, stock_quantity=2400, low_stock_threshold=300)

    db.add_all([inv1, inv2, inv3, inv4, inv5, inv6, inv7, inv8])
    db.commit()

    # 4. Diagnostic Tests
    t1 = models.DiagnosticTest(id=1, code="DX-CBC", name="Complete Blood Count (CBC)", category="Lab", estimated_wait_mins=20)
    t2 = models.DiagnosticTest(id=2, code="DX-DENG", name="Dengue NS1 Antigen Test", category="Lab", estimated_wait_mins=15)
    t3 = models.DiagnosticTest(id=3, code="DX-ECG", name="12-Lead ECG", category="Cardiology", estimated_wait_mins=10)
    t4 = models.DiagnosticTest(id=4, code="DX-CXR", name="Chest X-Ray Digital", category="Imaging", estimated_wait_mins=25)
    t5 = models.DiagnosticTest(id=5, code="DX-RBS", name="Random Blood Sugar", category="Lab", estimated_wait_mins=5)

    db.add_all([t1, t2, t3, t4, t5])
    db.commit()

    # 5. Patients & Vitals
    p1 = models.Patient(id="PAT-1001", name="Ram Charan Devi", age=48, gender="Male", village="Khedi", phone="+91-98123-45678", blood_group="O+", risk_level="HIGH", status="REFERRED")
    p2 = models.Patient(id="PAT-1002", name="Meena Bai", age=32, gender="Female", village="Shahpur", phone="+91-98234-56789", blood_group="B+", risk_level="LOW", status="IN_OPD")
    p3 = models.Patient(id="PAT-1003", name="Sohan Lal Verma", age=65, gender="Male", village="Chandpur", phone="+91-98345-67890", blood_group="A+", risk_level="CRITICAL", status="DIAGNOSTICS")
    p4 = models.Patient(id="PAT-1004", name="Pooja Kumari", age=24, gender="Female", village="Khedi", phone="+91-98456-78901", blood_group="AB+", risk_level="MEDIUM", status="REGISTERED")
    p5 = models.Patient(id="PAT-1005", name="Aarav Singh", age=8, gender="Male", village="Shahpur", phone="+91-98567-89012", blood_group="O-", risk_level="LOW", status="DISCHARGED")

    db.add_all([p1, p2, p3, p4, p5])
    db.commit()

    # Vitals for Patients
    v1 = models.Vitals(patient_id="PAT-1001", temperature=101.4, bp_systolic=148, bp_diastolic=94, pulse=102, sp_o2=94, respiratory_rate=22, weight=68.5, height=168.0, recorded_by="ASHA Sunita")
    v2 = models.Vitals(patient_id="PAT-1002", temperature=98.6, bp_systolic=120, bp_diastolic=80, pulse=76, sp_o2=99, respiratory_rate=16, weight=54.0, height=155.0, recorded_by="ANM Reena")
    v3 = models.Vitals(patient_id="PAT-1003", temperature=99.2, bp_systolic=165, bp_diastolic=105, pulse=110, sp_o2=91, respiratory_rate=24, weight=72.0, height=172.0, recorded_by="ASHA Sunita")

    db.add_all([v1, v2, v3])
    db.commit()

    # Care Timeline Events for PAT-1001
    now = datetime.utcnow()
    e1 = models.CareTimelineEvent(patient_id="PAT-1001", event_type="REGISTRATION", title="Patient Registered", description="Registered at Sub-Centre Gram Khedi by ASHA worker.", timestamp=now - timedelta(days=2), facility_id=5, actor_name="ASHA Sunita")
    e2 = models.CareTimelineEvent(patient_id="PAT-1001", event_type="SYMPTOMS", title="High Fever & Chest Pain Reported", description="Complained of persistent high fever (101.4°F) and left-sided chest discomfort.", timestamp=now - timedelta(days=2, hours=1), facility_id=5, actor_name="ASHA Sunita")
    e3 = models.CareTimelineEvent(patient_id="PAT-1001", event_type="AI_TRIAGE", title="AI Triage Risk Escalation", description="AI Engine flagged High Risk (Score: 0.78). Emergency alert sent to PHC Medical Officer.", timestamp=now - timedelta(days=2, hours=2), facility_id=5, actor_name="AI Chikitsalya Engine")
    e4 = models.CareTimelineEvent(patient_id="PAT-1001", event_type="CONSULTATION", title="PHC Teleconsultation", description="Dr. Ramesh Sharma evaluated patient via video teleconsult.", timestamp=now - timedelta(days=1, hours=18), facility_id=3, actor_name="Dr. Ramesh Sharma")
    e5 = models.CareTimelineEvent(patient_id="PAT-1001", event_type="REFERRAL", title="Urgent Referral Created", description="Referred to District Hospital Rampur for Urgent Cardiology & ECG evaluation.", timestamp=now - timedelta(days=1, hours=12), facility_id=3, actor_name="Dr. Ramesh Sharma")

    db.add_all([e1, e2, e3, e4, e5])
    db.commit()

    # 6. Referrals
    r1 = models.Referral(
        id="REF-2026-001",
        patient_id="PAT-1001",
        originating_facility_id=3,
        destination_facility_id=1,
        referring_user="Dr. Ramesh Sharma",
        reason="Suspected Acute Coronary Syndrome with elevated blood pressure and chest distress.",
        priority="EMERGENCY",
        required_specialty="Cardiology",
        required_diagnostics="ECG, Troponin-I, Chest X-Ray",
        status="ACCEPTED",
        created_at=now - timedelta(hours=18),
        appointment_at=now + timedelta(hours=2),
        notes="Ambulance arranged from PHC Shahpur."
    )

    r2 = models.Referral(
        id="REF-2026-002",
        patient_id="PAT-1004",
        originating_facility_id=5,
        destination_facility_id=3,
        referring_user="ANM Reena",
        reason="Persistent vomiting and moderate dehydration requiring IV fluid administration.",
        priority="URGENT",
        required_specialty="General Medicine",
        required_diagnostics="Serum Electrolytes",
        status="SENT",
        created_at=now - timedelta(hours=4),
        notes="Patient advised to travel to PHC Shahpur OPD."
    )

    db.add_all([r1, r2])
    db.commit()

    # 7. Follow-ups
    fup1 = models.FollowUp(patient_id="PAT-1001", facility_id=3, health_worker_name="ASHA Sunita", due_date=now + timedelta(days=3), status="PENDING", risk_level="HIGH", notes="Post-referral discharge verification and vitals check.")
    fup2 = models.FollowUp(patient_id="PAT-1002", facility_id=3, health_worker_name="ASHA Rekha", due_date=now - timedelta(days=1), status="MISSED", risk_level="MEDIUM", notes="Missed hypertension medication review visit.")
    fup3 = models.FollowUp(patient_id="PAT-1005", facility_id=3, health_worker_name="ANM Reena", due_date=now - timedelta(days=2), status="COMPLETED", risk_level="LOW", notes="Pediatric fever recovery check completed successfully.", completed_at=now - timedelta(days=2))

    db.add_all([fup1, fup2, fup3])
    db.commit()

    # 8. Queue Entries
    q1 = models.QueueEntry(patient_id="PAT-1002", facility_id=3, doctor_name="Dr. Ramesh Sharma", department="General OPD", queue_number=14, priority="NORMAL", status="WITH_DOCTOR")
    q2 = models.QueueEntry(patient_id="PAT-1003", facility_id=3, doctor_name="Dr. Ramesh Sharma", department="General OPD", queue_number=15, priority="EMERGENCY", status="DIAGNOSTICS")
    q3 = models.QueueEntry(patient_id="PAT-1004", facility_id=3, doctor_name="Dr. Ramesh Sharma", department="General OPD", queue_number=16, priority="URGENT", status="WAITING")

    db.add_all([q1, q2, q3])
    db.commit()

    # 9. Audit Event
    a1 = models.AuditEvent(user_name="Dr. Ramesh Sharma", role="DOCTOR", action="CREATE_REFERRAL", entity_type="REFERRAL", entity_id="REF-2026-001", details="Created emergency referral for PAT-1001 from PHC Shahpur to District Hospital Rampur.")
    db.add_all([a1])
    db.commit()

    print("[SUCCESS] Database seeding complete!")
    db.close()

if __name__ == "__main__":
    seed_database()
