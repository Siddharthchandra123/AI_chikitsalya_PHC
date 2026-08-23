"use client";

import { api } from "@/lib/api/client";

export type SyncState = "ONLINE" | "OFFLINE" | "SYNCING" | "SYNCED" | "SYNC FAILED";

export interface PendingOp {
  id: string;
  type: "CREATE_PATIENT" | "RECORD_VITALS" | "CREATE_REFERRAL" | "AI_TRIAGE";
  payload: any;
  timestamp: string;
  retries: number;
}

const STORAGE_KEY = "ai_chikitsalya_offline_queue";

export function getPendingQueue(): PendingOp[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function queueOperation(type: PendingOp["type"], payload: any): PendingOp {
  const queue = getPendingQueue();
  const newOp: PendingOp = {
    id: `OP-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    type,
    payload,
    timestamp: new Date().toISOString(),
    retries: 0,
  };
  queue.push(newOp);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  }
  return newOp;
}

export async function flushSyncQueue(): Promise<{ synced: number; failed: number }> {
  const queue = getPendingQueue();
  if (!queue.length) return { synced: 0, failed: 0 };

  let synced = 0;
  let failed = 0;
  const remaining: PendingOp[] = [];

  for (const op of queue) {
    try {
      if (op.type === "CREATE_PATIENT") {
        await api.createPatient(op.payload);
      } else if (op.type === "RECORD_VITALS") {
        await api.recordVitals(op.payload.patient_id, op.payload);
      } else if (op.type === "CREATE_REFERRAL") {
        await api.createReferral(op.payload);
      }
      synced++;
    } catch (e) {
      failed++;
      op.retries += 1;
      if (op.retries < 5) {
        remaining.push(op);
      }
    }
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
  }

  return { synced, failed };
}
