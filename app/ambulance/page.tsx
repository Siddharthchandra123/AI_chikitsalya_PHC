"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Truck,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Navigation as NavIcon,
} from "lucide-react";

const ambulances = [
  {
    id: "AMB-001",
    type: "Advanced Life Support",
    distance: "1.2 km",
    eta: "4 min",
    driver: "John Smith",
    phone: "+91 98765-43210",
    status: "available",
  },
  {
    id: "AMB-002",
    type: "Basic Life Support",
    distance: "2.5 km",
    eta: "8 min",
    driver: "Sarah Wilson",
    phone: "+91 98765-43211",
    status: "available",
  },
  {
    id: "AMB-003",
    type: "Patient Transport",
    distance: "3.1 km",
    eta: "12 min",
    driver: "Mike Johnson",
    phone: "+91 98765-43212",
    status: "en-route",
  },
];

export default function AmbulancePage() {
  const [bookingStatus, setBookingStatus] = useState<
    "idle" | "searching" | "assigned" | "arriving"
  >("idle");
  const [assignedAmbulance, setAssignedAmbulance] = useState<
    (typeof ambulances)[0] | null
  >(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (bookingStatus === "searching") {
      const timer = setTimeout(() => {
        setAssignedAmbulance(ambulances[0]);
        setBookingStatus("assigned");
        setCountdown(4 * 60);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [bookingStatus]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0 && bookingStatus === "assigned") {
      setBookingStatus("arriving");
    }
  }, [countdown, bookingStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEmergencyCall = () => {
    setBookingStatus("searching");
  };

  const resetBooking = () => {
    setBookingStatus("idle");
    setAssignedAmbulance(null);
    setCountdown(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-24">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <Truck className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
            Ambulance Emergency Dispatch
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground text-sm">
            Request emergency medical transport or track your assigned ambulance in real-time.
          </p>
        </div>

        {bookingStatus === "idle" && (
          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="p-8 rounded-3xl border shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-foreground">
                Emergency Transfer Request
              </h2>
              <div className="mb-6 space-y-4 text-xs">
                <div>
                  <label className="mb-2 block font-medium text-foreground">
                    Pickup Village / Location
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter village address"
                      className="flex-1 rounded-xl border bg-background px-4 py-2 text-xs placeholder:text-muted-foreground outline-none"
                      defaultValue="Gram Khedi, Bilaspur Block"
                    />
                    <Button variant="outline" size="icon" className="rounded-xl">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block font-medium text-foreground">
                    Emergency Type
                  </label>
                  <select className="w-full rounded-xl border bg-background px-4 py-2 text-xs outline-none">
                    <option>Cardiac Event / Chest Pain</option>
                    <option>Severe Trauma / Accident</option>
                    <option>Pregnancy / Labor Emergency</option>
                    <option>High Fever with Respiratory Distress</option>
                    <option>Other Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block font-medium text-foreground">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98XXX-XXXXX"
                    className="w-full rounded-xl border bg-background px-4 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              <Button
                onClick={handleEmergencyCall}
                className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                size="lg"
              >
                <Phone className="mr-2 h-5 w-5" />
                Dispatch Emergency Ambulance
              </Button>

              <div className="mt-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                  <p className="text-xs text-amber-900 dark:text-amber-200">
                    For life-threatening emergencies, call national emergency hotline 108 or 112 directly.
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Nearby Available Ambulances
              </h2>
              {ambulances.map((amb) => (
                <Card key={amb.id} className="p-4 rounded-2xl border shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Truck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm">{amb.id}</p>
                        <p className="text-xs text-muted-foreground">{amb.type}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {amb.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {amb.eta}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full px-2.5 py-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {amb.status}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {bookingStatus === "searching" && (
          <Card className="mx-auto max-w-md p-8 text-center rounded-3xl border shadow-sm">
            <div className="mb-6">
              <div className="relative mx-auto h-20 w-20">
                <div className="absolute inset-0 animate-ping rounded-full bg-destructive/30" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                  <Truck className="h-10 w-10 text-destructive" />
                </div>
              </div>
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground">
              Locating Nearest Available Unit
            </h2>
            <p className="text-xs text-muted-foreground">
              Connecting with PHC & District dispatch center...
            </p>
          </Card>
        )}

        {(bookingStatus === "assigned" || bookingStatus === "arriving") &&
          assignedAmbulance && (
            <Card className="max-w-xl mx-auto p-6 rounded-3xl border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Ambulance Assigned</p>
                  <h2 className="text-xl font-bold text-primary">{assignedAmbulance.id}</h2>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Estimated Arrival</p>
                  <p className="text-2xl font-extrabold text-foreground">{formatTime(countdown)}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p><span className="font-semibold">Type:</span> {assignedAmbulance.type}</p>
                <p><span className="font-semibold">Driver:</span> {assignedAmbulance.driver}</p>
                <p><span className="font-semibold">Phone:</span> {assignedAmbulance.phone}</p>
              </div>

              <Button onClick={resetBooking} variant="outline" className="w-full rounded-xl">
                Cancel Request
              </Button>
            </Card>
          )}
      </main>
      <Footer />
    </div>
  );
}
