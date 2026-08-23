"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Pill, Search, Filter, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react"

import { usePharmacyInventory, useFacilities } from "@/hooks/use-api"

export default function PharmacyPage() {
  const [selectedFacilityId, setSelectedFacilityId] = useState<number>(3)
  const [search, setSearch] = useState<string>("")
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL")

  const { data: inventory, loading, refetch } = usePharmacyInventory(selectedFacilityId)
  const { data: facilities } = useFacilities()

  const filteredInventory = inventory?.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.generic_name.toLowerCase().includes(search.toLowerCase()) ||
                          item.code.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  }) || []

  const categories = Array.from(new Set(inventory?.map((i) => i.category) || []))

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <Badge variant="outline" className="mb-1 text-xs font-bold text-emerald-600 border-emerald-500/20 bg-emerald-500/10">
                Facility Stock Telemetry
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight">Essential Medicine Availability</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Real-time pharmacy inventory, stock thresholds & availability search</p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2 rounded-xl">
                <RefreshCw className="w-4 h-4" />
                Refresh Stock
              </Button>
            </div>
          </div>

          {/* Facility & Category Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-card text-xs">
              <span className="font-semibold text-muted-foreground">Select Facility:</span>
              <select 
                value={selectedFacilityId}
                onChange={(e) => setSelectedFacilityId(Number(e.target.value))}
                className="bg-transparent font-bold outline-none cursor-pointer"
              >
                {facilities?.map((f) => (
                  <option key={f.id} value={f.id}>{f.name} ({f.level})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                <input 
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search medicine or generic..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border bg-card text-xs outline-none"
                />
              </div>

              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-card border text-xs font-bold p-2 rounded-xl outline-none"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Inventory Table */}
          <Card className="p-6 rounded-3xl border bg-card shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary" />
                Pharmacy Inventory Directory ({filteredInventory.length})
              </h2>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Loading facility medicine inventory...</div>
            ) : filteredInventory.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">No medicines found matching search criteria</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b text-muted-foreground uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Code</th>
                      <th className="pb-3 font-semibold">Medicine Name</th>
                      <th className="pb-3 font-semibold">Generic Name</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Stock Quantity</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredInventory.map((item) => (
                      <tr key={item.code} className="hover:bg-secondary/40 transition">
                        <td className="py-3 font-bold text-primary">{item.code}</td>
                        <td className="py-3 font-medium text-foreground">{item.name}</td>
                        <td className="py-3 text-muted-foreground">{item.generic_name}</td>
                        <td className="py-3">{item.category}</td>
                        <td className="py-3 font-bold">{item.stock_quantity} {item.unit}</td>
                        <td className="py-3">
                          <Badge variant={item.status === "OUT_OF_STOCK" ? "destructive" : item.status === "LOW_STOCK" ? "default" : "outline"}>
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

        </div>
      </section>

      <Footer />
    </main>
  )
}
