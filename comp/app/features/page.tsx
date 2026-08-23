"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"
import { 
  Brain,
  FileText,
  Users,
  Calendar,
  Pill,
  Activity,
  Shield,
  Zap,
  Globe,
  Clock,
  BarChart3,
  MessageSquare,
  Smartphone,
  Cloud,
  Lock,
  Headphones,
  ArrowRight,
  Check
} from "lucide-react"

const mainFeatures = [
  {
    icon: Brain,
    title: "AI-Powered Diagnostics",
    description: "Advanced machine learning algorithms assist in diagnosing conditions by analyzing patient data, lab results, and medical imaging.",
    benefits: ["98% accuracy rate", "Real-time analysis", "Multi-specialty support"]
  },
  {
    icon: FileText,
    title: "Smart Medical Records",
    description: "Comprehensive electronic health records with intelligent search, auto-categorization, and seamless sharing across departments.",
    benefits: ["Cloud-based storage", "HIPAA compliant", "Easy retrieval"]
  },
  {
    icon: Users,
    title: "Patient Management",
    description: "Complete patient lifecycle management from registration to discharge, with automated reminders and follow-up scheduling.",
    benefits: ["360° patient view", "Automated alerts", "Family history tracking"]
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "AI-optimized appointment scheduling that minimizes wait times and maximizes resource utilization.",
    benefits: ["Auto-scheduling", "Conflict detection", "Multi-calendar sync"]
  },
  {
    icon: Pill,
    title: "Prescription Management",
    description: "Generate, track, and manage prescriptions with built-in drug interaction checks and dosage recommendations.",
    benefits: ["Drug interaction alerts", "E-prescriptions", "Pharmacy integration"]
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Real-time insights into hospital operations, patient outcomes, and financial performance.",
    benefits: ["Custom reports", "Predictive analytics", "KPI tracking"]
  },
]

const additionalFeatures = [
  { icon: Shield, title: "Data Security", description: "Enterprise-grade encryption and security" },
  { icon: Zap, title: "Fast Performance", description: "Lightning-fast response times" },
  { icon: Globe, title: "Multi-language", description: "Support for 20+ languages" },
  { icon: Clock, title: "24/7 Availability", description: "Always-on cloud infrastructure" },
  { icon: MessageSquare, title: "Telemedicine", description: "Built-in video consultations" },
  { icon: Smartphone, title: "Mobile App", description: "iOS and Android apps" },
  { icon: Cloud, title: "Cloud Native", description: "Scalable cloud architecture" },
  { icon: Lock, title: "Access Control", description: "Role-based permissions" },
  { icon: Headphones, title: "24/7 Support", description: "Round-the-clock assistance" },
]

const pricingPlans = [
  {
    name: "Starter",
    price: "$499",
    period: "/month",
    description: "Perfect for small clinics",
    features: [
      "Up to 500 patients",
      "Basic AI diagnostics",
      "Email support",
      "5 user accounts",
      "Basic analytics"
    ]
  },
  {
    name: "Professional",
    price: "$999",
    period: "/month",
    description: "For growing hospitals",
    features: [
      "Up to 5,000 patients",
      "Advanced AI features",
      "Priority support",
      "25 user accounts",
      "Full analytics suite",
      "Telemedicine",
      "API access"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large healthcare networks",
    features: [
      "Unlimited patients",
      "Custom AI models",
      "Dedicated support",
      "Unlimited users",
      "Advanced analytics",
      "Custom integrations",
      "On-premise option",
      "SLA guarantee"
    ]
  }
]

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-background" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 py-1.5 px-4">
              <Zap className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6">
              Everything You Need to <br />
              <span className="text-gradient">Transform Healthcare</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              AI Chikitsalya combines cutting-edge AI technology with intuitive design to deliver 
              a comprehensive hospital management solution.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="rounded-full gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed to streamline hospital operations and improve patient care.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-card/80 backdrop-blur-xl hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">And Much More</h2>
            <p className="text-lg text-muted-foreground">
              Additional features to enhance your hospital management experience.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-background/80 backdrop-blur-xl"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your healthcare facility. All plans include a 30-day free trial.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 h-full relative ${plan.popular ? 'border-primary shadow-lg' : 'bg-card/80'}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full rounded-full" 
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-primary/10 to-accent/10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Transform Your Hospital?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of healthcare facilities already using AI Chikitsalya to improve patient outcomes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="rounded-full gap-2">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="rounded-full">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
