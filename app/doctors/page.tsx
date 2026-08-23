"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Stethoscope, Search, UserCheck, Video, Calendar } from "lucide-react"

import { useDoctors } from "@/hooks/use-api"

export default function DoctorsPage() {
  const [search, setSearch] = useState("")
  const { data: doctors, loading } = useDoctors()

  const filteredDoctors = doctors?.filter((d) => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.specialty.toLowerCase().includes(search.toLowerCase()) ||
    d.facility_name.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <Badge variant="outline" className="mb-1 text-xs font-bold text-blue-600 border-blue-500/20 bg-blue-500/10">
                Medical Officer & Specialist Directory
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight">Doctor Roster & OPD Duty</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Qualified healthcare professionals across Sub-centres, PHCs and District Hospitals</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by doctor or specialty..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border bg-card text-xs outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading doctor roster...</div>
          ) : filteredDoctors.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">No doctors found matching search</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doc) => (
                <Card key={doc.id} className="p-6 rounded-3xl border bg-card shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">{doc.name}</h3>
                      <p className="text-xs text-primary font-semibold">{doc.specialty}</p>
                      <p className="text-[10px] text-muted-foreground">{doc.qualification}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-secondary/30 text-xs space-y-1.5">
                    <p><span className="font-semibold">Facility:</span> {doc.facility_name}</p>
                    <p><span className="font-semibold">OPD Load:</span> {doc.current_opd_count} / {doc.max_daily_opd} Patients Today</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Badge variant={doc.is_available ? "outline" : "secondary"} className="text-[10px]">
                        {doc.is_available ? "On Duty" : "Off Duty"}
                      </Badge>
                      {doc.teleconsult_available && (
                        <Badge variant="secondary" className="text-[10px] gap-1 text-blue-600">
                          <Video className="w-3 h-3" /> Teleconsult
                        </Badge>
                      )}
                    </div>

                    <Button size="sm" onClick={() => (window.location.href = "/opd-booking")} className="rounded-xl text-xs gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Book OPD
                    </Button>
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
