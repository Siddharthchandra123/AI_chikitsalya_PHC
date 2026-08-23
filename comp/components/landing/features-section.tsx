"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { 
  FileText, 
  Users, 
  FileSearch, 
  Calendar, 
  ClipboardList, 
  CreditCard,
  Bot,
  Mic
} from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "AI Prescription Generator",
    description: "Automatically generate accurate prescriptions based on patient symptoms and medical history using advanced AI."
  },
  {
    icon: Users,
    title: "Smart Patient Records",
    description: "Centralized digital records with intelligent search and automatic categorization of patient data."
  },
  {
    icon: FileSearch,
    title: "Medical Report Analyzer",
    description: "AI-powered analysis of lab reports, X-rays, and medical documents with instant insights."
  },
  {
    icon: Calendar,
    title: "Appointment Scheduler",
    description: "Smart scheduling system that optimizes doctor availability and reduces patient wait times."
  },
  {
    icon: ClipboardList,
    title: "Discharge Management",
    description: "Streamlined discharge process with automated summary generation and follow-up scheduling."
  },
  {
    icon: CreditCard,
    title: "Billing & Insurance",
    description: "Integrated billing system with insurance claim processing and payment tracking."
  },
  {
    icon: Bot,
    title: "Doctor Assistant AI",
    description: "AI companion that assists doctors with diagnoses, treatment suggestions, and documentation."
  },
  {
    icon: Mic,
    title: "Voice-to-Prescription",
    description: "Convert spoken notes into structured prescriptions using advanced speech recognition."
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
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
            AI-Powered Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-balance">
            Intelligent Healthcare Management
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Discover how our AI-driven features transform hospital operations and improve patient care.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
