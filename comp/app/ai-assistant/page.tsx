"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { 
  Bot, 
  Mic, 
  Send, 
  Sparkles,
  FileText,
  Pill,
  Clipboard,
  User,
  Image,
  Upload,
  Clock,
  Brain,
  Stethoscope,
  Activity,
  AlertCircle,
  CheckCircle2,
  X,
  Plus
} from "lucide-react"

const suggestedPrompts = [
  { icon: FileText, text: "Analyze this blood report", description: "Upload a report for AI analysis" },
  { icon: Pill, text: "Generate prescription", description: "Create a new prescription" },
  { icon: Clipboard, text: "Summarize discharge notes", description: "Get a quick summary" },
  { icon: Stethoscope, text: "Symptom assessment", description: "Analyze patient symptoms" },
  { icon: Activity, text: "Drug interaction check", description: "Check for interactions" },
  { icon: Brain, text: "Treatment suggestions", description: "Get AI recommendations" },
]

const chatHistory = [
  { id: 1, title: "Blood Report Analysis - Patient #2341", time: "2 hours ago" },
  { id: 2, title: "Prescription Generation - Sarah Johnson", time: "Yesterday" },
  { id: 3, title: "Symptom Assessment - Emergency Case", time: "2 days ago" },
  { id: 4, title: "Drug Interaction Check", time: "3 days ago" },
]

const initialMessages = [
  { 
    role: "assistant", 
    content: "Hello! I'm your AI Medical Assistant powered by advanced language models. I can help you with:\n\n• Analyzing medical reports and lab results\n• Generating prescriptions based on diagnosis\n• Checking drug interactions\n• Providing symptom assessments\n• Summarizing medical records\n\nHow can I assist you today?" 
  },
]

import { sendChatMessage } from "@/hooks/use-api"

export default function AIAssistantPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = async () => {
    if (!inputValue.trim()) return
    
    const userMsg = inputValue
    const newMessages = [
      ...messages,
      { role: "user", content: userMsg }
    ]
    setMessages(newMessages)
    setInputValue("")
    setIsTyping(true)
    
    try {
      const result = await sendChatMessage(userMsg)
      setMessages([
        ...newMessages,
        { role: "assistant", content: result.response || "No response received." }
      ])
    } catch (e: any) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, I encountered an error communicating with the backend." }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt)
  }

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
                className="text-3xl font-bold flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                AI Medical Assistant
              </motion.h1>
              <p className="text-muted-foreground mt-1">Intelligent healthcare support powered by AI</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-2 py-1.5 px-3">
                <Sparkles className="w-4 h-4" />
                GPT-4 Medical
              </Badge>
              <Badge className="bg-green-500/10 text-green-500 gap-2 py-1.5 px-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Online
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* New Chat */}
              <Button className="w-full gap-2">
                <Plus className="w-4 h-4" />
                New Conversation
              </Button>

              {/* Chat History */}
              <Card className="p-4 bg-card/80 backdrop-blur-xl">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Recent Chats
                </h3>
                <div className="space-y-2">
                  {chatHistory.map((chat) => (
                    <div 
                      key={chat.id}
                      className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary cursor-pointer transition-colors"
                    >
                      <p className="text-sm font-medium truncate">{chat.title}</p>
                      <p className="text-xs text-muted-foreground">{chat.time}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* AI Capabilities */}
              <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10">
                <h3 className="font-semibold mb-4">AI Capabilities</h3>
                <div className="space-y-3">
                  {[
                    { icon: CheckCircle2, text: "Report Analysis" },
                    { icon: CheckCircle2, text: "Drug Interactions" },
                    { icon: CheckCircle2, text: "Symptom Assessment" },
                    { icon: CheckCircle2, text: "Treatment Plans" },
                    { icon: CheckCircle2, text: "Voice Commands" },
                    { icon: CheckCircle2, text: "Multi-language" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <item.icon className="w-4 h-4 text-green-500" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Main Chat Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <Card className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-xl overflow-hidden h-[700px] flex flex-col">
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
                        <span className="text-xs text-muted-foreground">Active now</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === 'user' ? 'bg-secondary' : 'bg-primary'
                          }`}>
                            {message.role === 'user' ? (
                              <User className="w-4 h-4 text-secondary-foreground" />
                            ) : (
                              <Bot className="w-4 h-4 text-primary-foreground" />
                            )}
                          </div>
                          <div className={`p-4 rounded-2xl ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-secondary'
                          }`}>
                            <p className="text-sm whitespace-pre-line">{message.content}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="p-4 rounded-2xl bg-secondary">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="rounded-full flex-shrink-0">
                      <Upload className="w-5 h-5" />
                    </Button>
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
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="rounded-full bg-secondary/50 border-0"
                    />
                    <Button 
                      size="icon" 
                      className="rounded-full flex-shrink-0"
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Right Sidebar - Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Quick Actions */}
              <Card className="p-4 bg-card/80 backdrop-blur-xl">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePromptClick(prompt.text)}
                      className="w-full p-3 rounded-xl bg-secondary/50 hover:bg-secondary flex items-center gap-3 text-left transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <prompt.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{prompt.text}</p>
                        <p className="text-xs text-muted-foreground truncate">{prompt.description}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </Card>

              {/* Voice Assistant */}
              <Card className="p-4 bg-card/80 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Voice Assistant</h3>
                    <p className="text-sm text-muted-foreground">Speak to interact</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsListening(!isListening)}
                  className={`w-full h-24 rounded-2xl flex items-center justify-center transition-colors ${
                    isListening ? 'bg-primary' : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  <Mic className={`w-10 h-10 ${isListening ? 'text-primary-foreground animate-pulse' : 'text-muted-foreground'}`} />
                </motion.button>
                {isListening && (
                  <p className="text-center text-sm text-muted-foreground mt-3">Listening...</p>
                )}
              </Card>

              {/* Disclaimer */}
              <Card className="p-4 bg-amber-500/10 border-amber-500/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Medical Disclaimer</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      AI suggestions should be verified by qualified healthcare professionals before implementation.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
