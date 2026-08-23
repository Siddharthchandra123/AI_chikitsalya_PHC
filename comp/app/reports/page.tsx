"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { 
  TrendingUp, 
  Activity,
  BarChart3,
  PieChart,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  FileText,
  Users,
  DollarSign,
  Bed
} from "lucide-react"

import { useAnalytics } from "@/hooks/use-api"

export default function ReportsPage() {
  const { data: analytics, loading } = useAnalytics()

  const performanceMetrics = analytics?.performance_metrics || [
    { label: "Patient Satisfaction", value: 94, change: "+5%", positive: true },
    { label: "Recovery Rate", value: 87, change: "+3%", positive: true },
    { label: "Bed Utilization", value: analytics?.occupancy_rate || 78, change: "-2%", positive: false },
    { label: "Staff Efficiency", value: 91, change: "+7%", positive: true },
  ]
  
  const diseaseAnalytics = analytics?.disease_distribution || []
  
  const recoveryTrends = analytics?.recovery_trends || [
    { month: "Jan", rate: 82 },
    { month: "Feb", rate: 85 },
    { month: "Mar", rate: 84 },
    { month: "Apr", rate: 88 },
    { month: "May", rate: 91 },
    { month: "Jun", rate: 89 },
  ]
  
  const revenueData = analytics?.revenue_by_department || [
    { department: "Total Billed", revenue: analytics?.total_revenue || 0, growth: "+12%" }
  ]
  
  const realTimeMonitoring = analytics?.real_time_monitoring || [
    { label: "ER Queue", value: "12 patients", status: "normal", percent: 60 },
    { label: "ICU Status", value: "3 beds available", status: "warning", percent: 85 },
    { label: "OT Schedule", value: "2 surgeries active", status: "normal", percent: 40 },
    { label: "Pharmacy", value: "All stocked", status: "normal", percent: 95 },
    { label: "Lab Processing", value: "8 pending", status: "normal", percent: 30 },
    { label: "Radiology", value: "5 scans queued", status: "warning", percent: 70 },
  ]
  
  const recentReports = analytics?.recent_reports || []
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
                Reports & Analytics
              </motion.h1>
              <p className="text-muted-foreground mt-1">Comprehensive hospital performance insights</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="w-4 h-4" />
                Date Range
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: "Total Patients", value: analytics ? analytics.total_patients.toString() : "0", change: "+12%", positive: true },
              { icon: DollarSign, label: "Total Revenue", value: analytics ? `$${(analytics.total_revenue / 1000).toFixed(1)}K` : "$0", change: "+15%", positive: true },
              { icon: Bed, label: "Bed Occupancy", value: analytics ? `${analytics.occupancy_rate}%` : "0%", change: "-3%", positive: false },
              { icon: Activity, label: "Avg Recovery", value: "4.2 days", change: "-8%", positive: true },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-card/80 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className={`text-sm font-medium flex items-center gap-1 ${
                      stat.positive ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Analytics */}
          <Tabs defaultValue="performance" className="mb-8">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="performance" className="gap-2">
                <Gauge className="w-4 h-4 hidden sm:block" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="diseases" className="gap-2">
                <PieChart className="w-4 h-4 hidden sm:block" />
                Diseases
              </TabsTrigger>
              <TabsTrigger value="revenue" className="gap-2">
                <DollarSign className="w-4 h-4 hidden sm:block" />
                Revenue
              </TabsTrigger>
              <TabsTrigger value="trends" className="gap-2">
                <TrendingUp className="w-4 h-4 hidden sm:block" />
                Trends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="performance">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Performance Metrics */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card className="p-6 bg-card/80 backdrop-blur-xl h-full">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-primary" />
                        Hospital Performance
                      </h3>
                      <Badge variant="outline">Live Metrics</Badge>
                    </div>

                    <div className="space-y-6">
                      {performanceMetrics.map((metric, index) => (
                        <motion.div
                          key={metric.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{metric.label}</span>
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
                            <span className="text-lg font-bold w-12 text-right">{metric.value}%</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>

                {/* Real-time Monitoring */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card className="p-6 bg-card/80 backdrop-blur-xl h-full">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        Real-time Monitoring
                      </h3>
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>

                    <div className="space-y-4">
                      {realTimeMonitoring.map((item: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{item.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{item.value}</span>
                              <span className={`w-2 h-2 rounded-full ${
                                item.status === 'normal' ? 'bg-green-500' : 'bg-amber-500'
                              }`} />
                            </div>
                          </div>
                          <Progress value={item.percent} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="diseases">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Disease Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-6 bg-card/80 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-primary" />
                        Disease Distribution
                      </h3>
                      <Badge>This Month</Badge>
                    </div>

                    <div className="space-y-4">
                      {diseaseAnalytics.map((item, index) => (
                        <motion.div
                          key={item.disease}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-primary" />
                              <span className="font-medium">{item.disease}</span>
                            </div>
                            <span className="font-medium">{item.cases} cases</span>
                          </div>
                          <Progress value={item.percentage} className="h-2" />
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Cases</span>
                        <span className="text-xl font-bold">{analytics?.total_patients || 0}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Visual Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="p-6 bg-card/80 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold">Visual Distribution</h3>
                    </div>

                    {/* Simple Donut Chart */}
                    <div className="flex items-center justify-center py-8">
                      <div className="relative w-48 h-48">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          {diseaseAnalytics.map((item, index) => {
                            const previousTotal = diseaseAnalytics
                              .slice(0, index)
                              .reduce((acc, curr) => acc + curr.percentage, 0)
                            const strokeDasharray = `${item.percentage} ${100 - item.percentage}`
                            const strokeDashoffset = -previousTotal
                            const colors = ['#3b82f6', '#ef4444', '#f59e0b', '#22c55e', '#a855f7']
                            
                            return (
                              <circle
                                key={item.disease}
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke={colors[index]}
                                strokeWidth="20"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-500"
                              />
                            )
                          })}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-3xl font-bold">{analytics?.total_patients || 0}</p>
                            <p className="text-sm text-muted-foreground">Total</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {diseaseAnalytics.map((item: any, index: number) => {
                        const colors = ['#3b82f6', '#ef4444', '#f59e0b', '#22c55e', '#a855f7']
                        return (
                        <div key={item.disease} className="flex items-center gap-2 text-sm">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                          <span className="text-muted-foreground">{item.disease}</span>
                        </div>
                      )})}
                    </div>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="revenue">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Revenue by Department */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="lg:col-span-2"
                >
                  <Card className="p-6 bg-card/80 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Revenue by Department
                      </h3>
                      <Badge className="bg-green-500/10 text-green-500">+11% overall</Badge>
                    </div>

                    <div className="space-y-4">
                      {revenueData.map((dept: any, index: number) => (
                        <motion.div
                          key={dept.department}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4"
                        >
                          <span className="w-24 text-sm font-medium">{dept.department}</span>
                          <div className="flex-1 h-8 bg-secondary rounded-lg overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(dept.revenue / 125000) * 100}%` }}
                              transition={{ delay: index * 0.1, duration: 0.5 }}
                              className="h-full bg-gradient-to-r from-primary to-accent"
                            />
                          </div>
                          <span className="w-20 text-sm font-medium text-right">
                            ${(dept.revenue / 1000).toFixed(0)}K
                          </span>
                          <span className="w-12 text-xs text-green-500">{dept.growth}</span>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>

                {/* Revenue Summary */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
                    <h3 className="font-semibold mb-6">Monthly Summary</h3>

                    <div className="space-y-6">
                      <div className="text-center p-6 rounded-xl bg-background/50">
                        <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
                        <p className="text-4xl font-bold text-primary">${analytics ? (analytics.total_revenue / 1000).toFixed(1) : 0}K</p>
                        <Badge className="mt-2 bg-green-500/10 text-green-500">+15% vs last month</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-background/50 text-center">
                          <p className="text-sm text-muted-foreground">Collections</p>
                          <p className="text-xl font-bold">${analytics ? (analytics.collected_revenue / 1000).toFixed(1) : 0}K</p>
                        </div>
                        <div className="p-4 rounded-xl bg-background/50 text-center">
                          <p className="text-sm text-muted-foreground">Pending</p>
                          <p className="text-xl font-bold">${analytics ? (analytics.pending_revenue / 1000).toFixed(1) : 0}K</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recovery Trends */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-6 bg-card/80 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Recovery Rate Trends
                      </h3>
                      <Badge className="bg-green-500/10 text-green-500">
                        +9% vs Last Quarter
                      </Badge>
                    </div>

                    {/* Bar Chart */}
                    <div className="flex items-end justify-between gap-3 h-48 px-2">
                      {recoveryTrends.map((item: any, index: number) => (
                        <motion.div
                          key={item.month}
                          initial={{ height: 0 }}
                          animate={{ height: `${item.rate}%` }}
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

                {/* Recent Reports */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="p-6 bg-card/80 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Recent Reports
                      </h3>
                      <Button variant="ghost" size="sm">View All</Button>
                    </div>

                    <div className="space-y-3">
                      {recentReports.map((report: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{report.name}</p>
                              <p className="text-xs text-muted-foreground">{report.date}</p>
                            </div>
                          </div>
                          <Badge variant={report.status === 'completed' ? 'default' : 'outline'}>
                            {report.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </main>
  )
}
