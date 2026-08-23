"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { 
  UserPlus, 
  Activity, 
  ShieldAlert, 
  ArrowUpRight, 
  Calendar, 
  Search, 
  CheckCircle2, 
  Wifi, 
  WifiOff, 
  Pill, 
  AlertTriangle, 
  HeartPulse, 
  Stethoscope, 
  Plus 
} from "lucide-react"

import { usePatients, useFollowUps, useReferrals, usePharmacyInventory, useFacilities } from "@/hooks/use-api"
import { api } from "@/lib/api/client"
import { queueOperation } from "@/lib/offline/sync-engine"
import { useRBAC } from "@/lib/rbac-context"

export default function HealthWorkerPage() {
  const { userName, facilityName } = useRBAC()
  
  const { data: patients, refetch: refetchPatients } = usePatients()
  const { data: followUps } = useFollowUps()
  const { data: referrals } = useReferrals()
  const { data: inventory } = usePharmacyInventory(3)
  const { data: facilities } = useFacilities()

  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"REGISTER" | "VITALS" | "REFERRAL" | "HIGH_RISK">("REGISTER")

  // Form states
  const [regForm, setRegForm] = useState({ name: "", age: 30, gender: "Female", village: "Shahpur", phone: "", blood_group: "O+" })
  const [vitalsForm, setVitalsForm] = useState({ patient_id: "PAT-1001", temperature: 98.6, bp_systolic: 120, bp_diastolic: 80, pulse: 72, sp_o2: 98 })
  const [refForm, setRefForm] = useState({ patient_id: "PAT-1001", destination_facility_id: 1, reason: "", priority: "ROUTINE", required_specialty: "General Medicine" })

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    try {
      if (!navigator.onLine) {
        queueOperation("CREATE_PATIENT", regForm)
        setMessage({ type: "success", text: "Offline Mode: Patient queued locally for auto-sync!" })
      } else {
        await api.createPatient(regForm)
        setMessage({ type: "success", text: "Patient registered successfully in database!" })
        refetchPatients()
      }
      setRegForm({ name: "", age: 30, gender: "Female", village: "Shahpur", phone: "", blood_group: "O+" })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to register patient" })
    }
  }

  const handleRecordVitals = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    try {
      if (!navigator.onLine) {
        queueOperation("RECORD_VITALS", vitalsForm)
        setMessage({ type: "success", text: "Offline Mode: Vitals queued locally!" })
      } else {
        const res = await api.recordVitals(vitalsForm.patient_id, vitalsForm)
        setMessage({ 
          type: "success", 
          text: `Vitals recorded! ${res.high_risk ? "⚠️ Warning: Flagged as High Risk!" : "Vitals within normal range."}` 
        })
        refetchPatients()
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to record vitals" })
    }
  }

  const handleCreateReferral = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    try {
      await api.createReferral({
        ...refForm,
        originating_facility_id: 3,
        referring_user: userName
      })
      setMessage({ type: "success", text: "Referral created and sent to destination facility!" })
      setRefForm({ patient_id: "PAT-1001", destination_facility_id: 1, reason: "", priority: "ROUTINE", required_specialty: "General Medicine" })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to create referral" })
    }
  }

  const filteredPatients = patients?.filter((p) => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.village.toLowerCase().includes(search.toLowerCase())
  ) || []

  const highRiskPatients = patients?.filter((p) => p.risk_level === "HIGH" || p.risk_level === "CRITICAL") || []

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <Badge variant="outline" className="mb-1 text-xs font-bold text-emerald-600 border-emerald-500/20 bg-emerald-500/10">
                Frontline Health Worker Dashboard
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight">ASHA / ANM Clinical Workspace</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Welcome, {userName} ({facilityName})</p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant={activeTab === "REGISTER" ? "default" : "outline"} 
                onClick={() => setActiveTab("REGISTER")}
                className="gap-2 rounded-xl text-xs"
              >
                <UserPlus className="w-4 h-4" />
                New Patient
              </Button>
              <Button 
                variant={activeTab === "VITALS" ? "default" : "outline"} 
                onClick={() => setActiveTab("VITALS")}
                className="gap-2 rounded-xl text-xs"
              >
                <Activity className="w-4 h-4" />
                Record Vitals
              </Button>
              <Button 
                variant={activeTab === "REFERRAL" ? "default" : "outline"} 
                onClick={() => setActiveTab("REFERRAL")}
                className="gap-2 rounded-xl text-xs"
              >
                <ArrowUpRight className="w-4 h-4" />
                New Referral
              </Button>
            </div>
          </div>

          {/* Feedback Banner */}
          {message && (
            <div className={`p-4 rounded-2xl mb-6 text-xs font-bold flex items-center gap-2 ${
              message.type === "success" ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20" : "bg-red-500/10 text-red-700 border border-red-500/20"
            }`}>
              <CheckCircle2 className="w-4 h-4" />
              {message.text}
            </div>
          )}

          {/* Action Tabs Content */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            
            {/* Main Interactive Form Box */}
            <Card className="lg:col-span-2 p-6 rounded-3xl border bg-card shadow-sm">
              {activeTab === "REGISTER" && (
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <UserPlus className="w-5 h-5 text-primary" />
                    Register New Village Patient
                  </h2>
                  <form onSubmit={handleRegisterPatient} className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={regForm.name} 
                        onChange={(e) => setRegForm({...regForm, name: e.target.value})}
                        placeholder="e.g. Ramesh Kumar" 
                        className="w-full p-2.5 rounded-xl border bg-background text-xs outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">Age (Years)</label>
                      <input 
                        required
                        type="number" 
                        value={regForm.age} 
                        onChange={(e) => setRegForm({...regForm, age: Number(e.target.value)})}
                        className="w-full p-2.5 rounded-xl border bg-background text-xs outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">Gender</label>
                      <select 
                        value={regForm.gender} 
                        onChange={(e) => setRegForm({...regForm, gender: e.target.value})}
                        className="w-full p-2.5 rounded-xl border bg-background text-xs outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">Village</label>
                      <input 
                        required
                        type="text" 
                        value={regForm.village} 
                        onChange={(e) => setRegForm({...regForm, village: e.target.value})}
                        className="w-full p-2.5 rounded-xl border bg-background text-xs outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">Phone Number</label>
                      <input 
                        type="text" 
                        value={regForm.phone} 
                        onChange={(e) => setRegForm({...regForm, phone: e.target.value})}
                        placeholder="+91-98XXX-XXXXX" 
                        className="w-full p-2.5 rounded-xl border bg-background text-xs outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">Blood Group</label>
                      <select 
                        value={regForm.blood_group} 
                        onChange={(e) => setRegForm({...regForm, blood_group: e.target.value})}
                        className="w-full p-2.5 rounded-xl border bg-background text-xs outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="A+">A+</option>
                        <option value="B+">B+</option>
                        <option value="O+">O+</option>
                        <option value="AB+">AB+</option>
                        <option value="O-">O-</option>
                        <option value="Unknown">Unknown</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 pt-2">
                      <Button type="submit" className="w-full rounded-xl">Register Patient</Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "VITALS" && (
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-primary" />
                    Record Patient Vitals & Screening
                  </h2>
                  <form onSubmit={handleRecordVitals} className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">Select Patient</label>
                      <select 
                        value={vitalsForm.patient_id} 
                        onChange={(e) => setVitalsForm({...vitalsForm, patient_id: e.target.value})}
                        className="w-full p-2.5 rounded-xl border bg-background text-xs outline-none"
                      >
                        {patients?.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">Temperature (°F)</label>
                      <input 
                        type="number" step="0.1"
                        value={vitalsForm.temperature} 
                        onChange={(e) => setVitalsForm({...vitalsForm, temperature: Number(e.target.value)})}
                        className="w-full p-2.5 rounded-xl border bg-background text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">BP Systolic (mmHg)</label>
                      <input 
                        type="number" 
                        value={vitalsForm.bp_systolic} 
                        onChange={(e) => setVitalsForm({...vitalsForm, bp_systolic: Number(e.target.value)})}
                        className="w-full p-2.5 rounded-xl border bg-background text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">BP Diastolic (mmHg)</label>
                      <input 
                        type="number" 
                        value={vitalsForm.bp_diastolic} 
                        onChange={(e) => setVitalsForm({...vitalsForm, bp_diastolic: Number(e.target.value)})}
                        className="w-full p-2.5 rounded-xl border bg-background text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">Pulse Rate (bpm)</label>
                      <input 
                        type="number" 
                        value={vitalsForm.pulse} 
                        onChange={(e) => setVitalsForm({...vitalsForm, pulse: Number(e.target.value)})}
                        className="w-full p-2.5 rounded-xl border bg-background text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">Oxygen SpO2 (%)</label>
                      <input 
                        type="number" 
                        value={vitalsForm.sp_o2} 
                        onChange={(e) => setVitalsForm({...vitalsForm, sp_o2: Number(e.target.value)})}
                        className="w-full p-2.5 rounded-xl border bg-background text-xs outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2 pt-2">
                      <Button type="submit" className="w-full rounded-xl">Save & Evaluate Vitals</Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "REFERRAL" && (
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <ArrowUpRight className="w-5 h-5 text-primary" />
                    Create Facility Referral
                  </h2>
                  <form onSubmit={handleCreateReferral} className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">Patient</label>
                      <select 
                        value={refForm.patient_id} 
                        onChange={(e) => setRefForm({...refForm, patient_id: e.target.value})}
                        className="w-full p-2.5 rounded-xl border bg-background text-xs outline-none"
                      >
                        {patients?.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">Destination Facility</label>
                      <select 
                        value={refForm.destination_facility_id} 
                        onChange={(e) => setRefForm({...refForm, destination_facility_id: Number(e.target.value)})}
                        className="w-full p-2.5 rounded-xl border bg-background text-xs outline-none"
                      >
                        {facilities?.map((f) => (
                          <option key={f.id} value={f.id}>{f.name} ({f.level})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">Priority</label>
                      <select 
                        value={refForm.priority} 
                        onChange={(e) => setRefForm({...refForm, priority: e.target.value})}
                        className="w-full p-2.5 rounded-xl border bg-background text-xs outline-none"
                      >
                        <option value="ROUTINE">ROUTINE</option>
                        <option value="URGENT">URGENT</option>
                        <option value="EMERGENCY">EMERGENCY</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-muted-foreground block mb-1">Required Specialty</label>
                      <input 
                        type="text"
                        value={refForm.required_specialty} 
                        onChange={(e) => setRefForm({...refForm, required_specialty: e.target.value})}
                        className="w-full p-2.5 rounded-xl border bg-background text-xs outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-muted-foreground block mb-1">Clinical Reason for Referral</label>
                      <textarea 
                        required
                        value={refForm.reason} 
                        onChange={(e) => setRefForm({...refForm, reason: e.target.value})}
                        placeholder="Detailed clinical rationale..." 
                        className="w-full p-2.5 rounded-xl border bg-background text-xs outline-none h-20"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Button type="submit" className="w-full rounded-xl">Generate & Dispatch Referral</Button>
                    </div>
                  </form>
                </div>
              )}
            </Card>

            {/* Sidebar: High-Risk Alert & Missed Follow-ups */}
            <div className="space-y-6">
              
              {/* High Risk Patients List */}
              <Card className="p-5 rounded-3xl border bg-card shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm flex items-center gap-2 text-red-600">
                    <ShieldAlert className="w-4 h-4" />
                    High-Risk Patients ({highRiskPatients.length})
                  </h3>
                </div>
                {highRiskPatients.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">No high-risk patients flagged</p>
                ) : (
                  <div className="space-y-2">
                    {highRiskPatients.map((hp) => (
                      <div key={hp.id} className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs">
                        <div className="flex justify-between font-bold text-red-900 dark:text-red-200">
                          <span>{hp.name}</span>
                          <Badge variant="destructive" className="text-[10px]">{hp.risk_level}</Badge>
                        </div>
                        <p className="text-[10px] text-red-700 dark:text-red-300 mt-1">{hp.id} • Village: {hp.village}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Missed Follow-ups */}
              <Card className="p-5 rounded-3xl border bg-card shadow-sm">
                <h3 className="font-bold text-sm flex items-center gap-2 text-amber-600 mb-3">
                  <Calendar className="w-4 h-4" />
                  Follow-ups Pending / Missed
                </h3>
                {followUps?.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">No pending follow-ups</p>
                ) : (
                  <div className="space-y-2">
                    {followUps?.map((fup) => (
                      <div key={fup.id} className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
                        <div className="flex justify-between font-bold">
                          <span>{fup.patient_name}</span>
                          <Badge variant={fup.status === "MISSED" ? "destructive" : "outline"} className="text-[10px]">{fup.status}</Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Due: {new Date(fup.due_date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

            </div>

          </div>

          {/* Registered Patients Directory */}
          <Card className="p-6 rounded-3xl border bg-card shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-bold">Village Patient Directory</h2>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                <input 
                  type="text" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, ID or village..." 
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border bg-background text-xs outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground uppercase tracking-wider">
                    <th className="pb-3 font-semibold">ID</th>
                    <th className="pb-3 font-semibold">Patient Name</th>
                    <th className="pb-3 font-semibold">Age / Gender</th>
                    <th className="pb-3 font-semibold">Village</th>
                    <th className="pb-3 font-semibold">Risk Level</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPatients.map((p) => (
                    <tr key={p.id} className="hover:bg-secondary/40 transition">
                      <td className="py-3 font-bold text-primary">{p.id}</td>
                      <td className="py-3 font-medium">{p.name}</td>
                      <td className="py-3">{p.age} y / {p.gender}</td>
                      <td className="py-3">{p.village}</td>
                      <td className="py-3">
                        <Badge variant={p.risk_level === "HIGH" || p.risk_level === "CRITICAL" ? "destructive" : "outline"}>
                          {p.risk_level}
                        </Badge>
                      </td>
                      <td className="py-3 font-semibold text-blue-600">{p.status}</td>
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
