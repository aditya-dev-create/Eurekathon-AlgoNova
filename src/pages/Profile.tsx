import React, { useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, User2, CheckSquare, MapPin, Calendar, Phone, Mail, Zap, Loader2 } from "lucide-react";

// Small design tokens (will rely on CSS variables set in index.css)

type FormState = {
  fullName: string;
  age: number | "";
  gender: "male" | "female" | "nb" | "private" | "";
  email: string;
  phone: string;
  marital: string;
  education: string;
  occupation: string;
  employmentType: string;
  workStability: string;
  residence: string;
  yearsAtResidence: number;
  bankAccount: boolean;
  utilityBills: boolean;
  smartphoneUsage: number;
  upiUsage: boolean;
};

const initial: FormState = {
  fullName: "",
  age: "",
  gender: "",
  email: "",
  phone: "",
  marital: "",
  education: "",
  occupation: "",
  employmentType: "",
  workStability: "",
  residence: "",
  yearsAtResidence: 2,
  bankAccount: false,
  utilityBills: false,
  smartphoneUsage: 0,
  upiUsage: false,
};

export default function Profile() {
  const [state, setState] = useState<FormState>(initial);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setState((s) => ({ ...s, [k]: v }));
  };

  // Refs and pill positions for animated segmented controls
  const genderRef = useRef<HTMLDivElement | null>(null);
  const workRef = useRef<HTMLDivElement | null>(null);
  const [genderPill, setGenderPill] = useState<{ left: number; width: number } | null>(null);
  const [workPill, setWorkPill] = useState<{ left: number; width: number } | null>(null);

  const measurePill = (container: HTMLDivElement | null, selectorAttr: string) => {
    if (!container) return null;
    const selected = container.querySelector('[aria-selected="true"]') as HTMLElement | null;
    if (!selected) return null;
    const cRect = container.getBoundingClientRect();
    const sRect = selected.getBoundingClientRect();
    return { left: sRect.left - cRect.left, width: sRect.width };
  };

  useLayoutEffect(() => {
    // measure on mount and whenever selection changes
    setGenderPill(measurePill(genderRef.current, 'gender'));
    setWorkPill(measurePill(workRef.current, 'work'));

    const onResize = () => {
      setGenderPill(measurePill(genderRef.current, 'gender'));
      setWorkPill(measurePill(workRef.current, 'work'));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [state.gender, state.workStability]);

  // Accessible keyboard navigation for segmented controls
  const navigateSegment = (container: HTMLDivElement | null, direction: 'left' | 'right' | 'home' | 'end') => {
    if (!container) return;
    const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>('button'));
    if (!buttons.length) return;
    const current = buttons.findIndex((b) => b.getAttribute('aria-selected') === 'true');
    let next = current;
    if (direction === 'left') next = current > 0 ? current - 1 : buttons.length - 1;
    if (direction === 'right') next = current < buttons.length - 1 ? current + 1 : 0;
    if (direction === 'home') next = 0;
    if (direction === 'end') next = buttons.length - 1;
    const target = buttons[next];
    if (target) {
      // update tabIndex for roving pattern: make only target tabbable
      buttons.forEach((b, i) => b.setAttribute('tabindex', i === next ? '0' : '-1'));
      // move focus and update state selection
      target.focus();
      const parent = container.getAttribute('aria-label') || '';
      if (parent.toLowerCase().includes('gender')) {
        update('gender', (target.textContent || '').toLowerCase() as any);
      } else if (parent.toLowerCase().includes('work')) {
        update('workStability', target.textContent as any);
      }
    }
  };

  const onSegmentKeyDown = (e: React.KeyboardEvent, containerRef: React.RefObject<HTMLDivElement>) => {
    const key = e.key;
    if (key === 'ArrowLeft') {
      e.preventDefault();
      navigateSegment(containerRef.current, 'left');
    } else if (key === 'ArrowRight') {
      e.preventDefault();
      navigateSegment(containerRef.current, 'right');
    } else if (key === 'Home') {
      e.preventDefault();
      navigateSegment(containerRef.current, 'home');
    } else if (key === 'End') {
      e.preventDefault();
      navigateSegment(containerRef.current, 'end');
    }
  };

  const sections = ["Identity", "Stability", "Alt Credit"];

  const stagger = {
    hidden: { opacity: 0, y: 12 },
    show: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        type: "spring",
        stiffness: 300,
        damping: 28,
      },
    }),
  };

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-start justify-center py-16">
      <header className="fixed top-6 left-0 right-0 pointer-events-none">
        <div className="container">
          <div className="glass-card flex items-center justify-between py-3 px-4" style={{ backdropFilter: "blur(8px)" }}>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-[color:var(--primary)]/10 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-[color:var(--primary)]" />
              </div>
              <div className="text-sm font-semibold">Fin Saarthi — Profile</div>
            </div>
            <div className="text-xs text-muted-foreground">Secure · Private · Explainable</div>
          </div>
        </div>
      </header>

      <motion.main
        className="container max-w-xl pt-28"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <form onSubmit={onSubmit} aria-label="Fin Saarthi onboarding form" className="space-y-6">
          <motion.div layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 22 }}>
            <div className="text-sm text-muted-foreground">Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},</div>
            <motion.h1 className="text-2xl font-bold truncate" layout>
              <AnimatePresence mode="wait">
                <motion.span key={state.fullName ? state.fullName.split(" ")[0] : "anon"} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.22 }}>
                  {state.fullName ? `Hey ${state.fullName.split(" ")[0]}, let's get you a Fin Saarthi Score` : "Get your Fin Saarthi Score"}
                </motion.span>
              </AnimatePresence>
            </motion.h1>
            <motion.p className="text-sm text-muted-foreground" layout>
              A short profile helps us analyze non-traditional indicators quickly and privately.
            </motion.p>
          </motion.div>

          {/* Sectioned form - 3 cards with subtle separators */}
          <motion.section className="glass-card p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} layout>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, type: "spring", stiffness: 300, damping: 28 }} className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold">1 — Identity</div>
                <div className="text-xs text-muted-foreground">Basic identity details</div>
              </div>
              <User2 className="h-5 w-5 text-[color:var(--primary)]" />
            </motion.div>

            <div className="grid grid-cols-1 gap-3">
              <label className="flex flex-col text-sm">
                <span className="mb-1 font-medium">Full name</span>
                <input
                  required
                  aria-required
                  value={state.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  className="px-3 py-2 rounded-md input-refined"
                  placeholder="Alex Taylor"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col text-sm">
                  <span className="mb-1 font-medium">Age</span>
                  <input
                    required
                    aria-required
                    type="number"
                    min={18}
                    max={120}
                    value={state.age as number | ""}
                    onChange={(e) => update("age", e.target.value === "" ? "" : Number(e.target.value))}
                    className="px-3 py-2 rounded-md input-refined"
                  />
                </label>

                <label className="flex flex-col text-sm">
                  <span className="mb-1 font-medium">Email</span>
                  <input
                    required
                    aria-required
                    type="email"
                    value={state.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="px-3 py-2 rounded-md input-refined"
                    placeholder="you@company.com"
                  />
                </label>
              </div>

              <label className="flex flex-col text-sm">
                <span className="mb-2 font-medium">Phone</span>
                <div className="flex gap-2">
                  <input
                    required
                    aria-required
                    type="tel"
                    value={state.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-md input-refined"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </label>

              {/* Segmented control for gender */}
              <div className="text-sm">
                <div className="mb-2 font-medium">Gender</div>
                <div role="tablist" aria-label="Gender" className="segmented" ref={genderRef as any}>
                  <AnimatePresence>
                    {genderPill && state.gender && (
                      <motion.div className="segmented-pill" layoutId="gender-pill"
                        initial={false}
                        animate={{ left: genderPill.left, width: genderPill.width }}
                        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                        style={{ position: 'absolute' }}
                      />
                    )}
                  </AnimatePresence>
                  {[
                    ["male", "Male"],
                    ["female", "Female"],
                    ["nb", "NB"],
                    ["private", "Private"],
                  ].map(([val, label], idx) => {
                    const selected = state.gender === val;
                    return (
                      <button
                        key={String(val)}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-controls={`gender-${val}`}
                        onClick={() => update("gender", val as any)}
                        onKeyDown={(e) => onSegmentKeyDown(e, genderRef as any)}
                        tabIndex={selected ? 0 : -1}
                        className={`segmented-btn ${selected ? "text-white" : "text-foreground/70"}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section className="glass-card p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.06 }} layout>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, type: "spring", stiffness: 300, damping: 28 }} className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold">2 — Stability Signals</div>
                <div className="text-xs text-muted-foreground">Employment & background</div>
              </div>
              <CheckSquare className="h-5 w-5 text-[color:var(--primary)]" />
            </motion.div>

            <div className="grid grid-cols-1 gap-3">
              <label className="flex flex-col text-sm">
                <span className="mb-1 font-medium">Marital status</span>
                <select
                  value={state.marital}
                  onChange={(e) => update("marital", e.target.value)}
                  className="px-3 py-2 rounded-md border border-[color:var(--border)] bg-white"
                >
                  <option value="">Prefer not to say</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Divorced</option>
                  <option>Widowed</option>
                </select>
              </label>

              <label className="flex flex-col text-sm">
                <span className="mb-1 font-medium">Education</span>
                <select
                  value={state.education}
                  onChange={(e) => update("education", e.target.value)}
                  className="px-3 py-2 rounded-md border border-[color:var(--border)] bg-white"
                >
                  <option value="">Select</option>
                  <option>High School</option>
                  <option>Diploma</option>
                  <option>Bachelor</option>
                  <option>Postgraduate</option>
                </select>
              </label>

              <label className="flex flex-col text-sm">
                <span className="mb-1 font-medium">Occupation</span>
                <input value={state.occupation} onChange={(e) => update("occupation", e.target.value)} placeholder="E.g. Teacher" className="px-3 py-2 rounded-md border border-[color:var(--border)]" />
              </label>

              <div className="text-sm">
                <div className="mb-2 font-medium">Work stability</div>
                <div role="tablist" aria-label="Work stability" className="segmented" ref={workRef as any}>
                  <AnimatePresence>
                    {workPill && state.workStability && (
                      <motion.div className="segmented-pill" layoutId="work-pill"
                        initial={false}
                        animate={{ left: workPill.left, width: workPill.width }}
                        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                        style={{ position: 'absolute' }}
                      />
                    )}
                  </AnimatePresence>
                  {[
                    ["Stable", "Stable"],
                    ["Variable", "Variable"],
                    ["Contract", "Contract"],
                    ["NA", "NA"],
                  ].map(([val, label], idx) => {
                    const selected = state.workStability === val;
                    return (
                      <button
                        key={String(val)}
                        type="button"
                        aria-selected={selected}
                        onClick={() => update("workStability", val as any)}
                        onKeyDown={(e) => onSegmentKeyDown(e, workRef as any)}
                        tabIndex={selected ? 0 : -1}
                        className={`segmented-btn ${selected ? "text-white" : "text-foreground/70"}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <div className="text-xs text-muted-foreground mt-2">This helps the model understand income predictability and predictability of repayments.</div>
              </div>
            </div>
          </motion.section>

          <motion.section className="glass-card p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.12 }} layout>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, type: "spring", stiffness: 300, damping: 28 }} className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold">3 — Alternative Credit Signals</div>
                <div className="text-xs text-muted-foreground">Behavioral & utility signals</div>
              </div>
              <MapPin className="h-5 w-5 text-[color:var(--primary)]" />
            </motion.div>

            <div className="grid grid-cols-1 gap-3">
              <label className="flex flex-col text-sm">
                <span className="mb-1 font-medium">Residence type</span>
                <div className="inline-flex gap-2">
                  {[
                    ["Urban", "Urban"],
                    ["Rural", "Rural"],
                  ].map(([val, label]) => {
                    const sel = state.residence === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => update("residence", val as any)}
                        className={`px-3 py-1 rounded-md ${sel ? "bg-[color:var(--primary)] text-white" : "bg-[color:var(--input)] text-foreground/70"}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </label>

              <div className="text-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">Years at residence</div>
                  <div className="text-xs text-muted-foreground">{state.yearsAtResidence} yrs</div>
                </div>
                <input
                  aria-label="Years at residence"
                  type="range"
                  min={0}
                  max={10}
                  value={state.yearsAtResidence}
                  onChange={(e) => update("yearsAtResidence", Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-3 text-sm">
                  <input type="checkbox" checked={state.bankAccount} onChange={(e) => update("bankAccount", e.target.checked)} />
                  <div>
                    <div className="font-medium">Bank account</div>
                    <div className="text-xs text-muted-foreground">Linked</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 text-sm">
                  <input type="checkbox" checked={state.utilityBills} onChange={(e) => update("utilityBills", e.target.checked)} />
                  <div>
                    <div className="font-medium">Utility bills</div>
                    <div className="text-xs text-muted-foreground">Consistent payments</div>
                  </div>
                </label>
              </div>

              <label className="flex flex-col text-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">Smartphone usage (monthly mins)</div>
                  <div className="text-xs text-muted-foreground">{state.smartphoneUsage}</div>
                </div>
                <input
                  aria-label="Smartphone usage"
                  type="number"
                  value={state.smartphoneUsage}
                  onChange={(e) => update("smartphoneUsage", Number(e.target.value))}
                  className="px-3 py-2 rounded-md input-refined mono"
                />
              </label>

              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" checked={state.upiUsage} onChange={(e) => update("upiUsage", e.target.checked)} />
                <div>
                  <div className="font-medium">UPI usage</div>
                  <div className="text-xs text-muted-foreground">Transaction history available</div>
                </div>
              </label>
            </div>
          </motion.section>

          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">By submitting you consent to a device-based signal analysis.</div>
            <motion.button
              layout
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-md bg-[color:var(--primary)] text-white font-semibold shadow-[var(--shadow-subtle)]"
              whileHover={{ scale: 1.03, boxShadow: '0 10px 40px rgba(79,70,229,0.12)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" /> Analyze signals
                </>
              )}
            </motion.button>
          </div>

          {submitted && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-md bg-[color:var(--success)]/10 text-[color:var(--success)]">
              Analysis complete — provisional Fin Saarthi Score generated.
            </motion.div>
          )}
        </form>
      </motion.main>
    </div>
  );
}
