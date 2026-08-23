"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Plus, 
  RefreshCw, 
  ShieldAlert, 
  Stethoscope, 
  UserCheck 
} from "lucide-react"

import { useReferrals } from "@/hooks/use-api"
import { api } from "@/lib/api/client"

const LIFECYCLE_STAGES = [
  "CREATED",
  "SENT",
  "ACCEPTED",
  "APPOINTMENT_SCHEDULED",
  "PATIENT_SEEN",
  "COMPLETED"
]

export default function ReferralsPage() {
  const [filterStatus, setFilterStatus] = useState<string>("ALL")
  const [filterPriority, setFilterPriority] = useState<string>("ALL")

  const { data: referrals, loading, refetch } = useReferrals(
    filterStatus === "ALL" ? undefined : filterStatus,
    filterPriority === "ALL" ? undefined : filterPriority
  )

  const handleStatusTransition = async (referralId: string, nextStatus: string) => {
    try {
      await api.updateReferralStatus(referralId, nextStatus, `Updated via Referral Management portal to ${nextStatus}`)
      refetch()
    } catch (err: any) {
      alert(`Error updating referral status: ${err.message}`)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <Badge variant="outline" className="mb-1 text-xs font-bold text-blue-600 border-blue-500/20 bg-blue-500/10">
                Inter-Facility Healthcare Logistics
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight">Referral Lifecycle Management</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Track, transition and fulfill patient transfers across rural healthcare facilities</p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2 rounded-xl">
                <RefreshCw className="w-4 h-4" />
                Refresh Pipeline
              </Button>
            </div>
          </div>

          {/* Lifecycle Progress Banner */}
          <Card className="p-6 rounded-3xl border mb-8 bg-card shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Standard Inter-Facility Referral Lifecycle
            </h3>
            <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2">
              {LIFECYCLE_STAGES.map((stage, idx) => (
                <div key={stage} className="flex items-center gap-2 shrink-0">
                  <div className="px-3 py-1.5 rounded-xl border bg-secondary/50 text-xs font-bold text-foreground">
                    {stage}
                  </div>
                  {idx < LIFECYCLE_STAGES.length - 1 && (
                    <span className="text-muted-foreground font-bold">→</span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2 border rounded-xl px-3 py-1.5 bg-card text-xs">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-semibold text-muted-foreground">Status:</span>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent font-bold outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                {LIFECYCLE_STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 border rounded-xl px-3 py-1.5 bg-card text-xs">
              <span className="font-semibold text-muted-foreground">Priority:</span>
              <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-transparent font-bold outline-none cursor-pointer"
              >
                <option value="ALL">All Priorities</option>
                <option value="ROUTINE">ROUTINE</option>
                <option value="URGENT">URGENT</option>
                <option value="EMERGENCY">EMERGENCY</option>
              </select>
            </div>
          </div>

          {/* Referrals Cards Grid */}
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading active referral lifecycle records...</div>
          ) : !referrals || referrals.length === 0 ? (
            <Card className="p-12 rounded-3xl text-center border bg-card">
              <p className="text-base font-bold">No referrals matching criteria</p>
              <p className="text-xs text-muted-foreground mt-1">Create referrals from Health Worker Mode or PHC Command Center</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {referrals.map((ref) => (
                <Card key={ref.id} className="p-6 rounded-3xl border bg-card shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-primary">{ref.id}</span>
                      <p className="text-xs text-muted-foreground">Patient: {ref.patient_id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={ref.priority === "EMERGENCY" ? "destructive" : ref.priority === "URGENT" ? "default" : "outline"}>
                        {ref.priority}
                      </Badge>
                      <Badge variant="secondary" className="font-bold">{ref.status}</Badge>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-secondary/30 text-xs space-y-1.5">
                    <p><span className="font-bold">Clinical Reason:</span> {ref.reason}</p>
                    <p><span className="font-bold">Originating Facility:</span> Facility #{ref.originating_facility_id}</p>
                    <p><span className="font-bold">Destination Facility:</span> Facility #{ref.destination_facility_id}</p>
                    <p><span className="font-bold">Required Specialty:</span> {ref.required_specialty || "General Medicine"}</p>
                    <p><span className="font-bold">Referring Officer:</span> {ref.referring_user}</p>
                    <p><span className="font-bold">Created At:</span> {new Date(ref.created_at).toLocaleString()}</p>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="pt-2 border-t flex flex-wrap items-center gap-2">
                    {ref.status === "CREATED" && (
                      <Button size="sm" onClick={() => handleStatusTransition(ref.id, "SENT")} className="rounded-xl text-xs">
                        Mark Dispatched (SENT)
                      </Button>
                    )}
                    {ref.status === "SENT" && (
                      <Button size="sm" onClick={() => handleStatusTransition(ref.id, "ACCEPTED")} className="rounded-xl text-xs">
                        Accept Referral
                      </Button>
                    )}
                    {ref.status === "ACCEPTED" && (
                      <Button size="sm" onClick={() => handleStatusTransition(ref.id, "APPOINTMENT_SCHEDULED")} className="rounded-xl text-xs">
                        Schedule Appointment
                      </Button>
                    )}
                    {ref.status === "APPOINTMENT_SCHEDULED" && (
                      <Button size="sm" onClick={() => handleStatusTransition(ref.id, "PATIENT_SEEN")} className="rounded-xl text-xs">
                        Mark Patient Seen
                      </Button>
                    )}
                    {ref.status === "PATIENT_SEEN" && (
                      <Button size="sm" onClick={() => handleStatusTransition(ref.id, "COMPLETED")} className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700">
                        Mark Referral Completed
                      </Button>
                    )}
                    {ref.status !== "COMPLETED" && ref.status !== "CANCELLED" && (
                      <Button size="sm" variant="outline" onClick={() => handleStatusTransition(ref.id, "CANCELLED")} className="rounded-xl text-xs text-red-600 border-red-200">
                        Cancel Referral
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  )
}
