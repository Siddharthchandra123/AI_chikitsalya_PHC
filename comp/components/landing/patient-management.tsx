"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  FileText, 
  Upload, 
  Pill, 
  TestTube,
  ClipboardCheck,
  Calendar,
  Heart
} from "lucide-react"

const patientData = {
  name: "Sarah Johnson",
  age: 45,
  gender: "Female",
  bloodType: "O+",
  allergies: ["Penicillin", "Sulfa"],
  conditions: ["Hypertension", "Type 2 Diabetes"]
}

const medicalHistory = [
  { date: "2024-01-15", event: "Annual Checkup", doctor: "Dr. Patel", status: "completed" },
  { date: "2024-02-20", event: "Blood Work", doctor: "Dr. Kumar", status: "completed" },
  { date: "2024-03-10", event: "Cardiology Consult", doctor: "Dr. Sharma", status: "upcoming" },
]

const prescriptions = [
  { name: "Metformin", dosage: "500mg", frequency: "Twice daily", duration: "Ongoing" },
  { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "Ongoing" },
  { name: "Aspirin", dosage: "81mg", frequency: "Once daily", duration: "Ongoing" },
]

const labResults = [
  { test: "HbA1c", value: "6.8%", status: "normal", date: "Feb 20, 2024" },
  { test: "Blood Pressure", value: "128/82", status: "normal", date: "Feb 20, 2024" },
  { test: "Cholesterol", value: "210 mg/dL", status: "high", date: "Feb 20, 2024" },
]

export function PatientManagement() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Patient Portal
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-balance">
            Comprehensive Patient Management
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Access complete patient information, history, and treatment plans in one unified view.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Card className="p-6 sm:p-8 rounded-3xl border-border/50 bg-card/80 backdrop-blur-xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Patient Profile Card */}
              <div className="lg:col-span-1">
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-0">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="w-24 h-24 mb-4">
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {patientData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold">{patientData.name}</h3>
                    <p className="text-muted-foreground">{patientData.age} years, {patientData.gender}</p>
                    <Badge className="mt-2">Blood Type: {patientData.bloodType}</Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-destructive" />
                        Allergies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {patientData.allergies.map((allergy) => (
                          <Badge key={allergy} variant="destructive" className="text-xs">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Conditions
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {patientData.conditions.map((condition) => (
                          <Badge key={condition} variant="secondary" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Patient Details Tabs */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="history" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="history" className="gap-2">
                      <Calendar className="w-4 h-4 hidden sm:block" />
                      History
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="gap-2">
                      <Upload className="w-4 h-4 hidden sm:block" />
                      Reports
                    </TabsTrigger>
                    <TabsTrigger value="prescriptions" className="gap-2">
                      <Pill className="w-4 h-4 hidden sm:block" />
                      Rx
                    </TabsTrigger>
                    <TabsTrigger value="labs" className="gap-2">
                      <TestTube className="w-4 h-4 hidden sm:block" />
                      Labs
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="history" className="space-y-4">
                    {medicalHistory.map((item, index) => (
                      <Card key={index} className="p-4 bg-background/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <ClipboardCheck className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{item.event}</p>
                              <p className="text-sm text-muted-foreground">{item.doctor} • {item.date}</p>
                            </div>
                          </div>
                          <Badge variant={item.status === 'completed' ? 'default' : 'outline'}>
                            {item.status}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="reports" className="space-y-4">
                    {["MRI Scan - Jan 2024", "X-Ray - Dec 2023", "ECG Report - Nov 2023"].map((report, index) => (
                      <Card key={index} className="p-4 bg-background/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-accent" />
                            </div>
                            <span className="font-medium">{report}</span>
                          </div>
                          <Badge variant="outline">View</Badge>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="prescriptions" className="space-y-4">
                    {prescriptions.map((rx, index) => (
                      <Card key={index} className="p-4 bg-background/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                              <Pill className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                              <p className="font-medium">{rx.name} - {rx.dosage}</p>
                              <p className="text-sm text-muted-foreground">{rx.frequency} • {rx.duration}</p>
                            </div>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="labs" className="space-y-4">
                    {labResults.map((lab, index) => (
                      <Card key={index} className="p-4 bg-background/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              lab.status === 'normal' ? 'bg-green-500/10' : 'bg-amber-500/10'
                            }`}>
                              <TestTube className={`w-5 h-5 ${
                                lab.status === 'normal' ? 'text-green-500' : 'text-amber-500'
                              }`} />
                            </div>
                            <div>
                              <p className="font-medium">{lab.test}: {lab.value}</p>
                              <p className="text-sm text-muted-foreground">{lab.date}</p>
                            </div>
                          </div>
                          <Badge variant={lab.status === 'normal' ? 'default' : 'destructive'}>
                            {lab.status}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
