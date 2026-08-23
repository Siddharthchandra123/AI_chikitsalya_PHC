"use client";

import { useMemo, useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  HeartPulse,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Thermometer,
  Wind,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api/client";
import { TriageResult } from "@/lib/api/types";

const symptomOptions = [
  ["fever", "Fever", Thermometer],
  ["cough", "Cough", Activity],
  ["headache", "Headache", Brain],
  ["fatigue", "Fatigue", HeartPulse],
  ["body_ache", "Body ache", Activity],
  ["breathing_difficulty", "Breathing difficulty", Wind],
  ["nausea", "Nausea", Activity],
  ["sore_throat", "Sore throat", Stethoscope],
  ["runny_nose", "Runny nose", Wind],
  ["sneezing", "Sneezing", Activity],
  ["vomiting", "Vomiting", Activity],
  ["dizziness", "Dizziness", Activity],
  ["chest_pain", "Chest pain", HeartPulse],
] as const;

function label(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function score(value = 0) {
  return Math.round(Math.max(0, Math.min(1, value)) * 100);
}

export default function AIDetectionPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [result, setResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAI, setShowAI] = useState(false);

  function toggleSymptom(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id]
    );
  }

  async function analyze() {
    if (!selected.length) {
      setError("Please select at least one symptom.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await api.predictTriage(selected, details, !navigator.onLine);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to connect to AI Triage Service");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setSelected([]);
    setDetails("");
    setResult(null);
    setError("");
    setShowAI(false);
  }

  const emergency = Boolean(result?.is_emergency);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-24 md:px-6">
        {!result ? (
          <>
            <section className="mb-8 rounded-3xl border bg-card p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI-assisted health screening & triage
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    Understand your symptoms
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                    Select your symptoms. AI Chikitsalya performs an initial safety triage screening to assist frontline health workers and patients.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-2xl border bg-secondary/50 px-4 py-3 text-xs text-muted-foreground">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  Privacy-First Edge Triage
                </div>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              <Card className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    Step 1
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-foreground">
                    What symptoms are present?
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select all that apply.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {symptomOptions.map(([id, name, Icon]) => {
                    const active = selected.includes(id);

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleSymptom(id)}
                        className={`rounded-2xl border p-4 text-left transition ${active
                          ? "border-primary bg-primary/10 text-primary font-bold ring-2 ring-primary/20"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40"
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="mt-3 block text-sm font-semibold">
                          {name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-7">
                  <label className="text-sm font-semibold text-foreground">
                    Additional Context <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>

                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="e.g. Fever started 2 days ago, temperature around 101°F..."
                    className="mt-2 min-h-24 w-full resize-y rounded-2xl border bg-background p-4 text-sm text-foreground outline-none transition focus:border-primary"
                  />
                </div>

                {error && (
                  <div className="mt-5 flex gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <Button variant="outline" onClick={reset} disabled={loading} className="rounded-xl">
                    Clear
                  </Button>

                  <Button size="lg" onClick={analyze} disabled={loading || !selected.length} className="rounded-xl">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Performing Triage...
                      </>
                    ) : (
                      <>
                        Start Assessment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Safety Disclaimers */}
              <div className="space-y-5">
                <Card className="rounded-3xl border bg-card p-6 shadow-sm">
                  <h3 className="font-bold text-foreground">Clinical Safety Language</h3>
                  <div className="mt-4 space-y-4 text-xs text-muted-foreground leading-relaxed">
                    <p>• The AI engine performs preliminary risk stratification.</p>
                    <p>• Emergency rules detect acute danger signs like chest pain or severe respiratory distress.</p>
                    <p>• Output is NEVER a confirmed medical diagnosis.</p>
                  </div>
                </Card>

                <Card className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5 text-xs text-amber-900 dark:text-amber-200">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
                    <p>
                      This tool provides decision support for rural healthcare workers and patients. Consult a registered medical doctor for accurate diagnosis.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Safety Banner */}
            <Card
              className={`mb-6 rounded-3xl p-6 shadow-sm ${emergency ? "border-red-500/30 bg-red-500/10" : "border-emerald-500/30 bg-emerald-500/10"
                }`}
            >
              <div className="flex gap-4">
                {emergency ? (
                  <AlertTriangle className="h-7 w-7 shrink-0 text-red-600" />
                ) : (
                  <ShieldCheck className="h-7 w-7 shrink-0 text-emerald-600" />
                )}

                <div>
                  <p className={`font-bold text-base ${emergency ? "text-red-900 dark:text-red-200" : "text-emerald-900 dark:text-emerald-200"}`}>
                    {emergency ? "Urgent Medical Attention Required" : `Triage Risk Level: ${result.risk_level}`}
                  </p>

                  <p className="mt-1 text-xs leading-relaxed">
                    {emergency
                      ? result.emergency_message
                      : "No emergency red flags were detected by the safety screening engine."}
                  </p>
                </div>
              </div>
            </Card>

            {/* Assessment Details */}
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              <div className="space-y-6">
                <Card className="overflow-hidden rounded-3xl border bg-card shadow-sm">
                  <div className="bg-primary px-6 py-7 text-primary-foreground md:px-8">
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
                      Preliminary Screening Result
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">{result.condition || "General Screening"}</h1>

                    <p className="mt-2 text-xs opacity-90">
                      Model Matching Score: {score(result.confidence)}%
                    </p>
                  </div>

                  <div className="p-6 md:p-8 space-y-6">
                    {/* Symptoms */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Symptoms Evaluated
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.high_risk_symptoms?.map((s) => (
                          <Badge key={s} variant="destructive" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Precautions */}
                    <div>
                      <h3 className="font-bold text-sm text-foreground mb-2">Recommended Clinical Care Guidelines</h3>
                      <div className="space-y-2">
                        {result.precautions?.map((p, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-secondary/30 text-xs text-foreground flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Guidance text */}
                    <div className="p-4 rounded-2xl border bg-secondary/20">
                      <p className="whitespace-pre-line text-xs leading-relaxed text-foreground">{result.reply}</p>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={reset} className="rounded-xl">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    New Assessment
                  </Button>
                  <Button onClick={() => (window.location.href = "/doctors")} className="rounded-xl">
                    Consult Doctor
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-5">
                <Card className="rounded-3xl border bg-card p-5 shadow-sm">
                  <h3 className="font-bold text-sm mb-3">Model Pattern Rankings</h3>
                  <div className="space-y-3">
                    {result.top_predictions?.map((pred) => (
                      <div key={pred.disease} className="text-xs space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span>{pred.disease}</span>
                          <span>{score(pred.confidence)}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${score(pred.confidence)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </aside>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
