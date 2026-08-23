"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Activity, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Globe, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  UserCheck 
} from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage, languages, Language } from "@/lib/language-context"
import { useRBAC } from "@/lib/rbac-context"
import { Role } from "@/lib/api/types"

const navItems = [
  { label: "Home", href: "/" },
  { label: "AI Triage", href: "/ai-detection" },
  { label: "Health Worker", href: "/health-worker" },
  { label: "Command Center", href: "/command-center" },
  { label: "Referrals", href: "/referrals" },
  { label: "Care Timeline", href: "/patient/timeline" },
  { label: "OPD Booking", href: "/opd-booking" },
  { label: "Pharmacy", href: "/pharmacy" },
  { label: "Doctors", href: "/doctors" },
  { label: "Hospitals", href: "/hospitals" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { role, setRole, userName } = useRBAC()

  useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40 bg-background/80 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                AI Chikitsalya
              </span>
              <p className="text-[10px] text-muted-foreground font-medium">Rural Health Operations</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/70"
              >
                {t(item.label) || item.label}
              </Link>
            ))}
          </div>

          {/* Right side controls */}
          <div className="hidden md:flex items-center gap-2">
            {/* Network Status Badge */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
              isOnline ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse"
            }`}>
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? "ONLINE" : "OFFLINE"}</span>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-1 border border-border rounded-lg px-2 py-1 bg-secondary/40 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-primary" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
              >
                <option value="PATIENT">Role: Patient</option>
                <option value="HEALTH_WORKER">Role: Health Worker</option>
                <option value="DOCTOR">Role: Doctor</option>
                <option value="PHC_ADMIN">Role: PHC Admin</option>
                <option value="HOSPITAL_ADMIN">Role: Hospital Admin</option>
                <option value="DISTRICT_ADMIN">Role: District Admin</option>
              </select>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 border border-border rounded-lg px-2 py-1 bg-secondary/40 text-xs">
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full h-8 w-8"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-border bg-background"
          >
            <div className="px-4 py-4 space-y-2">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="text-xs font-bold">Role: {role}</div>
                <div className="flex items-center gap-2">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="bg-secondary text-xs p-1 rounded font-semibold"
                  >
                    {languages.map((l) => (
                      <option key={l.code} value={l.code}>{l.nativeName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t(item.label) || item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
