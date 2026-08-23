import sys
import os
import json
import unittest

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app

class TestKafkaIntegration(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_01_health(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "online")
        self.assertIn("kafka_enabled", data)

    def test_02_kafka_health(self):
        response = self.client.get("/api/kafka/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("outbox_metrics", data)
        self.assertIn("patient.events", data["topics"])
        self.assertIn("appointment.events", data["topics"])

    def test_03_create_patient_event_flow(self):
        payload = {
            "name": "Test Kafka Patient",
            "age": 35,
            "gender": "Female",
            "village": "Rampur",
            "blood_group": "A+",
            "risk_level": "LOW"
        }
        response = self.client.post("/api/patients", json=payload)
        self.assertEqual(response.status_code, 200)
        patient = response.json()
        self.assertTrue(patient["id"].startswith("PAT-"))

    def test_04_create_referral_event_flow(self):
        payload = {
            "patient_id": "PAT-1001",
            "originating_facility_id": 3,
            "destination_facility_id": 1,
            "referring_user": "Dr. Verification Officer",
            "reason": "Cardiac Evaluation",
            "priority": "URGENT"
        }
        response = self.client.post("/api/referrals", json=payload)
        self.assertEqual(response.status_code, 200)
        ref = response.json()
        self.assertTrue(ref["id"].startswith("REF-"))

        # Update Referral Status
        status_resp = self.client.patch(f"/api/referrals/{ref['id']}/status", json={"status": "ACCEPTED", "notes": "Specialist available"})
        self.assertEqual(status_resp.status_code, 200)
        self.assertEqual(status_resp.json()["status"], "ACCEPTED")

    def test_05_appointment_event_flow(self):
        payload = {
            "patient_id": "PAT-1001",
            "facility_id": 3,
            "department": "General OPD",
            "doctor_name": "Dr. On Duty",
            "priority": "NORMAL"
        }
        response = self.client.post("/api/appointments", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "success")

    def test_06_prescription_event_flow(self):
        payload = {
            "patient_id": "PAT-1001",
            "doctor_name": "Dr. Amit Verma",
            "facility_id": 3,
            "diagnosis": "Acute Bronchitis",
            "medicines": [{"name": "Amoxicillin", "dosage": "500mg", "frequency": "1-1-1", "duration": "5 Days"}]
        }
        response = self.client.post("/api/prescriptions", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "success")

    def test_07_diagnostic_event_flow(self):
        req_resp = self.client.post("/api/diagnostics/request?patient_id=PAT-1001&test_name=Chest%20X-Ray")
        self.assertEqual(req_resp.status_code, 200)
        report_id = req_resp.json()["report_id"]

        res_resp = self.client.post(f"/api/diagnostics/result?report_id={report_id}&result_summary=Clear%20lung%20fields")
        self.assertEqual(res_resp.status_code, 200)

    def test_08_followup_event_flow(self):
        payload = {
            "patient_id": "PAT-1001",
            "facility_id": 3,
            "health_worker_name": "ASHA Worker Renu",
            "due_date": "2026-08-30T10:00:00Z",
            "risk_level": "LOW",
            "notes": "Check medication adherence"
        }
        response = self.client.post("/api/followups", json=payload)
        self.assertEqual(response.status_code, 200)

    def test_09_incident_event_flow(self):
        payload = {
            "facility_id": 3,
            "category": "MEDICINE_SHORTAGE",
            "title": "Low Stock Amoxicillin",
            "description": "Stock under threshold",
            "severity": "HIGH",
            "reported_by": "Pharmacist"
        }
        response = self.client.post("/api/incidents", json=payload)
        self.assertEqual(response.status_code, 200)

    def test_10_notifications_and_analytics(self):
        notif_resp = self.client.get("/api/notifications")
        self.assertEqual(notif_resp.status_code, 200)

        analytics_resp = self.client.get("/api/analytics/metrics")
        self.assertEqual(analytics_resp.status_code, 200)
        metrics = analytics_resp.json()
        self.assertIn("patient_volume", metrics)
        self.assertIn("referral_metrics", metrics)

if __name__ == "__main__":
    unittest.main()
