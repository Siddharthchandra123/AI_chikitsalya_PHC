export type Role = "PATIENT" | "HEALTH_WORKER" | "DOCTOR" | "PHC_ADMIN" | "HOSPITAL_ADMIN" | "DISTRICT_ADMIN";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  village: string;
  phone?: string;
  blood_group: string;
  emergency_contact?: string;
  registered_at: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "REGISTERED" | "IN_OPD" | "DIAGNOSTICS" | "ADMITTED" | "REFERRED" | "DISCHARGED";
}

export type TimelineEventType = 
  | "REGISTRATION" 
  | "SYMPTOMS" 
  | "AI_TRIAGE" 
  | "CONSULTATION" 
  | "DIAGNOSTICS" 
  | "PRESCRIPTION" 
  | "REFERRAL" 
  | "TREATMENT" 
  | "FOLLOW_UP";

export interface CareTimelineEvent {
  id: number;
  patient_id: string;
  event_type: TimelineEventType;
  title: string;
  description?: string;
  timestamp: string;
  facility_id?: number;
  actor_name: string;
  status: string;
}

export interface Referral {
  id: string;
  patient_id: string;
  originating_facility_id: number;
  destination_facility_id: number;
  referring_user: string;
  reason: string;
  priority: "ROUTINE" | "URGENT" | "EMERGENCY";
  required_specialty?: string;
  required_diagnostics?: string;
  status: "CREATED" | "SENT" | "ACCEPTED" | "APPOINTMENT_SCHEDULED" | "PATIENT_SEEN" | "COMPLETED" | "CANCELLED" | "EXPIRED" | "REJECTED";
  created_at: string;
  appointment_at?: string;
  completed_at?: string;
  notes?: string;
}

export interface Facility {
  id: number;
  name: string;
  level: "District Hospital" | "Rural Hospital" | "PHC" | "Sub-centre";
  district: string;
  block: string;
  address?: string;
  phone?: string;
  capabilities: string[];
  specialties: string[];
  total_beds: number;
  available_beds: number;
  icu_beds: number;
  available_icu_beds: number;
  operating_hours: string;
}

export interface PharmacyItem {
  inventory_id: number;
  medicine_id: number;
  code: string;
  name: string;
  generic_name: string;
  category: string;
  unit: string;
  stock_quantity: number;
  low_stock_threshold: number;
  status: "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK";
  last_updated: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  qualification: string;
  facility_name: string;
  is_available: boolean;
  teleconsult_available: boolean;
  max_daily_opd: number;
  current_opd_count: number;
}

export interface QueueEntry {
  queue_number: number;
  patient_id: string;
  patient_name: string;
  age: number;
  gender: string;
  department: string;
  doctor_name: string;
  priority: "NORMAL" | "URGENT" | "EMERGENCY";
  status: "WAITING" | "WITH_DOCTOR" | "DIAGNOSTICS" | "COMPLETED" | "CANCELLED";
  risk_level: string;
  checked_in_at: string;
}

export interface FollowUp {
  id: number;
  patient_id: string;
  patient_name: string;
  village: string;
  due_date: string;
  status: "PENDING" | "COMPLETED" | "MISSED" | "CANCELLED";
  risk_level: string;
  notes?: string;
  health_worker_name: string;
}

export interface CommandOverview {
  facility_name: string;
  facility_level: string;
  patients_today: number;
  opd_consultations: number;
  emergency_cases: number;
  waiting_patients: number;
  average_wait_mins: number;
  active_doctors: number;
  total_beds: number;
  available_beds: number;
  referrals: {
    incoming: number;
    pending: number;
    accepted: number;
    completed: number;
    overdue: number;
  };
  low_stock_medicines_count: number;
}

export interface TriageResult {
  assessment_status: string;
  condition?: string;
  confidence: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  risk_score: number;
  high_risk_symptoms: string[];
  is_emergency: boolean;
  emergency_message?: string;
  precautions: string[];
  reply: string;
  follow_up_questions: string[];
  top_predictions: { disease: string; confidence: number }[];
  edge_ai: boolean;
  rag_used: boolean;
}
