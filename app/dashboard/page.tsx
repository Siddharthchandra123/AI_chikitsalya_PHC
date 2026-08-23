"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { 
  Users, 
  Calendar, 
  Bed, 
  TrendingUp, 
  FileText, 
  AlertTriangle,
  Brain,
  Activity,
  Clock,
  Bell,
  Plus,
  RefreshCw,
  ChevronRight,
  ArrowUpRight,
  Stethoscope
} from "lucide-react"

import { useCommandOverview, useCommandQueue, usePatients, useReferrals } from "@/hooks/use-api"
import { useRBAC } from "@/lib/rbac-context"

export default function DashboardPage() {
  const { role, userName, facilityName } = useRBAC()
  const { data: overview, loading: overviewLoading, refetch } = useCommandOverview(3)
  const { data: queue, loading: queueLoading } = useCommandQueue(3)
  const { data: patients } = usePatients()
  const { data: referrals } = useReferrals()

  const stats = [
    { icon: Users, label: "Patients Today", value: overviewLoading ? "..." : (overview?.patients_today || 0).toString(), change: "+12%", color: "text-blue-500" },
    { icon: Calendar, label: "OPD Consultations", value: overviewLoading ? "..." : (overview?.opd_consultations || 0).toString(), change: "+8%", color: "text-emerald-500" },
    { icon: Bed, label: "Bed Availability", value: overviewLoading ? "..." : `${overview?.available_beds || 0}/${overview?.total_beds || 0}`, change: "Available", color: "text-amber-500" },
    { icon: ArrowUpRight, label: "Active Referrals", value: overviewLoading ? "..." : (referrals?.length || 0).toString(), change: "Active", color: "text-primary" },
  ]

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="gap-1.5 text-xs font-bold text-blue-600 bg-blue-500/10 border-blue-500/20">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Live Operational Telemetry
                </Badge>
                <Badge variant="secondary" className="text-xs">Role: {role}</Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{facilityName} Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Logged in as {userName}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2 rounded-xl">
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </Button>
              <Button size="sm" onClick={() => (window.location.href = "/health-worker")} className="gap-2 rounded-xl">
                <Plus className="w-4 h-4" />
                New Patient
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6 bg-card border shadow-sm rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <Badge variant="outline" className="text-xs font-bold">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-3xl font-extrabold">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Grid Section */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            
            {/* Live Queue */}
            <Card className="lg:col-span-2 p-6 rounded-3xl border bg-card shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Live Patient Queue ({queue?.length || 0})
                </h3>
                <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/command-center")} className="text-xs gap-1">
                  Full Command Center <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {queueLoading ? (
                <div className="py-8 text-center text-xs text-muted-foreground">Loading patient queue...</div>
              ) : !queue || queue.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">No patients currently in queue</div>
              ) : (
                <div className="space-y-3">
                  {queue.slice(0, 5).map((q) => (
                    <div key={q.queue_number} className="p-3 rounded-2xl bg-secondary/30 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-sm">#{q.queue_number}</span>
                        <span className="font-semibold text-foreground ml-2">{q.patient_name}</span>
                        <p className="text-[10px] text-muted-foreground">{q.department} • {q.doctor_name}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={q.priority === "EMERGENCY" ? "destructive" : "outline"} className="text-[10px]">
                          {q.priority}
                        </Badge>
                        <p className="text-[10px] text-blue-600 font-semibold mt-0.5">{q.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* AI Alerts & Quick Access */}
            <Card className="p-6 rounded-3xl border bg-card shadow-sm space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI Triage & Operations
              </h3>

              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-1">
                <p className="font-bold text-blue-900 dark:text-blue-200">AI Triage Active</p>
                <p className="text-[10px] text-blue-700 dark:text-blue-300">Safety rules engine running for emergency screening.</p>
              </div>

              <div className="space-y-2 pt-2">
                <Button onClick={() => (window.location.href = "/ai-detection")} className="w-full rounded-xl text-xs justify-between">
                  <span>AI Symptom Triage</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button onClick={() => (window.location.href = "/health-worker")} variant="outline" className="w-full rounded-xl text-xs justify-between">
                  <span>Health Worker Mode</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button onClick={() => (window.location.href = "/referrals")} variant="outline" className="w-full rounded-xl text-xs justify-between">
                  <span>Referral Lifecycle Pipeline</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button onClick={() => (window.location.href = "/patient/timeline")} variant="outline" className="w-full rounded-xl text-xs justify-between">
                  <span>Care Timeline & EHR</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
