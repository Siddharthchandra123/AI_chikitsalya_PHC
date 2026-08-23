"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { 
  User, 
  Calendar, 
  Activity, 
  Stethoscope, 
  FileText, 
  Pill, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Heart,
  ChevronRight
} from "lucide-react"

import { usePatients, usePatient, usePatientTimeline } from "@/hooks/use-api"
import { TimelineEventType } from "@/lib/api/types"

const STAGE_ORDER: { type: TimelineEventType; label: string; icon: any }[] = [
  { type: "REGISTRATION", label: "Registration", icon: User },
  { type: "SYMPTOMS", label: "Symptoms", icon: Activity },
  { type: "AI_TRIAGE", label: "AI Triage", icon: ShieldAlert },
  { type: "CONSULTATION", label: "Consultation", icon: Stethoscope },
  { type: "DIAGNOSTICS", label: "Diagnostics", icon: FileText },
  { type: "PRESCRIPTION", label: "Prescription", icon: Pill },
  { type: "REFERRAL", label: "Referral", icon: ArrowUpRight },
  { type: "TREATMENT", label: "Treatment", icon: Heart },
  { type: "FOLLOW_UP", label: "Follow-up", icon: CheckCircle2 },
]

export default function PatientTimelinePage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("PAT-1001")

  const { data: patients, loading: patientsLoading } = usePatients()
  const { data: patient, loading: patientLoading } = usePatient(selectedPatientId)
  const { data: timeline, loading: timelineLoading } = usePatientTimeline(selectedPatientId)

  const activeTypes = new Set(timeline?.map((e) => e.event_type) || [])

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header & Patient Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <Badge variant="outline" className="mb-1 text-xs font-bold text-blue-600 border-blue-500/20 bg-blue-500/10">
                Care Continuity & Electronic Health Record
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight">Longitudinal Patient Timeline</h1>
              <p className="text-sm text-muted-foreground mt-0.5">End-to-end care progression generated from actual clinical events</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground">Select Patient:</span>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="bg-card border text-xs font-bold p-2.5 rounded-xl outline-none shadow-sm cursor-pointer"
              >
                {patients?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id} • {p.village})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Patient Health Summary Card */}
          {patient && (
            <Card className="p-6 rounded-3xl border mb-8 bg-card shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground font-semibold">Patient Name</p>
                  <p className="font-bold text-sm text-foreground mt-0.5">{patient.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-semibold">Age / Gender</p>
                  <p className="font-bold text-sm text-foreground mt-0.5">{patient.age} Yrs / {patient.gender}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-semibold">Village / Location</p>
                  <p className="font-bold text-sm text-foreground mt-0.5">{patient.village}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-semibold">Blood Group</p>
                  <p className="font-bold text-sm text-foreground mt-0.5">{patient.blood_group}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-semibold">Triage Risk Level</p>
                  <Badge variant={patient.risk_level === "HIGH" || patient.risk_level === "CRITICAL" ? "destructive" : "outline"} className="mt-0.5">
                    {patient.risk_level}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground font-semibold">Care Status</p>
                  <Badge variant="secondary" className="mt-0.5">{patient.status}</Badge>
                </div>
              </div>
            </Card>
          )}

          {/* Dynamic 9-Stage Care Progression Bar (NOT HARDCODED) */}
          <Card className="p-6 rounded-3xl border mb-8 bg-card shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Dynamic 9-Stage Care Progression
            </h3>
            <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2">
              {STAGE_ORDER.map((stage, idx) => {
                const isCompleted = activeTypes.has(stage.type)
                const IconComponent = stage.icon
                return (
                  <div key={stage.type} className="flex items-center gap-2 shrink-0">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${
                      isCompleted ? "bg-primary/10 text-primary border border-primary/20" : "bg-secondary/40 text-muted-foreground border border-border/40"
                    }`}>
                      <IconComponent className="w-4 h-4" />
                      <span>{stage.label}</span>
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    {idx < STAGE_ORDER.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Timeline Stream of Actual Events */}
          <Card className="p-6 rounded-3xl border bg-card shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              Chronological Event History ({timeline?.length || 0})
            </h2>

            {timelineLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Loading care timeline...</div>
            ) : !timeline || timeline.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">No events recorded for this patient yet</div>
            ) : (
              <div className="relative border-l-2 border-primary/20 ml-4 pl-6 space-y-6">
                {timeline.map((event) => (
                  <div key={event.id} className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                    <div className="p-4 rounded-2xl border bg-secondary/20 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-bold text-xs">{event.event_type}</Badge>
                          <h4 className="font-bold text-sm text-foreground">{event.title}</h4>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{event.description}</p>
                      <div className="flex items-center gap-4 mt-3 pt-2 border-t border-border/40 text-[10px] text-muted-foreground font-semibold">
                        <span>Recorded by: {event.actor_name}</span>
                        <span>Status: {event.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>
      </section>

      <Footer />
    </main>
  )
}
