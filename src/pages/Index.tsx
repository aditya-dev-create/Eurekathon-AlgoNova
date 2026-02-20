import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Shield, Users, ArrowRight, Zap, Eye, Scale, Target, Globe, Lock } from "lucide-react";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/LanguageContext";

export default function Index() {
  const { t } = useLanguage();

  const features = [
    {
      icon: BarChart3,
      title: t("common.analyzeEngine"),
      desc: t("hero.desc"),
      link: "/dashboard",
    },
    {
      icon: Zap,
      title: t("simulator.title"),
      desc: t("simulator.desc"),
      link: "/simulator",
    },
    {
      icon: Scale,
      title: t("fairness.title"),
      desc: t("fairness.desc"),
      link: "/fairness",
    },
  ];

  const stats = [
    { value: "+21%", label: t("hero.inclusionLift") },
    { value: "0.89", label: t("hero.rocAuc") },
    { value: "5k+", label: t("hero.rows") },
    { value: "100%", label: t("hero.explainable") },
  ];

  const fade = (i: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: i * 0.1 }
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none mesh-gradient opacity-60" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-3s' }} />

        <div className="container relative py-20 flex flex-col items-center text-center">
          <motion.div {...fade(0)} className="mb-8">
            <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary flex items-center gap-2">
              <Lock className="h-3 w-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t("common.credits")}</span>
            </Badge>
          </motion.div>

          <motion.h1
            {...fade(1)}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tight max-w-5xl leading-[0.95] mb-8"
          >
            {t("hero.title")} <span className="gradient-text">{t("hero.gradient")}</span>
          </motion.h1>

          <motion.p
            {...fade(2)}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-12"
          >
            {t("hero.desc")}
          </motion.p>

          <motion.div {...fade(3)} className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
            >
              Get Started <Zap className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border bg-secondary/50 backdrop-blur-sm text-foreground font-bold text-sm hover:bg-secondary transition"
            >
              {t("common.analyzeEngine")}
            </Link>
          </motion.div>

          {/* Floating Indicators */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl border-t border-border/50 pt-12">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} {...fade(4 + i)} className="text-center">
                <div className="font-display text-4xl font-black text-primary mb-1">{stat.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="container py-24 border-t border-border/30">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div key={f.title} {...fade(6 + i)}>
              <Link to={f.link} className="glass-card group p-8 block hover:border-primary/40 transition-all h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition">
                  <f.icon className="h-24 w-24" />
                </div>
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-500">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{f.desc}</p>
                <div className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                  Create Profile <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-secondary/20 py-16 border-y border-border/30">
        <div className="container flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition duration-500">
          <div className="flex items-center gap-2 font-display font-bold text-lg"><Globe className="h-6 w-6" /> {t("common.nbfcs")}</div>
          <div className="flex items-center gap-2 font-display font-bold text-lg"><Target className="h-6 w-6" /> {t("common.microLenders")}</div>
          <div className="flex items-center gap-2 font-display font-bold text-lg"><Shield className="h-6 w-6" /> {t("common.fintechs")}</div>
          <div className="flex items-center gap-2 font-display font-bold text-lg"><Users className="h-6 w-6" /> {t("common.ruralBanks")}</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-background">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="font-display font-bold text-sm">Fin Saarthi</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{t("common.credits")}</div>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground text-center md:text-right max-w-xs">
            {t("consent.minimization")}
          </div>
        </div>
      </footer>
    </Layout>
  );
}
