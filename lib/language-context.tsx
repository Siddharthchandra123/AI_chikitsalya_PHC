"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "hi" | "bn" | "ta" | "te" | "mr" | "gu";

export const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
];

export const translations: Record<Language, Record<string, string>> = {
  en: {
    home: "Home",
    aiDetection: "AI Detection",
    opdBooking: "OPD Booking",
    ambulance: "Ambulance",
    hospitals: "Hospitals",
    doctors: "Doctors",
    pharmacy: "Pharmacy",
    commandCenter: "Command Center",
    healthWorker: "Health Worker",
    patientTimeline: "Care Timeline",
    referrals: "Referrals",
    districtOps: "District Overview",
    aiPoweredHealthcare: "AI-Powered Healthcare",
    yourComplete: "Your Complete",
    healthcareCompanion: "Healthcare Companion",
    heroDescription: "Experience the future of rural healthcare with AI-powered disease triage, seamless OPD booking, real-time referral management, and edge-first continuity.",
    tryAIDiagnosis: "Try AI Triage",
    bookAppointment: "Book Appointment",
    hipaaCompliant: "HIPAA Compliant",
    yourDataSecure: "Your data is secure",
    available247: "24/7 Available",
    alwaysHere: "Always here",
    aiAccuracy: "95% Accuracy",
    aiDetectionLabel: "AI Triage",
    patients: "Patients",
    doctorsLabel: "Doctors",
    ourServices: "Our Services",
    servicesDescription: "Comprehensive rural healthcare operations platform designed for patients, health workers, PHCs, and hospitals.",
    aiDiseaseDetection: "AI Symptom Triage",
    aiDiseaseDesc: "Instant AI-assisted symptom screening with safety warning rules.",
    opdBookingTitle: "OPD Booking",
    opdBookingDesc: "Book outpatient appointments with PHC and Hospital doctors.",
    ambulanceTracking: "Ambulance Dispatch",
    ambulanceDesc: "Track emergency ambulances and request urgent transfer.",
    nearbyHospitals: "Facility Network",
    hospitalsDesc: "Hierarchical network of Sub-centres, PHCs, Block, and District Hospitals.",
    doctorProfiles: "Doctor Roster",
    doctorsDesc: "Browse medical officers and specialists across facilities.",
    medicalShops: "Pharmacy Stock",
    pharmacyDesc: "Real-time facility inventory with low-stock alerts.",
    patientDischarge: "Care Continuity",
    patientDischargeDesc: "Track dynamic patient care timeline from registration to follow-up.",
    search: "Search",
    filter: "Filter",
    apply: "Apply",
    cancel: "Cancel",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    loading: "Loading...",
    noResults: "No results found",
    viewAll: "View All",
    learnMore: "Learn More",
    getStarted: "Get Started",
  },
  hi: {
    home: "होम",
    aiDetection: "AI जांच",
    opdBooking: "OPD बुकिंग",
    ambulance: "एम्बुलेंस",
    hospitals: "अस्पताल",
    doctors: "डॉक्टर",
    pharmacy: "दवाखाना",
    commandCenter: "कमांड सेंटर",
    healthWorker: "स्वास्थ्य कार्यकर्ता",
    patientTimeline: "देखभाल समयरेखा",
    referrals: "रेफरल",
    districtOps: "जिला अवलोकन",
    aiPoweredHealthcare: "AI-संचालित स्वास्थ्य सेवा",
    yourComplete: "आपका संपूर्ण",
    healthcareCompanion: "स्वास्थ्य साथी",
    heroDescription: "AI-संचालित रोग पहचान, आसान OPD बुकिंग, रीयल-टाइम रेफरल और डिजिटल स्वास्थ्य सेवा का अनुभव करें।",
    tryAIDiagnosis: "AI जांच करें",
    bookAppointment: "अपॉइंटमेंट बुक करें",
    search: "खोजें",
    filter: "फ़िल्टर",
    apply: "लागू करें",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    back: "वापस",
    next: "आगे",
    loading: "लोड हो रहा है...",
    noResults: "कोई परिणाम नहीं मिला",
    viewAll: "सभी देखें",
  },
  bn: {
    home: "হোম",
    aiDetection: "AI সনাক্তকরণ",
    opdBooking: "OPD বুকিং",
    ambulance: "অ্যাম্বুলেন্স",
    hospitals: "হাসপাতাল",
    doctors: "ডাক্তার",
    pharmacy: "ফার্মেসি",
    commandCenter: "কমান্ড সেন্টার",
    healthWorker: "স্বাস্থ্য কর্মী",
    patientTimeline: "যত্ন টাইমলাইন",
    referrals: "রেফারেল",
    search: "খুঁজুন",
    filter: "ফিল্টার",
    loading: "লোড হচ্ছে...",
  },
  ta: {
    home: "முகப்பு",
    aiDetection: "AI கண்டறிதல்",
    opdBooking: "OPD முன்பதிவு",
    ambulance: "ஆம்புலன்ஸ்",
    hospitals: "மருத்துவமனைகள்",
    doctors: "மருத்துவர்கள்",
    pharmacy: "மருந்தகம்",
    commandCenter: "கட்டளை மையம்",
    healthWorker: "சுகாதார பணியாளர்",
    patientTimeline: "பராமரிப்பு காலக்கோடு",
    referrals: "பரிந்துரைகள்",
    search: "தேடு",
    filter: "வடிகட்டி",
    loading: "ஏற்றுகிறது...",
  },
  te: {
    home: "హోమ్",
    aiDetection: "AI గుర్తింపు",
    opdBooking: "OPD బుకింగ్",
    ambulance: "అంぶలెక్స్",
    hospitals: "ఆసుపత్రులు",
    doctors: "వైద్యులు",
    pharmacy: "ఫార్మసీ",
    commandCenter: "కమాండ్ సెంటర్",
    healthWorker: "ఆరోగ్య కార్యకర్త",
    patientTimeline: "సంరక్షణ టైమ్‌లైన్",
    referrals: "రెఫరల్స్",
    search: "వెతకండి",
    filter: "ఫిల్టర్",
    loading: "లోడ్ అవుతోంది...",
  },
  mr: {
    home: "मुख्यपृष्ठ",
    aiDetection: "AI शोध",
    opdBooking: "OPD बुकिंग",
    ambulance: "रुग्णवाहिका",
    hospitals: "रुग्णालये",
    doctors: "डॉक्टर",
    pharmacy: "औषधालय",
    commandCenter: "कमांड सेंटर",
    healthWorker: "आरोग्य कार्यकर्ता",
    patientTimeline: "काळजी टाइमलाइन",
    referrals: "संदर्भ",
    search: "शोधा",
    filter: "फिल्टर",
    loading: "लोड होत आहे...",
  },
  gu: {
    home: "હોમ",
    aiDetection: "AI તપાસ",
    opdBooking: "OPD બુકિંગ",
    ambulance: "એમ્બ્યુલન્સ",
    hospitals: "હોસ્પિટલો",
    doctors: "ડોક્ટરો",
    pharmacy: "ફાર્મસી",
    commandCenter: "કમાન્ડ સેન્ટર",
    healthWorker: "આરોગ્ય કાર્યકર",
    patientTimeline: "સંભાળ ટાઇમલાઇન",
    referrals: "રેફરલ્સ",
    search: "શોધો",
    filter: "ફિલ્ટર",
    loading: "લોડ થઈ રહ્યું છે...",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("medicare-language") as Language;
    if (saved && translations[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("medicare-language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
