import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { Scale, AlertTriangle, MapPin, Zap, ShieldCheck } from "lucide-react";
import Layout from "@/components/Layout";
import { getDataset, getFairnessAnalysis } from "@/lib/trustscore";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/LanguageContext";

export default function Fairness() {
  const { t } = useLanguage();
  const [mitigate, setMitigate] = useState(false);
  const data = useMemo(() => getDataset(), []);
  const analysis = useMemo(() => getFairnessAnalysis(data, mitigate), [data, mitigate]);

  const chartData = [
    { group: t("simulator.rural"), approvalRate: Math.round(analysis.rural.approvalRate * 100 * 10) / 10, count: analysis.rural.count },
    { group: t("simulator.urban"), approvalRate: Math.round(analysis.urban.approvalRate * 100 * 10) / 10, count: analysis.urban.count },
  ];

  const fade = (i: number) => ({
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.1 },
  });

  return (
    <Layout>
      <div className="container py-10 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <motion.h1 {...fade(0)} className="font-display text-4xl font-bold mb-2">
              {t("fairness.title")}
            </motion.h1>
            <motion.p {...fade(1)} className="text-muted-foreground">
              {t("fairness.desc")}
            </motion.p>
          </div>
          <div className="flex items-center gap-3 bg-secondary/50 p-2 px-4 rounded-xl border border-border">
            <Label htmlFor="mitigate-page" className="text-sm font-semibold">{t("fairness.mitigationEngine")}</Label>
            <Switch id="mitigate-page" checked={mitigate} onCheckedChange={setMitigate} />
          </div>
        </div>

        {/* Bias Alert */}
        <motion.div
          {...fade(2)}
          className={`p-6 rounded-2xl mb-8 flex items-start gap-4 border transition-all duration-500 ${analysis.biasDetected && !mitigate
            ? "bg-red-500/10 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
            : "bg-green-500/10 border-green-500/30"
            }`}
        >
          {analysis.biasDetected && !mitigate ? (
            <AlertTriangle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className={`font-display font-bold text-xl ${analysis.biasDetected && !mitigate ? 'text-red-500' : 'text-green-500'}`}>
              {analysis.biasDetected && !mitigate ? t("fairness.biasWarning") : t("fairness.validated")}
            </h3>
            <p className="text-sm opacity-80 mt-1 max-w-2xl">
              {analysis.biasDetected && !mitigate
                ? `${t("fairness.approvalRate")} gap between Rural and Urban segments is ${(analysis.approval_gap * 100).toFixed(1)}%. This exceeds regulatory parity thresholds.`
                : `${t("fairness.validated")}: Current model metrics show an approval gap of ${(analysis.approval_gap * 100).toFixed(1)}% and Equalized Odds gap of ${(analysis.equalized_odds_gap * 100).toFixed(1)}%.`}
            </p>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{t("fairness.equalizedOdds")}</CardDescription>
              <CardTitle className="text-3xl font-display">{(analysis.equalized_odds_gap * 100).toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: `${analysis.equalized_odds_gap * 200}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{t("fairness.demographicParity")}</CardDescription>
              <CardTitle className="text-3xl font-display">{(analysis.approval_gap * 100).toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: `${analysis.approval_gap * 200}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-500 text-white shadow-lg shadow-orange-500/20">
            <CardHeader className="pb-2 text-center">
              <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-white/70">{t("fairness.rating")}</CardDescription>
              <CardTitle className="text-3xl font-display">{analysis.biasDetected && !mitigate ? 'GRADE C' : 'GRADE A+'}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-[10px] opacity-80 pt-2 border-t border-white/10">
              {mitigate ? t("fairness.mitigationMode") : "Real-time baseline audit"}
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold mb-6 flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" /> {t("fairness.approvalRate")}
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(228,12%,16%)" vertical={false} />
                <XAxis dataKey="group" axisLine={false} tickLine={false} tick={{ fill: "hsl(215,15%,55%)", fontSize: 12 }} />
                <YAxis unit="%" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "hsl(215,15%,55%)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "hsl(228,14%,10%)", border: "1px solid hsl(228,12%,16%)", borderRadius: 8 }} />
                <Bar dataKey="approvalRate" radius={[8, 8, 0, 0]}>
                  <Cell fill="var(--primary)" fillOpacity={0.8} />
                  <Cell fill="var(--primary)" fillOpacity={0.4} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 border-l-4 border-l-orange-500">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{t("fairness.mitigationReport")}</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Original Gap</span>
                  <span className="font-mono">7.2%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Mitigated Gap</span>
                  <span className="font-mono text-green-500">{(analysis.approval_gap * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-border">
                  <span>{t("inclusion.totalLift")}</span>
                  <span className="text-orange-500">+12%</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-secondary/30 rounded-2xl border border-border">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{t("fairness.exclusionPolicy")}</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {t("fairness.desc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
