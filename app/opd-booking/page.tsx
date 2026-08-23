"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Calendar, CheckCircle2, Stethoscope, Clock, Users } from "lucide-react"

import { useDoctors, usePatients, useFacilities } from "@/hooks/use-api"

export default function OPDBookingPage() {
  const { data: doctors } = useDoctors()
  const { data: patients } = usePatients()
  const { data: facilities } = useFacilities()

  const [booking, setBooking] = useState({
    patient_id: "PAT-1001",
    facility_id: 3,
    doctor_id: 1,
    department: "General Medicine",
    priority: "NORMAL"
  })

  const [confirmedToken, setConfirmedToken] = useState<number | null>(null)

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault()
    // Generate token number
    const token = Math.floor(Math.random() * 20) + 15
    setConfirmedToken(token)
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <Badge variant="outline" className="mb-1 text-xs font-bold text-blue-600 border-blue-500/20 bg-blue-500/10">
              Outpatient Department Registration
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">Book OPD Appointment</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Select facility, department & doctor to generate an outpatient token</p>
          </div>

          {confirmedToken ? (
            <Card className="p-8 rounded-3xl border bg-card text-center space-y-4 shadow-md">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">OPD Token Generated!</h2>
              <div className="p-6 rounded-2xl bg-secondary/30 inline-block text-left space-y-2 max-w-md w-full">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-xs font-semibold text-muted-foreground">Token Number:</span>
                  <span className="text-lg font-extrabold text-primary">#{confirmedToken}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-semibold">Patient:</span>
                  <span className="font-bold">{booking.patient_id}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-semibold">Department:</span>
                  <span className="font-bold">{booking.department}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-semibold">Estimated Wait:</span>
                  <span className="font-bold text-amber-600">~15 Mins</span>
                </div>
              </div>
              <div>
                <Button onClick={() => setConfirmedToken(null)} className="rounded-xl mt-4">
                  Book Another Appointment
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-6 rounded-3xl border bg-card shadow-sm">
              <form onSubmit={handleBook} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Select Patient</label>
                  <select 
                    value={booking.patient_id}
                    onChange={(e) => setBooking({...booking, patient_id: e.target.value})}
                    className="w-full p-3 rounded-xl border bg-background text-xs outline-none"
                  >
                    {patients?.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id} • {p.village})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Facility</label>
                  <select 
                    value={booking.facility_id}
                    onChange={(e) => setBooking({...booking, facility_id: Number(e.target.value)})}
                    className="w-full p-3 rounded-xl border bg-background text-xs outline-none"
                  >
                    {facilities?.map((f) => (
                      <option key={f.id} value={f.id}>{f.name} ({f.level})</option>
                    ))}
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-muted-foreground block mb-1">Department</label>
                    <select 
                      value={booking.department}
                      onChange={(e) => setBooking({...booking, department: e.target.value})}
                      className="w-full p-3 rounded-xl border bg-background text-xs outline-none"
                    >
                      <option value="General Medicine">General Medicine</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="General Surgery">General Surgery</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-muted-foreground block mb-1">Doctor On Duty</label>
                    <select 
                      value={booking.doctor_id}
                      onChange={(e) => setBooking({...booking, doctor_id: Number(e.target.value)})}
                      className="w-full p-3 rounded-xl border bg-background text-xs outline-none"
                    >
                      {doctors?.map((d) => (
                        <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full rounded-xl py-5 text-sm font-bold">
                    Confirm Booking & Issue Token
                  </Button>
                </div>
              </form>
            </Card>
          )}

        </div>
      </section>

      <Footer />
    </main>
  )
}
