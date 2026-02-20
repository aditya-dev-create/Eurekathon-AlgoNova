import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Shield,
  User,
  Briefcase,
  Zap,
  Phone,
  Mail,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Smartphone,
  Home,
  CheckCircle2,
  Lock,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SegmentedControl } from "../components/SegmentedControl"
import { CustomSlider } from "../components/CustomSlider"
import { SignalSection } from "../components/SignalSection"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/LanguageContext"

const onboardingSteps = [
  {
    title: "onboarding.identity_title",
    desc: "onboarding.identity_desc",
    icon: User
  },
  {
    title: "onboarding.stability_title",
    desc: "onboarding.stability_desc",
    icon: Briefcase
  },
  {
    title: "onboarding.footprint_title",
    desc: "onboarding.footprint_desc",
    icon: Zap
  },
  {
    title: "Sovereign Identity",
    desc: "Government-verified identifiers for deep trust verification.",
    icon: Shield
  }
]

const Onboarding = () => {
  const { t } = useLanguage()
  const [step, setStep] = React.useState(0)
  const [complete, setComplete] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const [form, setForm] = React.useState({
    fullName: "",
    age: 26,
    gender: "Male",
    email: "",
    phone: "",
    maritalStatus: "Single",
    education: "Undergraduate",
    occupation: "",
    residence: "Urban",
    yearsAtResidence: 3,
    hasBankAccount: true,
    hasUtilityBills: false,
    smartphoneUsage: 4,
    upiUsage: true,
    aadhaar: "",
    pan: ""
  })

  const updateForm = (key: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate complex analysis
    await new Promise(resolve => setTimeout(resolve, 2500))
    setLoading(false)
    setComplete(true)
  }

  const CurrentIcon = onboardingSteps[step]?.icon || Shield;

  if (complete) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 selection:bg-orange-100 selection:text-orange-900 relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-bespoke p-8 space-y-6 text-center border border-white dark:border-slate-800"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-t-3xl" />

          <div className="w-20 h-20 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto ring-1 ring-orange-500/20 animate-float shadow-lg shadow-orange-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">Identity Verified</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Your digital footprint has been synthesized. You are now eligible for basic credit products.
            </p>
          </div>

          <div className="p-6 bg-slate-50/80 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-600 rounded-xl flex items-center justify-center shrink-0 border border-orange-500/20">
                <Shield className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 dark:text-slate-50">Signal Authenticated</h3>
                <p className="text-xs text-slate-500">Cross-verified via alternative data channels.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-widest">Confidence</div>
                <div className="text-sm font-black text-orange-500">98.2%</div>
              </div>
              <div className="p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-widest">Risk Tier</div>
                <div className="text-sm font-black text-emerald-500">ALPHA</div>
              </div>
            </div>
          </div>

          <Link
            to="/behavioral-quiz"
            className="w-full block pt-2"
            onClick={() => localStorage.setItem("onboarding_complete", "true")}
          >
            <Button
              className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 group transform active:scale-[0.98]"
            >
              Continue to Quiz
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-orange-100 selection:text-orange-900 pb-32 relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-10 pointer-events-none" />

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl">
        <div className="max-w-[640px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-500/20 animate-float">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-sm">TrustMetrics <span className="text-slate-400">/ ID</span></span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">SECURE NODE</div>
          </div>
        </div>
      </nav>

      <main className="max-w-[640px] mx-auto px-6 pt-16 relative z-10">
        <header className="mb-12 space-y-4 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-3 py-1 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold rounded-full w-fit uppercase tracking-widest border border-orange-100 dark:border-orange-900/50 shadow-sm mx-auto sm:mx-0"
          >
            KYC Optimization Module
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black tracking-tighter"
          >
            Digital Persona.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 text-lg max-w-[480px] leading-relaxed mx-auto sm:mx-0"
          >
            Complete your profile to enable the deep analysis engine. AI-driven identity verification starts here.
          </motion.p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Identity */}
          <SignalSection
            index={0}
            title={t(onboardingSteps[0].title)}
            description={t(onboardingSteps[0].desc)}
            icon={<User className="w-4 h-4" />}
          >
            <div className="card-in-card space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="label-refined">Full Legal Name</label>
                <input
                  id="fullName"
                  autoFocus
                  required
                  type="text"
                  placeholder="Johnathan Doe"
                  className="input-refined"
                  value={form.fullName}
                  onChange={(e) => updateForm("fullName", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4 space-y-1.5">
                  <label htmlFor="age" className="label-refined">Age</label>
                  <input
                    id="age"
                    required
                    type="number"
                    className="input-refined mono font-bold"
                    value={form.age}
                    onChange={(e) => updateForm("age", parseInt(e.target.value))}
                  />
                </div>
                <div className="col-span-8 space-y-1.5">
                  <label className="label-refined">Gender Disclosure</label>
                  <SegmentedControl
                    name="gender"
                    options={["Male", "Female", "Other"]}
                    value={form.gender}
                    onChange={(val) => updateForm("gender", val)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="label-refined">Work Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -reset translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      id="email"
                      required
                      type="email"
                      placeholder="work@company.com"
                      className="input-refined pl-9"
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="label-refined">Mobile Connect</label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      id="phone"
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="input-refined pl-9 mono"
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </SignalSection>

          {/* Section 2: Financial Stability */}
          <SignalSection
            index={1}
            title={t(onboardingSteps[1].title)}
            description={t(onboardingSteps[1].desc)}
            icon={<Briefcase className="w-4 h-4" />}
          >
            <div className="card-in-card space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="label-refined">Marital Profile</label>
                  <SegmentedControl
                    name="maritalStatus"
                    options={["Single", "Married"]}
                    value={form.maritalStatus}
                    onChange={(val) => updateForm("maritalStatus", val)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="education" className="label-refined">Academic Tier</label>
                  <select
                    id="education"
                    className="input-refined appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em] bg-[right_0.75rem_center] bg-no-repeat pr-10 cursor-pointer"
                    value={form.education}
                    onChange={(e) => updateForm("education", e.target.value)}
                  >
                    <option>Undergraduate</option>
                    <option>Postgraduate</option>
                    <option>Doctorate</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="occupation" className="label-refined">Current Occupation</label>
                <input
                  id="occupation"
                  required
                  type="text"
                  placeholder="Software Engineer"
                  className="input-refined"
                  value={form.occupation}
                  onChange={(e) => updateForm("occupation", e.target.value)}
                />
              </div>
            </div>
          </SignalSection>

          {/* Section 3: Digital Footprint */}
          <SignalSection
            index={2}
            title={t(onboardingSteps[2].title)}
            description={t(onboardingSteps[2].desc)}
            icon={<Zap className="w-4 h-4" />}
          >
            <div className="card-in-card space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                  <label className="label-refined">Residential Geo</label>
                  <SegmentedControl
                    name="residence"
                    options={["Urban", "Suburban", "Rural"]}
                    value={form.residence}
                    onChange={(val) => updateForm("residence", val)}
                  />
                </div>

                <CustomSlider
                  label="Duration of Stay"
                  suffix="y"
                  min={0}
                  max={10}
                  step={1}
                  value={[form.yearsAtResidence]}
                  onValueChange={(val) => updateForm("yearsAtResidence", val[0])}
                />
              </div>

              <div className="h-[1px] bg-slate-200/60 dark:bg-slate-800/60 w-full" />

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "hasBankAccount", label: "Active Banking", icon: CreditCard },
                  { id: "hasUtilityBills", label: "Utility Flow", icon: TrendingUp },
                  { id: "upiUsage", label: "UPI Network", icon: Zap }
                ].map((toggle) => (
                  <button
                    key={toggle.id}
                    type="button"
                    onClick={() => updateForm(toggle.id as any, !form[toggle.id as keyof typeof form])}
                    className={cn(
                      "flex items-center justify-between p-3.5 rounded-xl border transition-all text-left",
                      form[toggle.id as keyof typeof form]
                        ? "bg-orange-500/5 border-orange-200 dark:border-orange-900 shadow-sm"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 grayscale-[0.5]"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <toggle.icon className={cn("w-4 h-4", form[toggle.id as keyof typeof form] ? "text-orange-500" : "text-slate-400")} />
                      <span className="text-xs font-bold tracking-tight">{toggle.label}</span>
                    </div>
                    {form[toggle.id as keyof typeof form] && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                    )}
                  </button>
                ))}

                <div className="flex items-center gap-3 p-3 text-slate-400">
                  <Smartphone className="w-4 h-4" />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-tighter">
                      <span>Digital Reach</span>
                      <span className="text-orange-500 mono">{form.smartphoneUsage}h</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="12"
                      className="w-full accent-orange-500 h-1 cursor-pointer"
                      value={form.smartphoneUsage}
                      onChange={(e) => updateForm("smartphoneUsage", parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </SignalSection>

          {/* Section 4: Sovereign Identity */}
          <SignalSection
            index={3}
            title={t("onboarding.sovereign_title")}
            description={t("onboarding.sovereign_desc")}
            icon={<Shield className="w-4 h-4" />}
          >
            <div className="card-in-card space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="aadhaar" className="label-refined">{t("onboarding.aadhaar")}</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    id="aadhaar"
                    required
                    type="text"
                    maxLength={12}
                    placeholder="0000 0000 0000"
                    className="input-refined pl-9 mono"
                    value={form.aadhaar}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                      updateForm("aadhaar", val);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="pan" className="label-refined">{t("onboarding.pan")}</label>
                <div className="relative group">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    id="pan"
                    required
                    type="text"
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    className="input-refined pl-9 mono uppercase"
                    value={form.pan}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase().slice(0, 10);
                      updateForm("pan", val);
                    }}
                  />
                </div>
              </div>
            </div>
          </SignalSection>

          <footer className="pt-8 space-y-6">
            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Lock className="w-4 h-4 text-orange-500 mt-0.5" />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Analysis is performed locally where possible. Sensitive signals are encrypted using AES-256 before being processed by the sovereign credit engine.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full py-7 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xl shadow-2xl shadow-orange-500/30 transition-all flex items-center justify-center gap-3 relative overflow-hidden group",
                  loading && "opacity-80 cursor-not-allowed"
                )}
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="tracking-tighter">SYNTHESIZING...</span>
                  </>
                ) : (
                  <>
                    <span className="tracking-tighter uppercase">Generate Digital Persona</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                {loading && (
                  <motion.div
                    initial={{ left: "-100%" }}
                    animate={{ left: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full"
                  />
                )}
              </Button>
            </motion.div>

            <div className="flex items-center justify-center gap-8 py-4 opacity-40">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                <Shield className="w-3 h-3" /> SOC2
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                <Lock className="w-3 h-3" /> 256-BIT
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3 h-3" /> GDPR
              </div>
            </div>
          </footer>
        </form>
      </main>
    </div>
  )
}

export default Onboarding;
