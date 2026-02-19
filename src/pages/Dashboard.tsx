import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from "recharts";
import {
  Database, TrendingDown, Award, Activity, Scale, ShieldAlert,
  Users, Globe, Code, ArrowUpRight, Zap, Target, Lock
} from "lucide-react";
import Layout from "@/components/Layout";
import {
  getDataset, computeROCAUC, getDatasetStats, getScoreDistribution,
  getFeatureImportance, DataRow,
  getFairnessAnalysis, getInclusionLift, getModelValidation
} from "@/lib/trustscore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/components/LanguageContext";

const scoreBarColors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981", "#059669"];

export default function Dashboard() {
  const { t } = useLanguage();
  const [mitigate, setMitigate] = useState(false);
  const data = useMemo(() => getDataset(), []);
  const stats = useMemo(() => getDatasetStats(data), [data]);
  const scoreDist = useMemo(() => getScoreDistribution(data), [data]);
  const importance = useMemo(() => getFeatureImportance(), []);
  const fairness = useMemo(() => getFairnessAnalysis(data, mitigate), [data, mitigate]);
  const inclusion = useMemo(() => getInclusionLift(data), [data]);
  const validation = useMemo(() => getModelValidation(data), [data]);

  const fade = (i: number) => ({ initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 } });

  return (
    <Layout>
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <motion.h1 {...fade(0)} className="font-display text-4xl font-bold mb-2">
              TrustMetrics <span className="text-primary">Engine</span>
            </motion.h1>
            <motion.p {...fade(1)} className="text-muted-foreground">
              {t("hero.desc")}
            </motion.p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="px-3 py-1">V1.2.0-ELITE</Badge>
            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 px-3 py-1">LIVE DATA SIM</Badge>
            <Link to="/loan-marketplace">
              <Button size="sm" className="gap-2">
                {t("marketplace.cta")} <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-secondary/50 p-1 rounded-xl h-auto flex flex-wrap gap-1">
            <TabsTrigger value="overview" className="rounded-lg py-2">{t("tabs.overview")}</TabsTrigger>
            <TabsTrigger value="insights" className="rounded-lg py-2">{t("tabs.insights")}</TabsTrigger>
            <TabsTrigger value="fairness" className="rounded-lg py-2">{t("tabs.fairness")}</TabsTrigger>
            <TabsTrigger value="inclusion" className="rounded-lg py-2">{t("tabs.inclusion")}</TabsTrigger>
            <TabsTrigger value="fraud" className="rounded-lg py-2">{t("tabs.fraud")}</TabsTrigger>
            <TabsTrigger value="impact" className="rounded-lg py-2">{t("tabs.impact")}</TabsTrigger>
            <TabsTrigger value="api" className="rounded-lg py-2">{t("tabs.api")}</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-8 outline-none">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Database, label: t("dashboard.totalPopulation"), value: stats.count.toLocaleString(), color: "text-primary" },
                { icon: TrendingDown, label: t("dashboard.systemDefaultRate"), value: `${(stats.defaultRate * 100).toFixed(1)}%`, color: "text-red-500" },
                { icon: Award, label: t("dashboard.meanCreditScore"), value: stats.avgScore.toString(), color: "text-green-500" },
                { icon: Activity, label: t("inclusion.totalLift"), value: `+${(inclusion.lift * 100).toFixed(1)}%`, color: "text-primary" },
              ].map((s, i) => (
                <Card key={s.label} className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="p-5 pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <s.icon className={`h-4 w-4 ${s.color}`} /> {s.label}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <div className="text-3xl font-bold font-display">{s.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-display">{t("dashboard.creditScoreDist")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={scoreDist}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(228,12%,16%)" vertical={false} />
                      <XAxis dataKey="range" tick={{ fill: "hsl(215,15%,55%)", fontSize: 12 }} axisLine={false} />
                      <YAxis tick={{ fill: "hsl(215,15%,55%)", fontSize: 12 }} axisLine={false} />
                      <Tooltip contentStyle={{ background: "hsl(228,14%,10%)", border: "1px solid hsl(228,12%,16%)", borderRadius: 8 }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {scoreDist.map((_, i) => <Cell key={i} fill={scoreBarColors[i]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-display">{t("dashboard.featureImportance")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={importance} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(228,12%,16%)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "hsl(215,15%,55%)", fontSize: 12 }} axisLine={false} />
                      <YAxis dataKey="feature" type="category" width={130} tick={{ fill: "hsl(215,15%,55%)", fontSize: 11 }} axisLine={false} />
                      <Tooltip contentStyle={{ background: "hsl(228,14%,10%)", border: "1px solid hsl(228,12%,16%)", borderRadius: 8 }} />
                      <Bar dataKey="importance" fill="hsl(160,84%,39%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* MODEL INSIGHTS TAB */}
          <TabsContent value="insights" className="space-y-6 outline-none">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" /> {t("dashboard.modelCalibration")}
                  </CardTitle>
                  <CardDescription>{t("dashboard.predictedVsActual")}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground italic text-sm text-center px-12">
                    {t("dashboard.brierReliability")}
                  </p>
                </CardContent>
              </Card>
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Mean 5-Fold ROC-AUC</CardDescription>
                    <CardTitle className="text-3xl">{validation.mean_cv.toFixed(3)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full" style={{ width: `${validation.mean_cv * 100}%` }} />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Brier Score (Calibration)</CardDescription>
                    <CardTitle className="text-3xl">{validation.brier}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={validation.is_calibrated ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}>
                      {validation.is_calibrated ? t("dashboard.wellCalibrated") : t("dashboard.requiresRecalibration")}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* FAIRNESS TAB */}
          <TabsContent value="fairness" className="space-y-6 outline-none">
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20 mb-6">
              <div className="flex items-center gap-3">
                <Scale className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-bold">{t("fairness.mitigationEngine")}</h3>
                  <p className="text-xs text-muted-foreground">{t("fairness.desc")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="mitigate" className="text-sm font-medium">{t("fairness.mitigationMode")}</Label>
                <Switch id="mitigate" checked={mitigate} onCheckedChange={setMitigate} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("fairness.approvalRate")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span>{t("simulator.rural")}</span><span>{(fairness.rural.approvalRate * 100).toFixed(1)}%</span></div>
                      <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                        <div className="bg-primary h-full transition-all duration-500" style={{ width: `${fairness.rural.approvalRate * 100}%` }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span>{t("simulator.urban")}</span><span>{(fairness.urban.approvalRate * 100).toFixed(1)}%</span></div>
                      <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                        <div className="bg-primary/60 h-full transition-all duration-500" style={{ width: `${fairness.urban.approvalRate * 100}%` }} />
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-medium">{t("fairness.equalizedOdds")}</span>
                      <Badge variant={fairness.equalized_odds_gap > 0.05 ? "destructive" : "secondary"}>
                        {(fairness.equalized_odds_gap * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {fairness.biasDetected && !mitigate ? (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3">
                    <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-red-500">{t("fairness.biasWarning")}</p>
                      <p className="text-xs text-red-500/80 leading-snug">
                        {t("fairness.mitigationReport")}
                      </p>
                    </div>
                  </div>
                ) : mitigate ? (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex gap-3">
                    <Award className="h-5 w-5 text-green-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-green-500">{t("fairness.validated")}</p>
                      <p className="text-xs text-green-500/80 leading-snug">
                        {t("fairness.mitigationMode")} active.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex gap-3">
                    <ShieldAlert className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-primary">{t("fairness.validated")}</p>
                      <p className="text-xs text-muted-foreground leading-snug">
                        {t("fairness.equalizedOdds")} is within bounds.
                      </p>
                    </div>
                  </div>
                )}
                <Card>
                  <CardHeader className="p-4 pt-4">
                    <CardTitle className="text-sm">{t("dashboard.protectedStatus")}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    {['Gender', 'Religion', 'Caste', 'Age'].map(attr => (
                      <div key={attr} className="flex justify-between text-xs items-center py-1 border-b border-border last:border-0">
                        <span>{attr}</span>
                        <Badge variant="outline" className="text-[10px] h-5 bg-green-500/5 text-green-500 border-green-500/20">{t("dashboard.excluded")}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* INCLUSION TAB */}
          <TabsContent value="inclusion" className="space-y-6 outline-none">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("inclusion.title")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-2 gap-8 text-center">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground uppercase font-bold">{t("inclusion.traditional")}</div>
                      <div className="text-4xl font-display font-bold">{(inclusion.traditional_rate * 100).toFixed(0)}%</div>
                      <div className="text-xs text-muted-foreground">Approval Rate</div>
                    </div>
                    <div className="space-y-1 border-l border-border">
                      <div className="text-xs text-primary uppercase font-bold">{t("inclusion.trustscore")}</div>
                      <div className="text-4xl font-display font-bold text-primary">{(inclusion.alternative_rate * 100).toFixed(0)}%</div>
                      <div className="text-xs text-primary/80">Approval Rate</div>
                    </div>
                  </div>

                  <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl text-center">
                    <div className="text-sm font-medium text-muted-foreground mb-1">{t("inclusion.totalLift")}</div>
                    <div className="text-5xl font-display font-black text-primary">+{(inclusion.lift * 100).toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
                      {t("inclusion.additionalPeople")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">{t("inclusion.ruralBreakout")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Rural Lift</span>
                      <span className="font-bold text-green-500">+{(inclusion.rural_inclusion_lift * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${inclusion.rural_inclusion_lift * 200}%` }} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                      <ArrowUpRight className="h-3 w-3" /> {t("inclusion.growthOpportunity")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{(stats.count * inclusion.lift * 1.5).toFixed(1)} Cr</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* FRAUD TAB */}
          <TabsContent value="fraud" className="space-y-6 outline-none">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t("fraudTab.upiAnomalies")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">4.2%</div>
                  <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full" style={{ width: '4.2%' }} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t("fraudTab.simAgingRisk")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">12.8%</div>
                  <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="bg-yellow-500 h-full" style={{ width: '12.8%' }} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t("fraudTab.incomeMismatch")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">1.5%</div>
                  <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: '1.5%' }} />
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>{t("fraudTab.fraudSignalDist")}</CardTitle>
              </CardHeader>
              <CardContent className="h-[260px] flex items-center justify-center border-t border-border mt-4">
                <div className="text-center space-y-2 opacity-50">
                  <ShieldAlert className="h-12 w-12 mx-auto text-primary" />
                  <p className="text-sm">{t("fraudTab.predictiveSignal")}: SIM Age &lt; 3 Months.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* IMPACT TAB */}
          <TabsContent value="impact" className="space-y-6 outline-none">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-display font-bold">{t("impactTab.socioEconomicImpact")}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t("impactTab.socioEconomicDesc")}
                </p>
                <div className="space-y-4">
                  {[
                    { label: t("impactTab.newCreditAccess"), value: "21,420 people", icon: Users },
                    { label: t("impactTab.lowerInterest"), value: "₹4.5k avg/yr", icon: TrendingDown },
                    { label: t("impactTab.regionFocus"), value: "65% Rural Lift", icon: Globe },
                  ].map(item => (
                    <div key={item.label} className="flex gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-bold uppercase tracking-tight">{item.label}</div>
                        <div className="text-lg font-bold">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="bg-primary/5 border-primary/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <TrendingDown className="h-32 w-32 text-primary" />
                </div>
                <CardHeader>
                  <CardTitle>{t("impactTab.potentialScale")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 relative z-10">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">{t("impactTab.additionalApprovals")}</div>
                    <div className="text-6xl font-display font-black text-primary">+210k</div>
                  </div>
                  <Separator className="bg-primary/20" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground font-bold">{t("impactTab.gdpContribution")}</div>
                      <div className="text-lg font-bold">₹820 Cr</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground font-bold">{t("impactTab.householdImpact")}</div>
                      <div className="text-lg font-bold">840k Lives</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API TAB */}
          <TabsContent value="api" className="space-y-6 outline-none">
            <Card className="bg-zinc-950 border-zinc-800">
              <CardHeader className="border-b border-zinc-800">
                <CardTitle className="text-sm font-mono flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" /> POST /api/v1/score
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 font-mono text-xs text-zinc-400 overflow-x-auto">
                  <pre>{`{
  "request_id": "ts_78239401",
  "data": {
    "credit_score": 742,
    "risk_category": "LOW",
    "fraud_risk": 0.12,
    "confidence": 0.94
  },
  "explanation": {
    "positive_signals": ["utility_streak_98th_percentile", "strong_micro_savings"],
    "risk_signals": ["high_income_volatility"]
  },
  "fairness_audit": {
    "status": "APPROVED",
    "demographic_unbiased": true
  },
  "recommendation": "AUTO_APPROVE"
}`}</pre>
                </div>
              </CardContent>
              <div className="p-3 bg-zinc-900/50 flex justify-between items-center text-[10px] text-zinc-500">
                <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> {t("apiTab.endpoint")}</span>
                <span>{t("apiTab.latency")}: 42ms</span>
              </div>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "NBFCs", desc: t("apiTab.nbfcsDesc") },
                { title: "BNPL", desc: t("apiTab.bnplDesc") },
                { title: "Rural Banks", desc: t("apiTab.ruralBanksDesc") }
              ].map(item => (
                <div key={item.title} className="p-4 rounded-xl border border-border bg-card/50">
                  <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
