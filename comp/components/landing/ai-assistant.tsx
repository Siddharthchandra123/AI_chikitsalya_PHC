"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Bot, 
  Mic, 
  Send, 
  Sparkles,
  FileText,
  Pill,
  Clipboard,
  User
} from "lucide-react"

const suggestedPrompts = [
  { icon: FileText, text: "Analyze this blood report" },
  { icon: Pill, text: "Generate prescription" },
  { icon: Clipboard, text: "Summarize discharge notes" },
]

const chatMessages = [
  { 
    role: "assistant", 
    content: "Hello! I'm your AI Medical Assistant. I can help you analyze reports, generate prescriptions, and provide clinical insights. How can I assist you today?" 
  },
  { 
    role: "user", 
    content: "Analyze the blood report for Patient #2341" 
  },
  { 
    role: "assistant", 
    content: "I've analyzed the blood report for Patient #2341. Here are the key findings:\n\n• HbA1c: 6.8% (Slightly elevated - Pre-diabetic range)\n• Cholesterol: 210 mg/dL (Borderline high)\n• Blood Pressure: 128/82 mmHg (Normal range)\n\nRecommendation: Consider dietary modifications and follow-up in 3 months." 
  },
]

export function AIAssistant() {
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI Medical Assistant
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-balance">
            Your Intelligent Healthcare Companion
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant AI-powered assistance for diagnoses, report analysis, and clinical documentation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Card className="rounded-3xl border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Medical Assistant</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-muted-foreground">Online</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  GPT-4 Medical
                </Badge>
              </div>

              {/* Chat Messages */}
              <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user' ? 'bg-secondary' : 'bg-primary'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-4 h-4 text-secondary-foreground" />
                        ) : (
                          <Bot className="w-4 h-4 text-primary-foreground" />
                        )}
                      </div>
                      <div className={`p-3 rounded-2xl ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Button
                    variant={isListening ? "default" : "outline"}
                    size="icon"
                    className="rounded-full flex-shrink-0"
                    onClick={() => setIsListening(!isListening)}
                  >
                    <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                  </Button>
                  <Input
                    placeholder="Ask AI Assistant..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="rounded-full bg-secondary/50 border-0"
                  />
                  <Button size="icon" className="rounded-full flex-shrink-0">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Suggested Prompts & Features */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <Card className="p-6 rounded-2xl border-border/50 bg-card/80 backdrop-blur-xl">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                {suggestedPrompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 rounded-xl bg-secondary/50 hover:bg-secondary flex items-center gap-4 text-left transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <prompt.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">{prompt.text}</span>
                  </motion.button>
                ))}
              </div>
            </Card>

            {/* AI Capabilities */}
            <Card className="p-6 rounded-2xl border-border/50 bg-gradient-to-br from-primary/10 to-accent/10">
              <h3 className="font-semibold mb-4">AI Capabilities</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Report Analysis",
                  "Drug Interactions",
                  "Symptom Assessment",
                  "Treatment Plans",
                  "Voice Commands",
                  "Multi-language"
                ].map((capability, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm">{capability}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Voice Assistant */}
            <Card className="p-6 rounded-2xl border-border/50 bg-card/80 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Voice Assistant</h3>
                  <p className="text-sm text-muted-foreground">Speak to interact with AI</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Mic className="w-6 h-6 text-primary-foreground" />
                </motion.button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
