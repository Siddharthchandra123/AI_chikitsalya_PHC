"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  Bed, 
  Clock, 
  Calendar, 
  RefreshCw, 
  ArrowUpRight, 
  CheckCircle2, 
  Stethoscope, 
  Pill, 
  ShieldAlert, 
  UserCheck, 
  Filter,
  FileText
} from "lucide-react"

import { 
  useCommandOverview, 
  useCommandQueue, 
  useReferrals, 
  usePharmacyInventory, 
  useDoctors, 
  useFollowUps 
} from "@/hooks/use-api"
import { useRBAC } from "@/lib/rbac-context"

export default function CommandCenterPage() {
  const { role, facilityName } = useRBAC()
  const [selectedFacilityId, setSelectedFacilityId] = useState<number>(3)

  const { data: overview, loading: overviewLoading, refetch: refetchOverview } = useCommandOverview(selectedFacilityId)
  const { data: queue, loading: queueLoading, refetch: refetchQueue } = useCommandQueue(selectedFacilityId)
  const { data: referrals, loading: referralsLoading } = useReferrals()
  const { data: inventory, loading: inventoryLoading } = usePharmacyInventory(selectedFacilityId)
  const { data: doctors, loading: doctorsLoading } = useDoctors(selectedFacilityId)
  const { data: followUps, loading: followUpsLoading } = useFollowUps()

  const handleRefreshAll = () => {
    refetchOverview()
    refetchQueue()
  }

  const lowStockItems = inventory?.filter((i) => i.status !== "AVAILABLE") || []

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Command Center Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="gap-1.5 py-1 px-3 bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  PHC / Hospital Command Center
                </Badge>
                <Badge variant="secondary" className="text-xs">Role: {role}</Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{overview?.facility_name || facilityName}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Real-time facility operations, patient queue, telemetry & emergency logistics</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border rounded-xl px-3 py-1.5 bg-background text-xs">
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                <select 
                  value={selectedFacilityId}
                  onChange={(e) => setSelectedFacilityId(Number(e.target.value))}
                  className="bg-transparent font-semibold outline-none cursor-pointer"
                >
                  <option value={3}>PHC Shahpur</option>
                  <option value={2}>Block Hospital Bilaspur</option>
                  <option value={1}>District Hospital Rampur</option>
                </select>
              </div>

              <Button variant="outline" size="sm" onClick={handleRefreshAll} className="gap-2 rounded-xl">
                <RefreshCw className="w-4 h-4" />
                Refresh Telemetry
              </Button>
            </div>
          </div>

          {/* Overview Metrics Cards (Dynamic backend data) */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-5 rounded-2xl bg-card border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-xs font-semibold text-blue-600">Today</Badge>
              </div>
              <p className="text-2xl font-extrabold">{overviewLoading ? "..." : overview?.patients_today || 0}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Total Patient Registrations</p>
            </Card>

            <Card className="p-5 rounded-2xl bg-card border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-xs font-semibold text-emerald-600">OPD</Badge>
              </div>
              <p className="text-2xl font-extrabold">{overviewLoading ? "..." : overview?.opd_consultations || 0}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Completed Consultations</p>
            </Card>

            <Card className="p-5 rounded-2xl bg-card border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Clock className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-xs font-semibold text-amber-600">Live Queue</Badge>
              </div>
              <p className="text-2xl font-extrabold">{overviewLoading ? "..." : `${overview?.average_wait_mins || 0} mins`}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Average Wait Time ({overview?.waiting_patients || 0} waiting)</p>
            </Card>

            <Card className="p-5 rounded-2xl bg-card border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <Badge variant="destructive" className="text-xs font-semibold">Urgent</Badge>
              </div>
              <p className="text-2xl font-extrabold">{overviewLoading ? "..." : overview?.emergency_cases || 0}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Emergency Escalation Cases</p>
            </Card>
          </div>

          {/* Main Command Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            
            {/* Column 1 & 2: Patient Queue & Referral Tracker */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Patient Queue Table */}
              <Card className="p-6 rounded-3xl border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Live Outpatient Queue ({queue?.length || 0})
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Real-time OPD triage & queue position</p>
                  </div>
                  <Badge variant="outline">{overview?.facility_level}</Badge>
                </div>

                {queueLoading ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">Loading queue telemetry...</div>
                ) : !queue || queue.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">No patients currently waiting in queue</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b text-muted-foreground uppercase tracking-wider">
                          <th className="pb-3 font-semibold">Token</th>
                          <th className="pb-3 font-semibold">Patient Name</th>
                          <th className="pb-3 font-semibold">Department</th>
                          <th className="pb-3 font-semibold">Priority</th>
                          <th className="pb-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {queue.map((q) => (
                          <tr key={q.queue_number} className="hover:bg-secondary/40 transition">
                            <td className="py-3 font-bold">#{q.queue_number}</td>
                            <td className="py-3 font-medium">
                              <div>{q.patient_name} ({q.age}y/{q.gender[0]})</div>
                              <div className="text-[10px] text-muted-foreground">{q.patient_id}</div>
                            </td>
                            <td className="py-3">{q.department}</td>
                            <td className="py-3">
                              <Badge variant={q.priority === "EMERGENCY" ? "destructive" : q.priority === "URGENT" ? "default" : "outline"}>
                                {q.priority}
                              </Badge>
                            </td>
                            <td className="py-3 font-semibold text-blue-600">{q.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>

              {/* Referrals Lifecycle Card */}
              <Card className="p-6 rounded-3xl border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <ArrowUpRight className="w-5 h-5 text-primary" />
                      Inter-Facility Referral Pipeline
                    </h2>
                    <p className="text-xs text-muted-foreground">Lifecycle tracking: CREATED → ACCEPTED → APPOINTMENT → COMPLETED</p>
                  </div>
                </div>

                {referralsLoading ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">Loading referral pipeline...</div>
                ) : !referrals || referrals.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">No active referrals recorded</div>
                ) : (
                  <div className="space-y-3">
                    {referrals.map((ref) => (
                      <div key={ref.id} className="p-4 rounded-2xl border bg-secondary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">{ref.id}</span>
                            <Badge variant={ref.priority === "EMERGENCY" ? "destructive" : "outline"} className="text-[10px]">
                              {ref.priority}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px]">{ref.status}</Badge>
                          </div>
                          <p className="text-xs font-medium text-foreground mt-1">{ref.reason}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Specialty Required: {ref.required_specialty || "General"}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-blue-600 block">{ref.referring_user}</span>
                          <span className="text-[10px] text-muted-foreground">{new Date(ref.created_at).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

            </div>

            {/* Column 3: Facility Resources, Pharmacy & Doctor Utilization */}
            <div className="space-y-6">

              {/* Bed & ICU Capacity */}
              <Card className="p-6 rounded-3xl border shadow-sm">
                <h3 className="font-bold text-sm flex items-center gap-2 mb-4">
                  <Bed className="w-4 h-4 text-primary" />
                  Bed & ICU Capacity
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>General Beds</span>
                      <span>{overview?.available_beds || 0} / {overview?.total_beds || 0} Available</span>
                    </div>
                    <Progress value={((overview?.total_beds ? (overview.total_beds - overview.available_beds) / overview.total_beds : 0) * 100)} className="h-2" />
                  </div>
                </div>
              </Card>

              {/* Pharmacy Low-Stock Telemetry */}
              <Card className="p-6 rounded-3xl border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Pill className="w-4 h-4 text-amber-500" />
                    Essential Medicine Inventory
                  </h3>
                  <Badge variant="outline" className="text-[10px]">{lowStockItems.length} Alerts</Badge>
                </div>

                {inventoryLoading ? (
                  <div className="py-4 text-center text-xs text-muted-foreground">Loading pharmacy inventory...</div>
                ) : lowStockItems.length === 0 ? (
                  <div className="py-4 text-center text-xs text-emerald-600 font-medium">All essential medicine stocks adequate</div>
                ) : (
                  <div className="space-y-2">
                    {lowStockItems.map((item) => (
                      <div key={item.code} className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-amber-900 dark:text-amber-200">{item.name}</p>
                          <p className="text-[10px] text-amber-700 dark:text-amber-400">{item.category}</p>
                        </div>
                        <Badge variant={item.status === "OUT_OF_STOCK" ? "destructive" : "outline"} className="text-[10px]">
                          {item.stock_quantity} {item.unit}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Doctors Roster */}
              <Card className="p-6 rounded-3xl border shadow-sm">
                <h3 className="font-bold text-sm flex items-center gap-2 mb-4">
                  <UserCheck className="w-4 h-4 text-primary" />
                  Doctor Utilization & Roster
                </h3>

                {doctorsLoading ? (
                  <div className="py-4 text-center text-xs text-muted-foreground">Loading doctor roster...</div>
                ) : !doctors || doctors.length === 0 ? (
                  <div className="py-4 text-center text-xs text-muted-foreground">No doctors on duty</div>
                ) : (
                  <div className="space-y-3">
                    {doctors.map((doc) => (
                      <div key={doc.id} className="p-3 rounded-2xl border bg-secondary/30 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold">{doc.name}</p>
                          <p className="text-[10px] text-muted-foreground">{doc.specialty} • {doc.qualification}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={doc.is_available ? "outline" : "secondary"} className="text-[10px]">
                            {doc.is_available ? "On Duty" : "Off Duty"}
                          </Badge>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{doc.current_opd_count}/{doc.max_daily_opd} OPD</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

            </div>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
