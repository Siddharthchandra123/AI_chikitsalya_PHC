import re
from typing import List, Dict, Any

EMERGENCY_RULES = [
    {"pattern": r"chest pain|pressure in chest", "message": "🚨 EMERGENCY: Chest pain detected. Immediate cardiology / emergency transfer recommended.", "severity": "HIGH"},
    {"pattern": r"difficulty breathing|shortness of breath|gasping", "message": "🚨 EMERGENCY: Respiratory distress detected. Immediate oxygen support and doctor evaluation required.", "severity": "HIGH"},
    {"pattern": r"unconscious|fainted|unresponsive", "message": "🚨 EMERGENCY: Loss of consciousness detected. Immediate emergency resuscitation protocol required.", "severity": "HIGH"},
    {"pattern": r"severe bleeding|heavy hemorrhage", "message": "🚨 EMERGENCY: Severe bleeding detected. Apply direct pressure and seek urgent surgical intervention.", "severity": "HIGH"},
    {"pattern": r"stiff neck.*fever|fever.*stiff neck", "message": "🚨 EMERGENCY: High fever with nuchal rigidity detected. Suspected meningitis; immediate referral needed.", "severity": "HIGH"}
]

SEVERITY_WEIGHTS = {
    "fever": 4,
    "cough": 3,
    "headache": 3,
    "fatigue": 2,
    "body_ache": 3,
    "breathing_difficulty": 8,
    "nausea": 4,
    "sore_throat": 3,
    "runny_nose": 2,
    "sneezing": 2,
    "vomiting": 5,
    "dizziness": 4,
    "chest_pain": 9,
    "loss_of_consciousness": 10,
    "severe_pain": 7
}

DISEASE_KNOWLEDGE_BASE = {
    "Malaria / Dengue Fever": {
        "symptoms": ["fever", "body_ache", "headache", "fatigue", "nausea"],
        "precautions": ["Take ORS & stay hydrated", "Monitor temperature every 4 hours", "Use mosquito nets and repellent", "Get Blood Smear / Dengue NS1 test done at PHC"],
        "follow_up": ["Is there severe eye pain or joint pain?", "Have you noticed any skin rash or bleeding gums?"]
    },
    "Acute Respiratory Tract Infection": {
        "symptoms": ["fever", "cough", "sore_throat", "runny_nose", "sneezing"],
        "precautions": ["Steam inhalation 2-3 times daily", "Gargle with warm salt water", "Rest and adequate fluid intake", "Seek medical evaluation if high fever lasts >3 days"],
        "follow_up": ["Are you coughing up yellow or green phlegm?", "Is there any difficulty in swallowing?"]
    },
    "Hypertension Crisis / Cardiac Event": {
        "symptoms": ["chest_pain", "breathing_difficulty", "dizziness", "headache"],
        "precautions": ["Rest in comfortable position", "Do not perform strenuous activity", "Seek immediate emergency transportation to Rural/District Hospital", "Get ECG and BP checked immediately"],
        "follow_up": ["Does the pain radiate to left arm or jaw?", "Are you experiencing cold sweats?"]
    },
    "Gastroenteritis / Dehydration": {
        "symptoms": ["vomiting", "nausea", "fatigue", "body_ache"],
        "precautions": ["Administer ORS continuously after each loose stool/vomit", "Drink boiled and cooled water", "Avoid solid heavy food for 12 hours", "Seek health worker visit if unable to keep fluids down"],
        "follow_up": ["Have you passed urine in the last 6 hours?", "Is there intense stomach cramping?"]
    }
}

def perform_ai_triage(symptoms: List[str], context: str = "", offline: bool = False) -> Dict[str, Any]:
    raw_symptoms_text = " ".join([s.replace("_", " ") for s in symptoms])
    text_corpus = raw_symptoms_text + " " + (context or "")
    text_lower = text_corpus.lower()

    # 1. Emergency Rule Checking
    emergency_flag = False
    emergency_msg = None
    for rule in EMERGENCY_RULES:
        if re.search(rule["pattern"], text_lower):
            emergency_flag = True
            emergency_msg = rule["message"]
            break

    # 2. Risk Score Calculation
    total_score = 0
    high_risk_found = []
    for s in symptoms:
        weight = SEVERITY_WEIGHTS.get(s, 3)
        total_score += weight
        if weight >= 7:
            high_risk_found.append(s.replace("_", " ").title())

    risk_score = min(1.0, total_score / 18.0)
    if emergency_flag or risk_score >= 0.7:
        risk_level = "CRITICAL" if emergency_flag else "HIGH"
    elif risk_score >= 0.4:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # 3. Disease Pattern Matching
    top_matches = []
    best_disease = None
    best_match_score = 0

    for disease, data in DISEASE_KNOWLEDGE_BASE.items():
        overlap = len(set(symptoms).intersection(set(data["symptoms"])))
        match_confidence = round(min(0.95, overlap / max(len(data["symptoms"]), 1) + 0.2), 2)
        if match_confidence > 0.3:
            top_matches.append({"disease": disease, "confidence": match_confidence})
        if match_confidence > best_match_score:
            best_match_score = match_confidence
            best_disease = disease

    top_matches = sorted(top_matches, key=lambda x: x["confidence"], reverse=True)
    if not top_matches:
        top_matches = [{"disease": "General Viral Prodrome", "confidence": 0.45}]
        best_disease = "General Viral Prodrome"

    # 4. Clinical Safety Response Phrasing
    precautions = DISEASE_KNOWLEDGE_BASE.get(best_disease, {}).get("precautions", [
        "Drink plenty of clean, boiled water & fluids",
        "Take adequate rest",
        "Consult a certified doctor or ASHA worker if symptoms worsen"
    ])

    follow_ups = DISEASE_KNOWLEDGE_BASE.get(best_disease, {}).get("follow_up", [
        "How many days have these symptoms been present?",
        "Do you have any existing chronic conditions like Diabetes or Hypertension?"
    ])

    safety_disclaimer = "\n\n⚠️ DISCLAIMER: This is an automated preliminary risk triage and decision-support screening tool for rural health workers. It does NOT constitute a confirmed medical diagnosis. Please consult a qualified medical officer for official diagnosis and treatment."

    if emergency_flag:
        reply_text = f"CRITICAL SAFETY WARNING:\n{emergency_msg}\n\nRecommended Action: Immediately refer patient to Emergency OPD / District Hospital with ambulance support." + safety_disclaimer
    else:
        reply_text = f"Primary Screening Assessment: Possible pattern matching '{best_disease}' (Confidence: {int(best_match_score*100)}%).\n\nCare Guidelines:\n" + "\n".join([f"• {p}" for p in precautions]) + safety_disclaimer

    return {
        "assessment_status": "high_confidence" if best_match_score >= 0.65 else "moderate_confidence",
        "condition": best_disease,
        "confidence": best_match_score,
        "risk_level": risk_level,
        "risk_score": risk_score,
        "high_risk_symptoms": high_risk_found,
        "is_emergency": emergency_flag,
        "emergency_message": emergency_msg,
        "precautions": precautions,
        "reply": reply_text,
        "follow_up_questions": follow_ups,
        "top_predictions": top_matches,
        "edge_ai": True,
        "rag_used": not offline
    }
