"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import {
  Search,
  Plus,
  Filter,
  User,
  FileText,
  Pill,
  TestTube,
  ClipboardCheck,
  Calendar,
  Heart,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  MoreVertical,
  CreditCard,
  Trash2
} from "lucide-react"

import { usePatients, usePatient, usePrescriptions, useActivity, useReports, useBills, createPatient, createPrescription, createReport, createBill, uploadReport, updatePatientCondition, deletePatient, updateBillStatus } from "@/hooks/use-api"

export default function PatientsPage() {
  const { data: patients, loading: patientsLoading, refetch } = usePatients()
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newPatient, setNewPatient] = useState({
    name: "", age: 30, gender: "Male",
    blood_type: "O+", ward: "General", doctor: "Unassigned",
    last_visit: new Date().toISOString().split('T')[0], allergies: ""
  })

  const handleAddPatient = async () => {
    try {
      const payload = {
        ...newPatient,
        allergies: newPatient.allergies ? newPatient.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
        conditions: []
      }
      await createPatient(payload)
      setIsAddOpen(false)
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const filteredPatients = (patients || []).filter((patient: any) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedPatient = (patients || []).find((p: any) => p.id === selectedPatientId) || filteredPatients[0] || null

  const { data: patientDetails, refetch: refetchPatient } = usePatient(selectedPatient?.id || "PAT-2024-0892")
  const { data: prescriptions, refetch: refetchPresc } = usePrescriptions(selectedPatient?.id || "PAT-2024-0892")
  const { data: activities } = useActivity(selectedPatient?.id || "PAT-2024-0892")
  const { data: reports, refetch: refetchReports } = useReports(selectedPatient?.id || "PAT-2024-0892")
  const { data: bills, refetch: refetchBills } = useBills(selectedPatient?.id || "PAT-2024-0892")

  const [isAddPrescOpen, setIsAddPrescOpen] = useState(false)
  const [newPresc, setNewPresc] = useState({ name: "", dosage: "", frequency: "", duration: "" })

  const handleAddPresc = async () => {
    if (!selectedPatient) return;
    try {
      await createPrescription({ ...newPresc, patient_id: selectedPatient.id })
      setIsAddPrescOpen(false)
      setNewPresc({ name: "", dosage: "", frequency: "", duration: "" })
      refetchPresc()
    } catch (e) {
      console.error(e)
    }
  }

  const [isAddReportOpen, setIsAddReportOpen] = useState(false)
  const [isAddLabOpen, setIsAddLabOpen] = useState(false)
  const [newReportData, setNewReportData] = useState({ report_name: "", date: new Date().toISOString().split('T')[0], status: "completed" })
  const [reportFile, setReportFile] = useState<File | null>(null)

  const handleAddReport = async () => {
    if (!selectedPatient) return;
    try {
      if (reportFile) {
        const formData = new FormData()
        formData.append('patient_id', selectedPatient.id)
        formData.append('report_name', newReportData.report_name)
        formData.append('date', newReportData.date)
        formData.append('status', newReportData.status)
        formData.append('file', reportFile)
        await uploadReport(formData)
      } else {
        await createReport({ ...newReportData, patient_id: selectedPatient.id })
      }
      setIsAddReportOpen(false)
      setIsAddLabOpen(false)
      setNewReportData({ report_name: "", date: new Date().toISOString().split('T')[0], status: "completed" })
      setReportFile(null)
      refetchReports()
    } catch (e) {
      console.error(e)
    }
  }

  const handleUpdateCondition = async (newCondition: string) => {
    if (!selectedPatient) return;
    try {
      await updatePatientCondition(selectedPatient.id, newCondition)
      refetchPatient()
      refetch() // Refresh patients list too to update the sidebar badge
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeletePatient = async () => {
    if (!selectedPatient) return;
    if (!window.confirm("Are you sure you want to remove this patient? This action cannot be undone.")) return;
    try {
      await deletePatient(selectedPatient.id)
      setSelectedPatientId(null)
      refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const [isAddBillOpen, setIsAddBillOpen] = useState(false)
  const [newBill, setNewBill] = useState({ category: "", amount: 0, date: new Date().toISOString().split('T')[0] })

  const handleAddBill = async () => {
    if (!selectedPatient) return;
    try {
      await createBill({ ...newBill, patient_id: selectedPatient.id })
      setIsAddBillOpen(false)
      setNewBill({ category: "", amount: 0, date: new Date().toISOString().split('T')[0] })
      refetchBills()
    } catch (e) {
      console.error(e)
    }
  }

  const handleUpdateBillStatus = async (billId: number, newStatus: string) => {
    try {
      await updateBillStatus(billId, newStatus)
      refetchBills()
    } catch (e) {
      console.error(e)
    }
  }

  const labResults = (reports || []).map((r: any) => ({
    test: r.report_name,
    value: "View File",
    date: r.date || "Recent",
    status: r.status === "completed" ? "normal" : "abnormal"
  }))

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold"
              >
                Patient Management
              </motion.h1>
              <p className="text-muted-foreground mt-1">View and manage patient records</p>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add New Patient
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Patient</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Full Name</label>
                    <Input
                      value={newPatient.name}
                      onChange={e => setNewPatient({ ...newPatient, name: e.target.value })}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Age</label>
                      <Input
                        type="number"
                        value={newPatient.age}
                        onChange={e => setNewPatient({ ...newPatient, age: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Gender</label>
                      <Input
                        value={newPatient.gender}
                        onChange={e => setNewPatient({ ...newPatient, gender: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Blood Type</label>
                      <Input value={newPatient.blood_type} onChange={e => setNewPatient({ ...newPatient, blood_type: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Ward</label>
                      <Input value={newPatient.ward} onChange={e => setNewPatient({ ...newPatient, ward: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Attending Doctor</label>
                      <Input value={newPatient.doctor} onChange={e => setNewPatient({ ...newPatient, doctor: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Last Visit</label>
                      <Input type="date" value={newPatient.last_visit} onChange={e => setNewPatient({ ...newPatient, last_visit: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Allergies (comma separated)</label>
                    <Input value={newPatient.allergies} onChange={e => setNewPatient({ ...newPatient, allergies: e.target.value })} placeholder="e.g. Peanuts, Penicillin" />
                  </div>
                  <Button onClick={handleAddPatient} className="w-full mt-4">Save Patient</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Patient List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card className="p-4 bg-card/80 backdrop-blur-xl">
                {/* Search */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>

                {/* Patient List */}
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredPatients.map((patient) => (
                    <motion.div
                      key={patient.id}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedPatientId(patient.id)}
                      className={`p-3 rounded-xl cursor-pointer transition-colors ${selectedPatient.id === patient.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'bg-secondary/50 hover:bg-secondary'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {patient.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">{patient.id} • {patient.age}y • {patient.gender}</p>
                        </div>
                        <Badge
                          variant={
                            patient.condition === 'Critical' ? 'destructive' :
                              patient.condition === 'Recovering' ? 'secondary' :
                                'outline'
                          }
                          className="text-xs"
                        >
                          {patient.condition}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Patient Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <Card className="p-6 bg-card/80 backdrop-blur-xl mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {patientDetails ? patientDetails.name.split(' ').map((n: string) => n[0]).join('') : "P"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold">{patientDetails?.name || "Loading..."}</h2>
                      <p className="text-muted-foreground">{patientDetails?.id} • {patientDetails?.age} years • {patientDetails?.gender}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge>Blood Type: {patientDetails?.vitals?.blood_type || "O+"}</Badge>
                        <select
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none cursor-pointer ${patientDetails?.condition === 'Critical' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/80' :
                            patientDetails?.condition === 'Recovering' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' :
                              'bg-primary text-primary-foreground hover:bg-primary/80'
                            }`}
                          value={patientDetails?.condition || "Stable"}
                          onChange={(e) => handleUpdateCondition(e.target.value)}
                        >
                          <option value="Stable" className="bg-background text-foreground">Stable</option>
                          <option value="Recovering" className="bg-background text-foreground">Recovering</option>
                          <option value="Critical" className="bg-background text-foreground">Critical</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Phone className="w-4 h-4" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Button>
                    <Button variant="destructive" size="sm" className="gap-2" onClick={handleDeletePatient}>
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </Button>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-sm text-muted-foreground">Ward</p>
                    <p className="font-semibold">{patientDetails?.ward}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-sm text-muted-foreground">Attending Doctor</p>
                    <p className="font-semibold">{patientDetails?.doctor}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <p className="text-sm text-muted-foreground">Last Visit</p>
                    <p className="font-semibold">{patientDetails?.last_visit}</p>
                  </div>
                </div>

                {/* Allergies & Conditions */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-destructive" />
                      Allergies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {patientDetails?.allergies?.length > 0 ? (
                        patientDetails.allergies.map((allergy: string) => (
                          <Badge key={allergy} variant="destructive" className="text-xs">
                            {allergy}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No known allergies</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Medical Conditions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(patientDetails?.conditions || []).map((condition: string) => (
                        <Badge key={condition} variant="secondary" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Tabs */}
              <Card className="p-6 bg-card/80 backdrop-blur-xl">
                <Tabs defaultValue="history" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 mb-6">
                    <TabsTrigger value="history" className="gap-2">
                      <Calendar className="w-4 h-4 hidden sm:block" />
                      History
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="gap-2">
                      <FileText className="w-4 h-4 hidden sm:block" />
                      Reports
                    </TabsTrigger>
                    <TabsTrigger value="prescriptions" className="gap-2">
                      <Pill className="w-4 h-4 hidden sm:block" />
                      Prescriptions
                    </TabsTrigger>
                    <TabsTrigger value="labs" className="gap-2">
                      <TestTube className="w-4 h-4 hidden sm:block" />
                      Labs
                    </TabsTrigger>
                    <TabsTrigger value="bills" className="gap-2">
                      <CreditCard className="w-4 h-4 hidden sm:block" />
                      Bills
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="history" className="space-y-4">
                    {(activities || []).map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <ClipboardCheck className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.type} • {new Date(item.time).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Badge variant="default">
                          Done
                        </Badge>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="reports" className="space-y-4">
                    <div className="flex justify-end mb-4">
                      <Dialog open={isAddReportOpen} onOpenChange={setIsAddReportOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Report</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Report</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div>
                              <label className="text-sm font-medium mb-1 block">Report Name</label>
                              <Input value={newReportData.report_name} onChange={e => setNewReportData({ ...newReportData, report_name: e.target.value })} placeholder="e.g. Blood Test" />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Status</label>
                              <Input value={newReportData.status} onChange={e => setNewReportData({ ...newReportData, status: e.target.value })} placeholder="completed or pending" />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Attach PDF (Optional)</label>
                              <Input type="file" accept=".pdf" onChange={e => setReportFile(e.target.files?.[0] || null)} />
                            </div>
                            <Button onClick={handleAddReport} className="w-full mt-4">Save Report</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    {(reports || []).map((report: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-accent" />
                          </div>
                          <span className="font-medium">{report.report_name}</span>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                          View
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="prescriptions" className="space-y-4">
                    <div className="flex justify-end mb-4">
                      <Dialog open={isAddPrescOpen} onOpenChange={setIsAddPrescOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Prescription</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Prescription</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div>
                              <label className="text-sm font-medium mb-1 block">Medicine Name</label>
                              <Input value={newPresc.name} onChange={e => setNewPresc({ ...newPresc, name: e.target.value })} placeholder="e.g. Paracetamol" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium mb-1 block">Dosage</label>
                                <Input value={newPresc.dosage} onChange={e => setNewPresc({ ...newPresc, dosage: e.target.value })} placeholder="e.g. 500mg" />
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-1 block">Frequency</label>
                                <Input value={newPresc.frequency} onChange={e => setNewPresc({ ...newPresc, frequency: e.target.value })} placeholder="e.g. Twice a day" />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Duration</label>
                              <Input value={newPresc.duration} onChange={e => setNewPresc({ ...newPresc, duration: e.target.value })} placeholder="e.g. 5 days" />
                            </div>
                            <Button onClick={handleAddPresc} className="w-full mt-4">Save Prescription</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    {(prescriptions || []).map((rx: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
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
                    ))}
                  </TabsContent>

                  <TabsContent value="labs" className="space-y-4">
                    <div className="flex justify-end mb-4">
                      <Dialog open={isAddLabOpen} onOpenChange={setIsAddLabOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Lab Result</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Lab Result</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div>
                              <label className="text-sm font-medium mb-1 block">Test Name</label>
                              <Input value={newReportData.report_name} onChange={e => setNewReportData({ ...newReportData, report_name: e.target.value })} placeholder="e.g. Blood Test" />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Status</label>
                              <Input value={newReportData.status} onChange={e => setNewReportData({ ...newReportData, status: e.target.value })} placeholder="normal or pending" />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Attach PDF (Optional)</label>
                              <Input type="file" accept=".pdf" onChange={e => setReportFile(e.target.files?.[0] || null)} />
                            </div>
                            <Button onClick={handleAddReport} className="w-full mt-4">Save Lab Result</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    {labResults.map((lab: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${lab.status === 'normal' ? 'bg-green-500/10' : 'bg-amber-500/10'
                            }`}>
                            <TestTube className={`w-5 h-5 ${lab.status === 'normal' ? 'text-green-500' : 'text-amber-500'
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
                    ))}
                  </TabsContent>

                  <TabsContent value="bills" className="space-y-4">
                    <div className="flex justify-end mb-4">
                      <Dialog open={isAddBillOpen} onOpenChange={setIsAddBillOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Bill</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Bill</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div>
                              <label className="text-sm font-medium mb-1 block">Category</label>
                              <Input value={newBill.category} onChange={e => setNewBill({ ...newBill, category: e.target.value })} placeholder="e.g. Consultation, Pharmacy" />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Amount</label>
                              <Input type="number" value={newBill.amount} onChange={e => setNewBill({ ...newBill, amount: parseFloat(e.target.value) || 0 })} placeholder="0.00" />
                            </div>
                            <Button onClick={handleAddBill} className="w-full mt-4">Save Bill</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    {(bills || []).map((bill: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="font-medium">{bill.category}</p>
                            <p className="text-sm text-muted-foreground">{bill.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${typeof bill.amount === 'number' ? bill.amount.toFixed(2) : bill.amount}</p>
                          <select
                            className={`mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none cursor-pointer ${bill.status === 'Paid' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-destructive text-destructive-foreground hover:bg-destructive/80'
                              }`}
                            value={bill.status}
                            onChange={(e) => handleUpdateBillStatus(bill.id, e.target.value)}
                          >
                            <option value="Paid" className="bg-background text-foreground">Paid</option>
                            <option value="Pending" className="bg-background text-foreground">Pending</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
