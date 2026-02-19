import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Cell,
  LineChart, Line, AreaChart, Area
} from "recharts";
import {
  Zap, TrendingUp, AlertTriangle, Shield, Calendar, Info, MapPin,
  Smartphone, Activity, Volume2, VolumeX, HelpCircle, ArrowRight, User, Brain
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import CreditScoreGauge from "@/components/CreditScoreGauge";
import { predict, UserInputs, PredictionResult, getScoreEvolution, getScoreColor } from "@/lib/trustscore";
import { ConsentLayer } from "@/components/ConsentLayer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/components/LanguageContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const initialInputs: UserInputs = {
  monthly_income: 25000,
  income_stability: 0.7,
  savings_ratio: 0.2,
  utility_streak: 12,
  debt_ratio: 0.3,
  psychometric_score: 0.6,
  upi_activity: 40,
  sim_age: 24,
  location: "urban",
  upi_surge: false,
  income_spike: false,
};

function SliderField({
  label, value, onChange, min, max, step, unit, icon: Icon, tooltip
}: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; unit?: string; icon?: any; tooltip?: string;
}) {
  const { t } = useLanguage();
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
            {label}
          </label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full text-muted-foreground/50 hover:text-primary">
                    <HelpCircle className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px] text-xs bg-popover/95 backdrop-blur-sm border-border">
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <span className="text-sm font-semibold text-primary">
          {unit === "₹" ? `₹${value.toLocaleString()}` : unit ? `${value}${unit}` : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-secondary accent-orange-500 transition-all hover:h-2"
      />
    </div>
  );
}

