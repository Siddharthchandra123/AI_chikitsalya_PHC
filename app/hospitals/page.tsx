"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Building2, Bed, Phone, Clock, Search, Filter, ShieldCheck, CheckCircle2 } from "lucide-react"

import { useFacilities } from "@/hooks/use-api"

export default function HospitalsPage() {
  const [search, setSearch] = useState("")
  const [levelFilter, setLevelFilter] = useState("ALL")

  const { data: facilities, loading } = useFacilities(
    levelFilter === "ALL" ? undefined : levelFilter
  )

  const filteredFacilities = facilities?.filter((f) => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.district.toLowerCase().includes(search.toLowerCase()) ||
    f.block.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <Badge variant="outline" className="mb-1 text-xs font-bold text-blue-600 border-blue-500/20 bg-blue-500/10">
                Tiered Rural Healthcare Network Hierarchy
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight">Facility Network & Capabilities</h1>
              <p className="text-sm text-muted-foreground mt-0.5">District Hospitals, Rural Hospitals, Primary Health Centres & Sub-centres</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search facility name..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border bg-card text-xs outline-none"
                />
              </div>

              <select 
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="bg-card border text-xs font-bold p-2 rounded-xl outline-none"
              >
                <option value="ALL">All Hierarchy Levels</option>
                <option value="District Hospital">District Hospital</option>
                <option value="Rural Hospital">Rural Hospital</option>
                <option value="PHC">PHC</option>
                <option value="Sub-centre">Sub-centre</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">Loading facility directory...</div>
          ) : filteredFacilities.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">No facilities found matching filter</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredFacilities.map((f) => (
                <Card key={f.id} className="p-6 rounded-3xl border bg-card shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base">{f.name}</h3>
                        <p className="text-xs text-muted-foreground">{f.block} Block • {f.district} District</p>
                      </div>
                    </div>
                    <Badge variant={f.level === "District Hospital" ? "default" : f.level === "Rural Hospital" ? "secondary" : "outline"}>
                      {f.level}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-2xl bg-secondary/30">
                    <div>
                      <span className="text-muted-foreground font-semibold block">Total Beds</span>
                      <span className="font-bold text-foreground">{f.total_beds} ({f.available_beds} Available)</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-semibold block">ICU Beds</span>
                      <span className="font-bold text-foreground">{f.icu_beds} ({f.available_icu_beds} Available)</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-semibold block">Contact Phone</span>
                      <span className="font-medium text-foreground">{f.phone || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-semibold block">Operating Hours</span>
                      <span className="font-medium text-foreground">{f.operating_hours}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-muted-foreground block mb-2">Structured Capabilities:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {f.capabilities.map((cap) => (
                        <Badge key={cap} variant="outline" className="text-[10px] bg-background">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                          {cap}
                        </Badge>
                      ))}
                    </div>
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
