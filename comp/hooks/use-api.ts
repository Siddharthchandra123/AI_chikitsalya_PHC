"use client"

import { useState, useEffect, useCallback } from "react"

const BACKEND_URL = "http://localhost:8000/api"

type FetchState<T> = {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

function useGet<T>(path: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`${BACKEND_URL}${path}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<T>
      })
      .then((d) => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch((e) => { if (!cancelled) { setError(e.message); setLoading(false) } })

    return () => { cancelled = true }
  }, [path, tick])

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  return { data, loading, error, refetch }
}

export function usePatients() {
  return useGet<any[]>('/discharge/patients')
}

export function usePatient(patientId: string) {
  return useGet<any>(`/discharge/patient/${patientId}`)
}

export function useAppointments(patientId: string) {
  return useGet<any[]>(`/discharge/appointments/${patientId}`)
}

export function useActivity(patientId: string) {
  return useGet<any[]>(`/discharge/activity/${patientId}`)
}

export function usePrescriptions(patientId: string) {
  return useGet<any[]>(`/discharge/prescriptions/${patientId}`)
}

export function useReports(patientId: string) {
  return useGet<any[]>(`/discharge/reports/${patientId}`)
}

export function useBills(patientId: string) {
  return useGet<any[]>(`/discharge/bills/${patientId}`)
}

export function useAnalytics() {
  return useGet<any>('/discharge/analytics')
}

export async function createPatient(data: any) {
  const res = await fetch(`${BACKEND_URL}/discharge/patient`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error("Failed to create patient")
  return res.json()
}

export async function deletePatient(patientId: string) {
  const res = await fetch(`${BACKEND_URL}/discharge/patient/${patientId}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error("Failed to delete patient")
  return res.json()
}

export async function updatePatientCondition(patientId: string, condition: string) {
  const res = await fetch(`${BACKEND_URL}/discharge/patient/${patientId}/condition`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ condition })
  })
  if (!res.ok) throw new Error("Failed to update condition")
  return res.json()
}

export async function createPrescription(data: any) {
  const res = await fetch(`${BACKEND_URL}/discharge/prescription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error("Failed to create prescription")
  return res.json()
}

export async function createReport(data: any) {
  const res = await fetch(`${BACKEND_URL}/discharge/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error("Failed to create report")
  return res.json()
}

export async function uploadReport(formData: FormData) {
  const res = await fetch(`${BACKEND_URL}/discharge/report/upload`, {
    method: 'POST',
    body: formData
  })
  if (!res.ok) throw new Error("Failed to upload report")
  return res.json()
}

export async function createBill(data: any) {
  const res = await fetch(`${BACKEND_URL}/discharge/bill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error("Failed to create bill")
  return res.json()
}

export async function updateBillStatus(billId: number, status: string) {
  const res = await fetch(`${BACKEND_URL}/discharge/bill/${billId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })
  if (!res.ok) throw new Error("Failed to update bill status")
  return res.json()
}

export async function sendChatMessage(message: string) {
  const res = await fetch(`${BACKEND_URL}/discharge/ai-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })
  if (!res.ok) throw new Error("Failed to get chat response")
  return res.json()
}
