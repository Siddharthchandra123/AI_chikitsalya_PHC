"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  Activity,
  BarChart3,
  PieChart,
  Gauge,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

const performanceMetrics = [
  { label: "Patient Satisfaction", value: 94, change: "+5%", positive: true },
  { label: "Recovery Rate", value: 87, change: "+3%", positive: true },
  { label: "Bed Utilization", value: 78, change: "-2%", positive: false },
  { label: "Staff Efficiency", value: 91, change: "+7%", positive: true },
]

const diseaseAnalytics = [
  { disease: "Respiratory", cases: 234, percentage: 28 },
  { disease: "Cardiovascular", cases: 189, percentage: 23 },
  { disease: "Diabetes", cases: 156, percentage: 19 },
  { disease: "Orthopedic", cases: 134, percentage: 16 },
  { disease: "Neurological", cases: 112, percentage: 14 },
]

const recoveryTrends = [
  { month: "Jan", rate: 82 },
  { month: "Feb", rate: 85 },
  { month: "Mar", rate: 84 },
  { month: "Apr", rate: 88 },
  { month: "May", rate: 91 },
  { month: "Jun", rate: 89 },
]

export function ReportsAnalytics() {
  return (
    <section id="reports" className="py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
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
            <BarChart3 className="w-4 h-4" />
            Analytics & Reports
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-balance">
            Data-Driven Healthcare Insights
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Monitor hospital performance, track recovery trends, and make informed decisions with real-time analytics.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 rounded-2xl border-border/50 bg-card/80 backdrop-blur-xl h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-primary" />
                  Hospital Performance
                </h3>
                <Badge variant="outline">Live Metrics</Badge>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {performanceMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{metric.label}</span>
                      <span className={`text-sm font-medium flex items-center gap-1 ${
                        metric.positive ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {metric.positive ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        {metric.change}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={metric.value} className="flex-1 h-3" />
                      <span className="text-lg font-bold">{metric.value}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Disease Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 rounded-2xl border-border/50 bg-card/80 backdrop-blur-xl h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Disease Distribution
                </h3>
              </div>

              <div className="space-y-4">
                {diseaseAnalytics.map((item, index) => (
                  <motion.div
                    key={item.disease}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span>{item.disease}</span>
                      <span className="font-medium">{item.cases} cases</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recovery Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 rounded-2xl border-border/50 bg-card/80 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Recovery Rate Trends
                </h3>
                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                  +9% vs Last Quarter
                </Badge>
              </div>

              {/* Simple Bar Chart */}
              <div className="flex items-end justify-between gap-2 h-48 px-2">
                {recoveryTrends.map((item, index) => (
                  <motion.div
                    key={item.month}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${item.rate}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div 
                      className="w-full bg-gradient-to-t from-primary to-accent rounded-t-lg relative group cursor-pointer"
                      style={{ height: '100%' }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Badge variant="secondary" className="text-xs">{item.rate}%</Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.month}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Real-time Monitoring */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6 rounded-2xl border-border/50 bg-gradient-to-br from-primary/10 to-accent/10 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Real-time Monitoring
                </h3>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>

              <div className="space-y-4">
                {[
                  { label: "ER Queue", value: "12 patients", status: "normal" },
                  { label: "ICU Status", value: "3 beds available", status: "warning" },
                  { label: "OT Schedule", value: "2 surgeries active", status: "normal" },
                  { label: "Pharmacy", value: "All stocked", status: "normal" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <span className="text-sm">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.value}</span>
                      <span className={`w-2 h-2 rounded-full ${
                        item.status === 'normal' ? 'bg-green-500' : 'bg-amber-500'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
