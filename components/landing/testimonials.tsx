"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "Dr. Rajesh Sharma",
    role: "Chief Medical Officer",
    hospital: "Apollo Hospitals",
    content: "AI Chikitsalya has revolutionized how we manage patient care. The AI-powered diagnosis assistance has improved our accuracy by 40% and significantly reduced wait times.",
    initials: "RS"
  },
  {
    name: "Dr. Priya Patel",
    role: "Hospital Administrator",
    hospital: "Max Healthcare",
    content: "The billing and insurance integration alone has saved us countless hours. The entire platform is intuitive and our staff adopted it within weeks.",
    initials: "PP"
  },
  {
    name: "Dr. Amit Kumar",
    role: "Senior Cardiologist",
    hospital: "Fortis Hospital",
    content: "The voice-to-prescription feature is a game-changer. I can now document patient visits in half the time while maintaining complete accuracy.",
    initials: "AK"
  },
  {
    name: "Dr. Sunita Reddy",
    role: "Director of Operations",
    hospital: "AIIMS Delhi",
    content: "Real-time analytics and AI insights have helped us optimize resource allocation. We&apos;ve seen a 25% improvement in bed utilization since implementation.",
    initials: "SR"
  },
  {
    name: "Dr. Vikram Singh",
    role: "Emergency Medicine Head",
    hospital: "Medanta Hospital",
    content: "The emergency alert system and AI triage have been invaluable. Critical cases are now identified and prioritized automatically, saving precious time.",
    initials: "VS"
  },
  {
    name: "Dr. Meera Gupta",
    role: "Chief Nursing Officer",
    hospital: "Narayana Health",
    content: "Our nursing staff loves the smart scheduling system. It has reduced overtime by 30% while ensuring optimal patient coverage at all times.",
    initials: "MG"
  },
]

export function Testimonials() {
  return (
    <section className="py-24 relative">
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
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-balance">
            Trusted by Leading Healthcare Institutions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from doctors and hospital administrators who have transformed their operations with AI Chikitsalya.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="p-6 h-full rounded-2xl border-border/50 bg-card/80 backdrop-blur-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-muted-foreground mb-6 text-pretty">
                  {testimonial.content}
                </p>
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-primary">{testimonial.hospital}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
