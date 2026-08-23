"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api/client"
import { 
  Patient, 
  CareTimelineEvent, 
  Referral, 
  Facility, 
  PharmacyItem, 
  Doctor, 
  QueueEntry, 
  FollowUp, 
  CommandOverview 
} from "@/lib/api/types"

interface HookResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCommandOverview(facilityId: number = 3): HookResult<CommandOverview> {
  const [data, setData] = useState<CommandOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api.getCommandOverview(facilityId)
      .then((res) => { if (active) { setData(res); setLoading(false); } })
      .catch((err) => { if (active) { setError(err.message || "Failed to fetch overview"); setLoading(false); } });
    return () => { active = false; };
  }, [facilityId, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, refetch };
}

export function useCommandQueue(facilityId: number = 3): HookResult<QueueEntry[]> {
  const [data, setData] = useState<QueueEntry[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.getCommandQueue(facilityId)
      .then((res) => { if (active) { setData(res); setLoading(false); } })
      .catch((err) => { if (active) { setError(err.message || "Failed to fetch queue"); setLoading(false); } });
    return () => { active = false; };
  }, [facilityId, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, refetch };
}

export function usePatients(riskLevel?: string, status?: string): HookResult<Patient[]> {
  const [data, setData] = useState<Patient[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.getPatients(riskLevel, status)
      .then((res) => { if (active) { setData(res); setLoading(false); } })
      .catch((err) => { if (active) { setError(err.message || "Failed to fetch patients"); setLoading(false); } });
    return () => { active = false; };
  }, [riskLevel, status, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, refetch };
}

export function usePatient(patientId: string): HookResult<Patient> {
  const [data, setData] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    if (!patientId) return;
    let active = true;
    setLoading(true);
    api.getPatient(patientId)
      .then((res) => { if (active) { setData(res); setLoading(false); } })
      .catch((err) => { if (active) { setError(err.message || "Failed to fetch patient"); setLoading(false); } });
    return () => { active = false; };
  }, [patientId, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, refetch };
}

export function usePatientTimeline(patientId: string): HookResult<CareTimelineEvent[]> {
  const [data, setData] = useState<CareTimelineEvent[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    if (!patientId) return;
    let active = true;
    setLoading(true);
    api.getPatientTimeline(patientId)
      .then((res) => { if (active) { setData(res); setLoading(false); } })
      .catch((err) => { if (active) { setError(err.message || "Failed to fetch care timeline"); setLoading(false); } });
    return () => { active = false; };
  }, [patientId, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, refetch };
}

export function useReferrals(status?: string, priority?: string): HookResult<Referral[]> {
  const [data, setData] = useState<Referral[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.getReferrals(status, priority)
      .then((res) => { if (active) { setData(res); setLoading(false); } })
      .catch((err) => { if (active) { setError(err.message || "Failed to fetch referrals"); setLoading(false); } });
    return () => { active = false; };
  }, [status, priority, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, refetch };
}

export function useFacilities(level?: string, district?: string): HookResult<Facility[]> {
  const [data, setData] = useState<Facility[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.getFacilities(level, district)
      .then((res) => { if (active) { setData(res); setLoading(false); } })
      .catch((err) => { if (active) { setError(err.message || "Failed to fetch facilities"); setLoading(false); } });
    return () => { active = false; };
  }, [level, district, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, refetch };
}

export function usePharmacyInventory(facilityId: number = 3): HookResult<PharmacyItem[]> {
  const [data, setData] = useState<PharmacyItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.getPharmacyInventory(facilityId)
      .then((res) => { if (active) { setData(res); setLoading(false); } })
      .catch((err) => { if (active) { setError(err.message || "Failed to fetch inventory"); setLoading(false); } });
    return () => { active = false; };
  }, [facilityId, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, refetch };
}

export function useDoctors(facilityId?: number): HookResult<Doctor[]> {
  const [data, setData] = useState<Doctor[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.getDoctors(facilityId)
      .then((res) => { if (active) { setData(res); setLoading(false); } })
      .catch((err) => { if (active) { setError(err.message || "Failed to fetch doctors"); setLoading(false); } });
    return () => { active = false; };
  }, [facilityId, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, refetch };
}

export function useFollowUps(status?: string): HookResult<FollowUp[]> {
  const [data, setData] = useState<FollowUp[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.getFollowUps(status)
      .then((res) => { if (active) { setData(res); setLoading(false); } })
      .catch((err) => { if (active) { setError(err.message || "Failed to fetch follow-ups"); setLoading(false); } });
    return () => { active = false; };
  }, [status, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, refetch };
}

export function useIncidents(facilityId?: number, status?: string): HookResult<any[]> {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.getIncidents(facilityId, status)
      .then((res) => { if (active) { setData(res); setLoading(false); } })
      .catch((err) => { if (active) { setError(err.message || "Failed to fetch incidents"); setLoading(false); } });
    return () => { active = false; };
  }, [facilityId, status, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, refetch };
}


// Helpers for pre-existing legacy UI compatibility
export function usePrescriptions(patientId?: string): HookResult<any[]> {
  return { data: [], loading: false, error: null, refetch: () => {} };
}
export function useActivity(patientId?: string): HookResult<any[]> {
  return { data: [], loading: false, error: null, refetch: () => {} };
}
export function useReports(patientId?: string): HookResult<any[]> {
  return { data: [], loading: false, error: null, refetch: () => {} };
}
export function useBills(patientId?: string): HookResult<any[]> {
  return { data: [], loading: false, error: null, refetch: () => {} };
}
export function useAnalytics(): HookResult<any> {
  return { data: {}, loading: false, error: null, refetch: () => {} };
}

export async function createPatient(data: any) {
  return api.createPatient({
    name: data.name,
    age: data.age || 30,
    gender: data.gender || "Female",
    village: data.ward || "Shahpur",
    blood_group: data.blood_type || "O+"
  });
}
export async function createPrescription(data: any) { return true; }
export async function createReport(data: any) { return true; }
export async function createBill(data: any) { return true; }
export async function uploadReport(data: any) { return true; }
export async function updatePatientCondition(id: string, cond: string) { return true; }
export async function deletePatient(id: string) { return true; }
export async function updateBillStatus(id: number, status: string) { return true; }
export async function sendChatMessage(message: string) {
  const triage = await api.predictTriage(["fever"], message, !navigator.onLine);
  return triage.reply || "AI Assistant response";
}

