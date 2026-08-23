"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { ShieldCheck, CheckCircle2, FileText, Search, CreditCard, Heart } from "lucide-react"

import { usePatients } from "@/hooks/use-api"

export default function InsurancePage() {
  const { data: patients } = usePatients()
  const [selectedPatientId, setSelectedPatientId] = useState("PAT-1001")
  const [claimStatus, setClaimStatus] = useState<"ACTIVE" | "PENDING" | "SUBMITTED">("ACTIVE")

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <Badge variant="outline" className="mb-1 text-xs font-bold text-emerald-600 border-emerald-500/20 bg-emerald-500/10">
              Ayushman Bharat (PM-JAY) & Cashless Coverage
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">Insurance & Scheme Coverage</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Check PM-JAY card eligibility, claim pre-authorization & cashless hospital pre-approvals</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            
            {/* PM-JAY Card Mockup */}
            <Card className="p-6 rounded-3xl border bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-200" />
                  <span className="font-bold text-sm">PM-JAY Ayushman Card</span>
                </div>
                <Badge variant="secondary" className="text-[10px] bg-white/20 text-white border-none">Active</Badge>
              </div>

              <div className="pt-4">
                <p className="text-xs text-emerald-100 font-medium">Beneficiary Name</p>
                <p className="text-xl font-bold tracking-wide">Ramesh Kumar</p>
                <p className="text-xs text-emerald-100 mt-2 font-mono">AB-PMJAY-9842-1049-3301</p>
              </div>

              <div className="pt-4 border-t border-white/20 flex justify-between text-xs">
                <div>
                  <p className="text-emerald-100 text-[10px]">Annual Coverage</p>
                  <p className="font-extrabold text-base">₹ 5,00,000</p>
                </div>
                <div>
                  <p className="text-emerald-100 text-[10px]">Available Balance</p>
                  <p className="font-extrabold text-base text-emerald-200">₹ 4,75,000</p>
                </div>
              </div>
            </Card>

            {/* Pre-Authorization Portal */}
            <Card className="lg:col-span-2 p-6 rounded-3xl border bg-card shadow-sm space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Hospital Pre-Authorization & Cashless Claim Status
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-2xl bg-secondary/30">
                  <p className="text-muted-foreground font-semibold">Associated Facility</p>
                  <p className="font-bold text-foreground mt-0.5">District Hospital Rampur</p>
                </div>
                <div className="p-3 rounded-2xl bg-secondary/30">
                  <p className="text-muted-foreground font-semibold">Specialty Package</p>
                  <p className="font-bold text-foreground mt-0.5">General Surgery & Inpatient Care</p>
                </div>
                <div className="p-3 rounded-2xl bg-secondary/30">
                  <p className="text-muted-foreground font-semibold">Pre-Auth Claim ID</p>
                  <p className="font-bold text-foreground mt-0.5">CLM-2026-8841</p>
                </div>
                <div className="p-3 rounded-2xl bg-secondary/30">
                  <p className="text-muted-foreground font-semibold">Claim Status</p>
                  <Badge variant="outline" className="mt-0.5 text-emerald-600 border-emerald-500/20 bg-emerald-500/10 font-bold">
                    PRE-APPROVED
                  </Badge>
                </div>
              </div>

              <div className="pt-2">
                <Button className="rounded-xl text-xs gap-2">
                  <FileText className="w-4 h-4" />
                  Generate Claim Certificate
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
