import sys
import os
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from backend.main import app
except ModuleNotFoundError:
    from main import app

client = TestClient(app)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    print("[OK] Health check passed!")

def test_command_center():
    response = client.get("/api/command-center/overview")
    assert response.status_code == 200
    data = response.json()
    assert "patients_today" in data
    assert "referrals" in data
    print("[OK] Command Center Telemetry API passed!")

def test_patients():
    response = client.get("/api/patients")
    assert response.status_code == 200
    patients = response.json()
    assert len(patients) >= 5
    print(f"[OK] Patient list API passed! ({len(patients)} patients found)")

def test_care_timeline():
    response = client.get("/api/patients/PAT-1001/timeline")
    assert response.status_code == 200
    timeline = response.json()
    assert len(timeline) >= 5
    print(f"[OK] Longitudinal Care Timeline API passed! ({len(timeline)} timeline events)")

def test_referrals():
    response = client.get("/api/referrals")
    assert response.status_code == 200
    referrals = response.json()
    assert len(referrals) >= 2
    print(f"[OK] Referral Lifecycle API passed! ({len(referrals)} referrals active)")

def test_ai_triage():
    payload = {
        "symptoms": ["chest_pain", "breathing_difficulty"],
        "context": "Pain started 30 minutes ago",
        "lang": "en"
    }
    response = client.post("/api/triage/predict", json=payload)
    assert response.status_code == 200
    triage = response.json()
    assert triage["is_emergency"] == True
    assert triage["risk_level"] in ["HIGH", "CRITICAL"]
    print("[OK] AI Triage Safety & Emergency Escalation API passed!")

def test_pharmacy_inventory():
    response = client.get("/api/pharmacy/inventory?facility_id=3")
    assert response.status_code == 200
    items = response.json()
    assert len(items) >= 5
    print(f"[OK] Pharmacy Inventory API passed! ({len(items)} items in facility inventory)")

if __name__ == "__main__":
    print("\n=== Running Backend API Tests ===")
    test_health()
    test_command_center()
    test_patients()
    test_care_timeline()
    test_referrals()
    test_ai_triage()
    test_pharmacy_inventory()
    print("=== All Backend API Tests Passed Successfully! ===\n")
