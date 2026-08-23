"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { 
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building,
  Users,
  Headphones,
  CheckCircle2
} from "lucide-react"

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    value: "support@aichikitsalya.com",
    description: "Send us an email anytime"
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+1 (555) 123-4567",
    description: "Mon-Fri from 8am to 6pm"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "123 Healthcare Blvd, Suite 500",
    description: "San Francisco, CA 94105"
  },
  {
    icon: Clock,
    title: "Business Hours",
    value: "Mon - Fri: 8:00 AM - 6:00 PM",
    description: "Weekend support available"
  },
]

const departments = [
  { name: "Sales", icon: Building, description: "Get pricing and demo" },
  { name: "Support", icon: Headphones, description: "Technical assistance" },
  { name: "Partnerships", icon: Users, description: "Business collaboration" },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    hospital: "",
    department: "",
    message: ""
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setIsSubmitted(true)
  }

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
              <MessageSquare className="w-4 h-4 mr-2" />
              Get In Touch
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-balance mb-6">
              We&apos;d Love to Hear <br />
              <span className="text-gradient">From You</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about AI Chikitsalya? Want to schedule a demo? 
              Our team is here to help you transform your healthcare operations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center bg-card/80 backdrop-blur-xl hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{info.title}</h3>
                  <p className="text-sm font-medium text-primary mb-1">{info.value}</p>
                  <p className="text-xs text-muted-foreground">{info.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Card className="p-6 sm:p-8 bg-card/80 backdrop-blur-xl">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Full Name *</label>
                          <Input
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email Address *</label>
                          <Input
                            type="email"
                            placeholder="john@hospital.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone Number</label>
                          <Input
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Hospital/Organization</label>
                          <Input
                            placeholder="City General Hospital"
                            value={formData.hospital}
                            onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Department</label>
                        <div className="grid grid-cols-3 gap-3">
                          {departments.map((dept) => (
                            <button
                              key={dept.name}
                              type="button"
                              onClick={() => setFormData({...formData, department: dept.name})}
                              className={`p-4 rounded-xl border text-center transition-all ${
                                formData.department === dept.name 
                                  ? 'border-primary bg-primary/10' 
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <dept.icon className={`w-5 h-5 mx-auto mb-2 ${
                                formData.department === dept.name ? 'text-primary' : 'text-muted-foreground'
                              }`} />
                              <p className="text-sm font-medium">{dept.name}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Message *</label>
                        <Textarea
                          placeholder="Tell us about your needs..."
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          required
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full sm:w-auto gap-2">
                        <Send className="w-4 h-4" />
                        Send Message
                      </Button>
                    </form>
                  </>
                )}
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Quick Contact */}
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
                <h3 className="font-semibold mb-4">Quick Contact</h3>
                <div className="space-y-4">
                  <a 
                    href="mailto:support@aichikitsalya.com" 
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition-colors"
                  >
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Email Support</p>
                      <p className="text-xs text-muted-foreground">support@aichikitsalya.com</p>
                    </div>
                  </a>
                  <a 
                    href="tel:+15551234567" 
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition-colors"
                  >
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Call Us</p>
                      <p className="text-xs text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </a>
                </div>
              </Card>

              {/* FAQ */}
              <Card className="p-6 bg-card/80 backdrop-blur-xl">
                <h3 className="font-semibold mb-4">Frequently Asked</h3>
                <div className="space-y-4">
                  {[
                    { q: "How long is the free trial?", a: "30 days, full access" },
                    { q: "Is training included?", a: "Yes, for all plans" },
                    { q: "Can I migrate my data?", a: "We help with migration" },
                    { q: "Is it HIPAA compliant?", a: "Yes, fully compliant" },
                  ].map((faq, index) => (
                    <div key={index} className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-sm font-medium">{faq.q}</p>
                      <p className="text-xs text-muted-foreground mt-1">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Office Location */}
              <Card className="p-6 bg-card/80 backdrop-blur-xl overflow-hidden">
                <h3 className="font-semibold mb-4">Our Office</h3>
                <div className="aspect-video rounded-lg bg-secondary/50 flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm">
                  <span className="font-medium">AI Chikitsalya HQ</span><br />
                  123 Healthcare Blvd, Suite 500<br />
                  San Francisco, CA 94105
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
