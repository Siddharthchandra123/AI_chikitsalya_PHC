import { 
  Patient, 
  CareTimelineEvent, 
  Referral, 
  Facility, 
  PharmacyItem, 
  Doctor, 
  QueueEntry, 
  FollowUp, 
  CommandOverview, 
  TriageResult 
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== "undefined" && window.location.hostname === "localhost" 
    ? "http://localhost:8000/api" 
    : "https://ai-chikitsalya-backend-6yl5.onrender.com/api");


async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`API Error (${res.status}): ${errorText || res.statusText}`);
  }
  return res.json();
}

export const api = {
  // Command Center
  getCommandOverview: (facilityId: number = 3) => 
    fetchJson<CommandOverview>(`${API_BASE}/command-center/overview?facility_id=${facilityId}`),
  
  getCommandQueue: (facilityId: number = 3) => 
    fetchJson<QueueEntry[]>(`${API_BASE}/command-center/queue?facility_id=${facilityId}`),

  // Patients
  getPatients: (riskLevel?: string, status?: string) => {
    const params = new URLSearchParams();
    if (riskLevel) params.append("risk_level", riskLevel);
    if (status) params.append("status", status);
    return fetchJson<Patient[]>(`${API_BASE}/patients?${params.toString()}`);
  },

  getPatient: (id: string) => 
    fetchJson<Patient>(`${API_BASE}/patients/${id}`),

  createPatient: (data: Partial<Patient>) => 
    fetchJson<Patient>(`${API_BASE}/patients`, { method: "POST", body: JSON.stringify(data) }),

  getPatientTimeline: (patientId: string) => 
    fetchJson<CareTimelineEvent[]>(`${API_BASE}/patients/${patientId}/timeline`),

  recordVitals: (patientId: string, vitals: Record<string, any>) => 
    fetchJson<{ status: string; high_risk: boolean }>(`${API_BASE}/patients/${patientId}/vitals`, {
      method: "POST",
      body: JSON.stringify({ patient_id: patientId, ...vitals })
    }),

  // AI Triage
  predictTriage: (symptoms: string[], context?: string, offline?: boolean) => 
    fetchJson<TriageResult>(`${API_BASE}/triage/predict`, {
      method: "POST",
      body: JSON.stringify({ symptoms, context, offline })
    }),

  // Referrals
  getReferrals: (status?: string, priority?: string) => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (priority) params.append("priority", priority);
    return fetchJson<Referral[]>(`${API_BASE}/referrals?${params.toString()}`);
  },

  createReferral: (data: Partial<Referral>) => 
    fetchJson<Referral>(`${API_BASE}/referrals`, { method: "POST", body: JSON.stringify(data) }),

  updateReferralStatus: (id: string, status: string, notes?: string) => 
    fetchJson<Referral>(`${API_BASE}/referrals/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes })
    }),

  // Facilities
  getFacilities: (level?: string, district?: string) => {
    const params = new URLSearchParams();
    if (level) params.append("level", level);
    if (district) params.append("district", district);
    return fetchJson<Facility[]>(`${API_BASE}/facilities?${params.toString()}`);
  },

  // Pharmacy Inventory
  getPharmacyInventory: (facilityId: number = 3) => 
    fetchJson<PharmacyItem[]>(`${API_BASE}/pharmacy/inventory?facility_id=${facilityId}`),

  // Doctors & Diagnostics
  getDoctors: (facilityId?: number) => 
    fetchJson<Doctor[]>(`${API_BASE}/doctors${facilityId ? `?facility_id=${facilityId}` : ''}`),

  getDiagnostics: () => 
    fetchJson<any[]>(`${API_BASE}/diagnostics/available`),

  // Follow-ups
  getFollowUps: (status?: string) => 
    fetchJson<FollowUp[]>(`${API_BASE}/followups${status ? `?status=${status}` : ''}`),

  // Audit Logs
  getAuditLogs: () => 
    fetchJson<any[]>(`${API_BASE}/audit-logs`)
};
