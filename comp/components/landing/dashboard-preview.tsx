"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Clock
} from "lucide-react"

const stats = [
  { icon: Users, label: "Total Patients", value: "1,234", change: "+12%", color: "text-blue-500" },
  { icon: Calendar, label: "Appointments", value: "56", change: "+8%", color: "text-green-500" },
  { icon: Bed, label: "ICU Occupancy", value: "78%", change: "-5%", color: "text-amber-500" },
  { icon: DollarSign, label: "Revenue", value: "$45.2K", change: "+15%", color: "text-primary" },
]

const appointments = [
  { name: "Dr. Sharma", patient: "John Doe", time: "09:00 AM", type: "Consultation" },
  { name: "Dr. Patel", patient: "Jane Smith", time: "10:30 AM", type: "Follow-up" },
  { name: "Dr. Kumar", patient: "Mike Johnson", time: "11:00 AM", type: "Emergency" },
]

const alerts = [
  { message: "ICU Bed 5 requires attention", severity: "high" },
  { message: "Lab results ready for Patient #2341", severity: "medium" },
  { message: "Medication refill needed - Ward B", severity: "low" },
]

export function DashboardPreview() {
  return (
    <section id="dashboard" className="py-24 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Live Dashboard
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-balance">
            Real-Time Hospital Insights
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Monitor every aspect of your hospital operations from a single, intuitive dashboard.
          </p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl" />
          
          <Card className="relative p-6 sm:p-8 rounded-3xl border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Hospital Overview</h3>
                  <p className="text-sm text-muted-foreground">Last updated: 2 minutes ago</p>
                </div>
              </div>
              <Badge variant="outline" className="gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 bg-background/50">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Appointments */}
              <Card className="p-4 bg-background/50 lg:col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Today&apos;s Appointments
                  </h4>
                  <Badge>{appointments.length}</Badge>
                </div>
                <div className="space-y-3">
                  {appointments.map((apt, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div>
                        <p className="font-medium text-sm">{apt.patient}</p>
                        <p className="text-xs text-muted-foreground">{apt.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{apt.time}</p>
                        <Badge variant="outline" className="text-xs">{apt.type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Revenue Chart Placeholder */}
              <Card className="p-4 bg-background/50 lg:col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Revenue Trends
                  </h4>
                </div>
                <div className="space-y-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
                    <div key={day} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-8">{day}</span>
                      <Progress value={40 + index * 12} className="flex-1 h-2" />
                      <span className="text-xs font-medium">${8 + index * 2}K</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* AI Insights & Alerts */}
              <Card className="p-4 bg-background/50 lg:col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    AI Insights
                  </h4>
                </div>
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg flex items-start gap-3 ${
                        alert.severity === 'high' ? 'bg-destructive/10' :
                        alert.severity === 'medium' ? 'bg-amber-500/10' :
                        'bg-primary/10'
                      }`}
                    >
                      <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                        alert.severity === 'high' ? 'text-destructive' :
                        alert.severity === 'medium' ? 'text-amber-500' :
                        'text-primary'
                      }`} />
                      <p className="text-sm">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Bottom Stats */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: FileText, label: "Pending Reports", value: "23" },
                { icon: Clock, label: "Avg Wait Time", value: "12 min" },
                { icon: Bed, label: "Available Beds", value: "45" },
                { icon: Users, label: "Staff On Duty", value: "128" },
              ].map((item, index) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <item.icon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
