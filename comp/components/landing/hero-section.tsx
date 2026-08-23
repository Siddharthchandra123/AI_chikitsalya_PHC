"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Brain, Stethoscope, HeartPulse, Pill } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Brain className="w-4 h-4" />
              Powered by Advanced AI
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance"
            >
              <span className="text-gradient">AI Chikitsalya</span>
              <br />
              <span className="text-foreground">Smart Healthcare</span>
              <br />
              <span className="text-muted-foreground">Powered by AI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 text-pretty"
            >
              Manage patients, prescriptions, reports, billing, and hospital operations 
              with intelligent automation. Experience the future of healthcare management.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" className="rounded-full text-lg px-8 gap-2 group">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-lg px-8 gap-2">
                <Play className="w-5 h-5" />
                View Dashboard
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 grid grid-cols-3 gap-8"
            >
              {[
                { value: "500+", label: "Hospitals" },
                { value: "1M+", label: "Patients" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Animated Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Central Brain/AI Element */}
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl animate-pulse-glow">
                  <Brain className="w-24 h-24 text-primary-foreground" />
                </div>
              </motion.div>

              {/* Floating Medical Icons */}
              {[
                { Icon: Stethoscope, delay: 0, position: "top-0 left-1/4" },
                { Icon: HeartPulse, delay: 0.5, position: "top-1/4 right-0" },
                { Icon: Pill, delay: 1, position: "bottom-1/4 left-0" },
              ].map(({ Icon, delay, position }, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + delay, duration: 0.5 }}
                  className={`absolute ${position}`}
                >
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      delay: delay,
                      ease: "easeInOut"
                    }}
                    className="w-16 h-16 rounded-2xl glass flex items-center justify-center shadow-lg"
                  >
                    <Icon className="w-8 h-8 text-primary" />
                  </motion.div>
                </motion.div>
              ))}

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                <motion.path
                  d="M200 200 L100 100"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="text-primary/30"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 1 }}
                  fill="none"
                />
                <motion.path
                  d="M200 200 L320 120"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="text-primary/30"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 1.2 }}
                  fill="none"
                />
                <motion.path
                  d="M200 200 L80 280"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="text-primary/30"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 1.4 }}
                  fill="none"
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
