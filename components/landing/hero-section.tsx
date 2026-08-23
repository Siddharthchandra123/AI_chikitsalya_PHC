"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, Wrench, ShieldAlert, ArrowUpRight, UserCheck, Stethoscope } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 text-xs font-bold mb-6"
            >
              <Building2 className="w-4 h-4" />
              Integrated PHC & Rural Hospital Operating System
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-balance"
            >
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AI Chikitsalya
              </span>
              <br />
              <span className="text-foreground">Solving Operational Bottlenecks in</span>
              <br />
              <span className="text-muted-foreground">PHCs & Rural Hospitals</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              A facility-centric platform built for PHC Medical Officers, Hospital Administrators, ASHA Coordinators, and District CMOs to manage OPD queue congestion, drug stock-outs, emergency referral transfers, and staff duty shift gaps.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button 
                size="lg" 
                onClick={() => (window.location.href = "/command-center")}
                className="rounded-xl text-sm font-bold px-7 gap-2 shadow-md"
              >
                PHC Command Center
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => (window.location.href = "/health-worker")}
                className="rounded-xl text-sm font-bold px-7 gap-2"
              >
                Health Worker Mode
                <UserCheck className="w-4 h-4" />
              </Button>
            </motion.div>

            {/* Facility Telemetry Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 grid grid-cols-3 gap-6 pt-6 border-t border-border/60"
            >
              <div>
                <div className="text-2xl font-extrabold text-blue-600">6 Tier</div>
                <div className="text-xs text-muted-foreground font-semibold">Facility Network</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-emerald-600">Real-Time</div>
                <div className="text-xs text-muted-foreground font-semibold">OPD Queue Telemetry</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-amber-600">Offline-First</div>
                <div className="text-xs text-muted-foreground font-semibold">Village Sync Engine</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Operational Problems Card Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-4"
          >
            <div className="p-6 rounded-3xl border bg-card shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-red-600" />
                  <span className="font-bold text-sm">PHC Operational Problem Resolution</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 border border-red-500/20">
                  Live Telemetry
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex justify-between font-bold text-amber-900 dark:text-amber-200">
                    <span>Essential Drug Stock-out Alert</span>
                    <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded">CRITICAL</span>
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-1">
                    PHC Shahpur: Anti-Snake Venom (ASV) & ORS stock low. Auto-requisition sent to District HQ.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex justify-between font-bold text-blue-900 dark:text-blue-200">
                    <span>Inter-Facility Emergency Referral Transfer</span>
                    <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded">ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-blue-800 dark:text-blue-300 mt-1">
                    PAT-1003 (Acute Coronary Syndrome) transferred from PHC Shahpur to District Hospital Rampur ICU.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex justify-between font-bold text-emerald-900 dark:text-emerald-200">
                    <span>OPD Queue Congestion Control</span>
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded">OPTIMIZED</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-1">
                    Average wait time reduced to 18 mins across 3 active doctors on duty.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
