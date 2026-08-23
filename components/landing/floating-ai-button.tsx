"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X, Sparkles, Send, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export function FloatingAIButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-80"
          >
            <Card className="rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">AI Assistant</p>
                    <p className="text-xs text-muted-foreground">Always here to help</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Chat Body */}
              <div className="p-4 h-48 overflow-y-auto">
                <div className="flex gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <div className="p-3 rounded-2xl bg-secondary text-sm">
                    <p>Hello! I&apos;m your AI healthcare assistant. How can I help you today?</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {["Schedule an appointment", "Find a doctor", "View lab results"].map((suggestion) => (
                    <button
                      key={suggestion}
                      className="w-full p-2 text-left text-sm rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border/50 space-y-3">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type a message..." 
                    className="rounded-full bg-secondary/50 border-0 text-sm"
                  />
                  <Button size="icon" className="rounded-full flex-shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <Link href="/ai-assistant">
                  <Button variant="ghost" className="w-full text-sm gap-2">
                    Open Full Assistant
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl flex items-center justify-center animate-pulse-glow"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Bot className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
