"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { 
  Users, 
  Calendar, 
  Bed, 
  TrendingUp, 
  FileText, 
  AlertTriangle,
  Brain,
  Activity,
  DollarSign,
  Clock,
  Bell,
  Plus,
  Download,
  RefreshCw,
  ChevronRight
} from "lucide-react"

import { usePatients, useAppointments, useActivity, useAnalytics } from "@/hooks/use-api"

export default function DashboardPage() {
  const { data: patients, loading: patientsLoading } = usePatients()
  const { data: allAppointments } = useAppointments("all") // Assuming API can handle "all" or we just use patients
  const { data: analytics } = useAnalytics()
  
  const recentPatientsData = patients ? patients.slice(0, 4) : []
  
  const stats = [
    { icon: Users, label: "Total Patients", value: analytics ? analytics.total_patients.toString() : "0", change: "+12%", color: "text-blue-500" },
    { icon: Calendar, label: "Appointments", value: analytics ? analytics.total_appointments.toString() : "0", change: "+8%", color: "text-green-500" },
    { icon: Bed, label: "Occupancy Rate", value: analytics ? `${analytics.occupancy_rate}%` : "0%", change: "-5%", color: "text-amber-500" },
    { icon: DollarSign, label: "Revenue", value: analytics ? `$${(analytics.total_revenue / 1000).toFixed(1)}K` : "$0K", change: "+15%", color: "text-primary" },
  ]
  
  const weekly_revenue = analytics?.weekly_revenue || [
    {"day": "Mon", "value": 30, "label": "$0K"},
    {"day": "Tue", "value": 40, "label": "$0K"},
    {"day": "Wed", "value": 50, "label": "$0K"},
    {"day": "Thu", "value": 70, "label": "$0K"},
    {"day": "Fri", "value": 80, "label": "$0K"},
    {"day": "Sat", "value": 40, "label": "$0K"},
    {"day": "Sun", "value": 90, "label": "$0K"}
  ]
  
  const ai_alerts = analytics?.ai_alerts || []
  
  const hospital_overview = analytics?.hospital_overview || []
  
  const iconMap: any = {
    FileText,
    Clock,
    Bed,
    Users,
    Calendar,
    DollarSign
  }

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
                Hospital Dashboard
              </motion.h1>
              <p className="text-muted-foreground mt-1">Welcome back, Dr. Administrator</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                New Patient
              </Button>
            </div>
          </div>

          {/* Live Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <Badge variant="outline" className="gap-2 py-1.5 px-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live Dashboard
            </Badge>
            <span className="text-sm text-muted-foreground">Last updated: Just now</span>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-card/80 backdrop-blur-xl hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Appointments */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-card/80 backdrop-blur-xl h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Today&apos;s Appointments
                  </h3>
                  <Badge>{allAppointments ? allAppointments.length : 0}</Badge>
                </div>
                <div className="space-y-4">
                  {(allAppointments || []).slice(0, 5).map((apt: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                          {apt.patient_name ? apt.patient_name.split(' ').map((n: string) => n[0]).join('') : "P"}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{apt.patient_name}</p>
                          <p className="text-xs text-muted-foreground">{apt.doctor}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{apt.time}</p>
                        <Badge 
                          variant={apt.type === 'Emergency' ? 'destructive' : 'outline'} 
                          className="text-xs"
                        >
                          {apt.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4 gap-2">
                  View All Appointments
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Card>
            </motion.div>

            {/* Revenue & Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 bg-card/80 backdrop-blur-xl h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Weekly Revenue
                  </h3>
                  <Badge className="bg-green-500/10 text-green-500">+15%</Badge>
                </div>
                <div className="space-y-4">
                  {weekly_revenue.map((item: any) => (
                    <div key={item.day} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-8">{item.day}</span>
                      <Progress value={item.value} className="flex-1 h-2" />
                      <span className="text-xs font-medium w-12 text-right">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total This Week</span>
                    <span className="text-xl font-bold">${analytics ? (analytics.total_revenue / 1000).toFixed(1) : 0}K</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* AI Insights & Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 bg-card/80 backdrop-blur-xl h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    AI Alerts & Insights
                  </h3>
                  <Bell className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  {ai_alerts.map((alert: any, index: number) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-xl flex items-start gap-3 ${
                        alert.severity === 'high' ? 'bg-destructive/10' :
                        alert.severity === 'medium' ? 'bg-amber-500/10' :
                        'bg-primary/10'
                      }`}
                    >
                      <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        alert.severity === 'high' ? 'text-destructive' :
                        alert.severity === 'medium' ? 'text-amber-500' :
                        'text-primary'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Patients */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 bg-card/80 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Recent Patients
                  </h3>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                <div className="space-y-3">
                  {recentPatientsData.map((patient: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-medium text-primary-foreground">
                          {patient.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">{patient.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={patient.condition === 'Critical' ? 'destructive' : 'outline'}
                          className="mb-1"
                        >
                          {patient.condition}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{patient.ward}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-6 bg-card/80 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Hospital Overview
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {hospital_overview.map((item: any, index: number) => {
                    const IconComponent = iconMap[item.icon] || FileText
                    return (
                    <div key={item.label} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                        <IconComponent className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-lg font-bold">{item.value}</p>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                      </div>
                    </div>
                  )})}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