export default function Simulator() {
  const { t, language, speak, isSpeaking, stopSpeaking } = useLanguage();
  const location = useLocation();
  const [hasConsent, setHasConsent] = useState(false);
  const [inputs, setInputs] = useState<UserInputs>(initialInputs);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [evolutionMonths, setEvolutionMonths] = useState(12);
  const [isProfileCreated] = useState(() => localStorage.getItem("onboarding_complete") === "true");
  const [isQuizComplete] = useState(() => localStorage.getItem("behavioral_quiz_complete") === "true");
  const [persistedBehavioralScore] = useState(() => {
    const score = localStorage.getItem("behavioral_score");
    return score ? parseInt(score) : null;
  });

  const update = (key: keyof UserInputs, val: any) =>
    setInputs((prev) => ({ ...prev, [key]: val }));

  const handlePredict = () => {
    // Priority: Location state (newly completed) > Persisted (previous)
    const behavioralOverride = location.state?.behavioralScore || persistedBehavioralScore;

    setResult(predict({
      ...inputs,
      behavioral_score_override: behavioralOverride
    }));
  };

  const evolutionData = useMemo(() => result
    ? getScoreEvolution(result.credit_score, evolutionMonths)
    : [], [result, evolutionMonths]);

  const handleVoiceAssist = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (result) {
      const text = `${t("simulator.results")}: ${result.credit_score}. ${t("simulator.riskFactors")}: ${result.top_risk.map(r => r.label).join(", ")}.`;
      speak(text);
    }
  };

  if (!hasConsent) {
    return (
      <Layout>
        <div className="container py-20 flex justify-center">
          <ConsentLayer onConsent={() => setHasConsent(true)} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl font-bold mb-2"
            >
              Trust<span className="text-primary">Simulator</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-muted-foreground"
            >
              {t("simulator.desc")}
            </motion.p>
            {location.state?.behavioralScore && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3"
              >
                <Badge className="bg-orange-500 text-white border-none py-1.5 px-4 font-bold animate-pulse shadow-lg shadow-orange-500/20">
                  <Brain className="h-3.5 w-3.5 mr-2" /> Behavioral Score Active: {location.state.behavioralScore}
                </Badge>
              </motion.div>
            )}
          </div>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-3">
            <Shield className="h-3.5 w-3.5 mr-1.5" /> {t("common.underbanked")}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="glass-card p-6 space-y-6">
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> {t("tabs.overview")}
                </h3>
                <SliderField label={t("simulator.monthlyIncome")} value={inputs.monthly_income} onChange={(v) => update("monthly_income", v)} min={5000} max={100000} step={1000} unit="₹" tooltip={t("simulator.tooltips.monthlyIncome")} />
                <SliderField label={t("simulator.incomeStability")} value={inputs.income_stability} onChange={(v) => update("income_stability", v)} min={0} max={1} step={0.05} tooltip={t("simulator.tooltips.incomeStability")} />
                <SliderField label={t("simulator.savingsRatio")} value={inputs.savings_ratio} onChange={(v) => update("savings_ratio", v)} min={0} max={0.6} step={0.05} tooltip={t("simulator.tooltips.savingsRatio")} />
                <SliderField label={t("simulator.debtRatio")} value={inputs.debt_ratio} onChange={(v) => update("debt_ratio", v)} min={0} max={0.8} step={0.05} tooltip={t("simulator.tooltips.debtRatio")} />
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4" /> {t("tabs.insights")}
                </h3>
                <SliderField label={t("simulator.utilityStreak")} value={inputs.utility_streak} onChange={(v) => update("utility_streak", v)} min={0} max={24} step={1} unit=" mo" icon={Calendar} tooltip={t("simulator.tooltips.utilityStreak")} />
                <SliderField label={t("simulator.psychometric")} value={inputs.psychometric_score} onChange={(v) => update("psychometric_score", v)} min={0} max={1} step={0.05} icon={Info} tooltip={t("simulator.tooltips.psychometric")} />
                <SliderField label={t("simulator.upiActivity")} value={inputs.upi_activity} onChange={(v) => update("upi_activity", v)} min={0} max={100} step={1} icon={Zap} tooltip={t("simulator.tooltips.upiActivity")} />
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Smartphone className="h-4 w-4" /> {t("simulator.location")} & context
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">{t("simulator.location")}</Label>
                    <select
                      className="w-full bg-secondary text-sm rounded-md px-2 py-1.5 focus:outline-none"
                      value={inputs.location}
                      onChange={(e) => update("location", e.target.value)}
                    >
                      <option value="urban">{t("simulator.urban")}</option>
                      <option value="rural">{t("simulator.rural")}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">{t("simulator.simAge")}</Label>
                    <input
                      type="number"
                      className="w-full bg-secondary text-sm rounded-md px-2 py-1 focus:outline-none"
                      value={inputs.sim_age}
                      onChange={(e) => update("sim_age", Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-xs">{t("simulator.upiSurge")}</Label>
                  <Switch checked={inputs.upi_surge} onCheckedChange={(v) => update("upi_surge", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">{t("simulator.incomeSpike")}</Label>
                  <Switch checked={inputs.income_spike} onCheckedChange={(v) => update("income_spike", v)} />
                </div>
              </div>

              <Button
                onClick={handlePredict}
                className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20"
              >
                <Zap className="h-4 w-4" /> {t("simulator.improveScore").toUpperCase()}
              </Button>
            </div>
          </motion.div>

          {/* Visualization Panel */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Main Score */}
                    <div className="glass-card p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 flex flex-col items-end gap-2">
                        <div className="text-right">
                          <div className="text-[10px] uppercase font-bold text-muted-foreground">{t("simulator.confidence")}</div>
                          <div className="text-lg font-mono font-bold text-primary">{(result.confidence_score * 100).toFixed(0)}%</div>
                        </div>
                        <Button
                          variant="secondary"
                          size="icon"
                          className={`rounded-full h-10 w-10 ${isSpeaking ? 'bg-primary text-primary-foreground' : ''}`}
                          onClick={handleVoiceAssist}
                        >
                          {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                      </div>
                      <CreditScoreGauge score={result.credit_score} />
                      <div className="mt-4 flex flex-col items-center">
                        <div className="text-sm font-medium text-muted-foreground mb-1">Risk Category</div>
                        <Badge className="text-lg px-4 py-0" style={{ backgroundColor: getScoreColor(result.credit_score) }}>
                          {result.risk_category.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Risk & Fraud */}
                    <div className="space-y-4">
                      <div className="glass-card p-6 border-l-4 border-l-primary">
                        <h4 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-widest">{t("tabs.fraud")}</h4>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-2xl font-bold font-mono">{(result.fraud_score * 100).toFixed(0)}%</div>
                            <div className="text-xs text-muted-foreground">{t("simulator.fraudRisk")}</div>
                          </div>
                          <div className={`p-2 rounded-lg ${result.fraud_score > 0.5 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                            {result.fraud_score > 0.5 ? <AlertTriangle className="h-6 w-6" /> : <Shield className="h-6 w-6" />}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground p-2 bg-secondary/30 rounded border border-border">
                          {result.fraud_score > 0.5 ? t("simulator.manualReview") : "Recommendation: Auto-Approve"}
                        </div>
                      </div>

                      <div className="glass-card p-6">
                        <h4 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-widest">Explainability</h4>
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-tighter">{t("simulator.positiveFactors")}</p>
                          {result.top_positive.slice(0, 2).map(f => (
                            <div key={f.label} className="flex items-center gap-2 text-xs">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              <span className="text-muted-foreground">{f.label}:</span>
                              <span className="font-bold text-green-500">+{f.contribution.toFixed(1)}</span>
                            </div>
                          ))}
                          <Separator className="my-2 bg-border/30" />
                          <p className="text-[10px] font-bold text-red-500 mb-1 uppercase tracking-tighter">{t("simulator.riskFactors")}</p>
                          {result.top_risk.slice(0, 2).map(f => (
                            <div key={f.label} className="flex items-center gap-2 text-xs">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                              <span className="text-muted-foreground">{f.label}:</span>
                              <span className="font-bold text-red-500">-{f.contribution.toFixed(1)}</span>
                            </div>
                          ))}
                        </div>
                        <Link to="/loan-marketplace" state={{ score: result.credit_score, income: inputs.monthly_income }}>
                          <Button
                            className="w-full mt-4 font-bold gap-2"
                            size="lg"
                          >
                            {t("marketplace.cta")} <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Evolution Chart */}
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-display font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" /> {t("simulator.scoreEvolution")}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{t("simulator.months")}: {evolutionMonths}</span>
                        <input
                          type="range" min={6} max={24} step={6} value={evolutionMonths}
                          onChange={(e) => setEvolutionMonths(Number(e.target.value))}
                          className="w-20 h-1 accent-primary"
                        />
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart data={evolutionData}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(228,12%,16%)" vertical={false} />
                        <XAxis dataKey="month" tick={{ fill: "hsl(215,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[300, 900]} tick={{ fill: "hsl(215,15%,55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <RechartsTooltip
                          contentStyle={{
                            background: "hsl(228,14%,10%)",
                            border: "1px solid hsl(228,12%,16%)",
                            borderRadius: 8,
                            fontSize: 12
                          }}
                        />
                        <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-[10px] text-muted-foreground leading-relaxed text-center">
                        {language === "hi" ? t("simulator.examples.kirana") : language === "kn" ? t("simulator.examples.gig") : t("hero.desc")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12"
                >
                  <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
                    <Zap className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3">Engine Ready</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                    {t("simulator.desc")}
                  </p>
                  <div className="mt-8 flex gap-4 opacity-50">
                    <Badge variant="outline">#Inclusion</Badge>
                    <Badge variant="outline">#Accessibility</Badge>
                    <Badge variant="outline">#IndiaNext</Badge>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}
