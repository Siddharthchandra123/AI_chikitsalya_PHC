"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Building2, Users, ArrowUpRight, Pill, ShieldCheck, Activity, CheckCircle2 } from "lucide-react"

import { useFacilities, useReferrals, usePatients, useFollowUps } from "@/hooks/use-api"

export default function DistrictPage() {
  const { data: facilities } = useFacilities()
  const { data: referrals } = useReferrals()
  const { data: patients } = usePatients()
  const { data: followUps } = useFollowUps()

  const completedReferrals = referrals?.filter((r) => r.status === "COMPLETED").length || 0
  const totalReferrals = referrals?.length || 0
  const completionRate = totalReferrals ? Math.round((completedReferrals / totalReferrals) * 100) : 0

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <Badge variant="outline" className="mb-1 text-xs font-bold text-blue-600 border-blue-500/20 bg-blue-500/10">
              District Administration & Quality Telemetry
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">Rampur Health District HQ Overview</h1>
            <p className="text-sm text-muted-foreground mt-0.5">District Chief Medical Officer (CMO) operational dashboard</p>
          </div>

          {/* District Metrics Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-5 rounded-2xl bg-card border shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <p className="text-2xl font-extrabold">{facilities?.length || 5}</p>
              <p className="text-xs text-muted-foreground mt-1">Network Facilities Connected</p>
            </Card>

            <Card className="p-5 rounded-2xl bg-card border shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-2xl font-extrabold">{patients?.length || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Registered District Patients</p>
            </Card>

            <Card className="p-5 rounded-2xl bg-card border shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-3">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <p className="text-2xl font-extrabold">{completionRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">Referral Completion Rate ({completedReferrals}/{totalReferrals})</p>
            </Card>

            <Card className="p-5 rounded-2xl bg-card border shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
                <Activity className="w-5 h-5" />
              </div>
              <p className="text-2xl font-extrabold">{followUps?.filter(f => f.status === "COMPLETED").length || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Community Follow-ups Completed</p>
            </Card>
          </div>

          {/* District Facilities List */}
          <Card className="p-6 rounded-3xl border bg-card shadow-sm">
            <h2 className="text-lg font-bold mb-4">District Healthcare Network Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Facility Name</th>
                    <th className="pb-3 font-semibold">Tier Level</th>
                    <th className="pb-3 font-semibold">Block</th>
                    <th className="pb-3 font-semibold">Total Beds</th>
                    <th className="pb-3 font-semibold">Available Beds</th>
                    <th className="pb-3 font-semibold">Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {facilities?.map((f) => (
                    <tr key={f.id} className="hover:bg-secondary/40 transition">
                      <td className="py-3 font-bold text-foreground">{f.name}</td>
                      <td className="py-3">
                        <Badge variant="outline">{f.level}</Badge>
                      </td>
                      <td className="py-3">{f.block}</td>
                      <td className="py-3 font-semibold">{f.total_beds}</td>
                      <td className="py-3 font-bold text-emerald-600">{f.available_beds}</td>
                      <td className="py-3 text-muted-foreground">{f.operating_hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      </section>

      <Footer />
    </main>
  )
}
