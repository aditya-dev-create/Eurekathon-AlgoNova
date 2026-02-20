import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Brain, Target, Zap, ArrowRight, CheckCircle2, Info, Clock, Save, PieChart } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/LanguageContext";

interface Question {
    id: string;
    text: string;
    dimension: "conscientiousness" | "delayed_gratification" | "financial_literacy" | "impulse_control" | "integrity";
    options: {
        label: string;
        value: number;
        description?: string;
    }[];
}

export default function PsychometricQuiz() {
    const { t } = useLanguage();
    const [step, setStep] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [isAnimating, setIsAnimating] = useState(false);

    // Build questions dynamically from translations so they switch language on demand
    const quizQuestions: Question[] = useMemo(() => [
        {
            id: "q1", dimension: "delayed_gratification",
            text: t("quiz.q1"),
            options: [
                { label: t("quiz.q1o1"), value: 1.0, description: t("quiz.q1d1") },
                { label: t("quiz.q1o2"), value: 0.8, description: t("quiz.q1d2") },
                { label: t("quiz.q1o3"), value: 0.5, description: t("quiz.q1d3") },
                { label: t("quiz.q1o4"), value: 0.2, description: t("quiz.q1d4") },
            ]
        },
        {
            id: "q2", dimension: "conscientiousness",
            text: t("quiz.q2"),
            options: [
                { label: t("quiz.q2o1"), value: 1.0, description: t("quiz.q2d1") },
                { label: t("quiz.q2o2"), value: 0.7, description: t("quiz.q2d2") },
                { label: t("quiz.q2o3"), value: 0.3, description: t("quiz.q2d3") },
                { label: t("quiz.q2o4"), value: 0.0, description: t("quiz.q2d4") },
            ]
        },
        {
            id: "q3", dimension: "financial_literacy",
            text: t("quiz.q3"),
            options: [
                { label: t("quiz.q3o1"), value: 1.0, description: t("quiz.q3d1") },
                { label: t("quiz.q3o2"), value: 0.5, description: t("quiz.q3d2") },
                { label: t("quiz.q3o3"), value: 0.2, description: t("quiz.q3d3") },
            ]
        },
        {
            id: "q4", dimension: "impulse_control",
            text: t("quiz.q4"),
            options: [
                { label: t("quiz.q4o1"), value: 1.0, description: t("quiz.q4d1") },
                { label: t("quiz.q4o2"), value: 0.7, description: t("quiz.q4d2") },
                { label: t("quiz.q4o3"), value: 0.3, description: t("quiz.q4d3") },
            ]
        },
        {
            id: "q5", dimension: "integrity",
            text: t("quiz.q5"),
            options: [
                { label: t("quiz.q5o1"), value: 1.0, description: t("quiz.q5d1") },
                { label: t("quiz.q5o2"), value: 0.4, description: t("quiz.q5d2") },
                { label: t("quiz.q5o3"), value: 0.0, description: t("quiz.q5d3") },
            ]
        },
        {
            id: "q6", dimension: "conscientiousness",
            text: t("quiz.q6"),
            options: [
                { label: t("quiz.q6o1"), value: 1.0, description: t("quiz.q6d1") },
                { label: t("quiz.q6o2"), value: 0.6, description: t("quiz.q6d2") },
                { label: t("quiz.q6o3"), value: 0.3, description: t("quiz.q6d3") },
            ]
        },
        {
            id: "q7", dimension: "financial_literacy",
            text: t("quiz.q7"),
            options: [
                { label: t("quiz.q7o1"), value: 1.0, description: t("quiz.q7d1") },
                { label: t("quiz.q7o2"), value: 0.6, description: t("quiz.q7d2") },
                { label: t("quiz.q7o3"), value: 0.2, description: t("quiz.q7d3") },
            ]
        },
        {
            id: "q8", dimension: "integrity",
            text: t("quiz.q8"),
            options: [
                { label: t("quiz.q8o1"), value: 1.0, description: t("quiz.q8d1") },
                { label: t("quiz.q8o2"), value: 0.4, description: t("quiz.q8d2") },
                { label: t("quiz.q8o3"), value: 0.2, description: t("quiz.q8d3") },
            ]
        },
        {
            id: "q9", dimension: "conscientiousness",
            text: t("quiz.q9"),
            options: [
                { label: t("quiz.q9o1"), value: 1.0, description: t("quiz.q9d1") },
                { label: t("quiz.q9o2"), value: 0.7, description: t("quiz.q9d2") },
                { label: t("quiz.q9o3"), value: 0.4, description: t("quiz.q9d3") },
            ]
        },
        {
            id: "q10", dimension: "delayed_gratification",
            text: t("quiz.q10"),
            options: [
                { label: t("quiz.q10o1"), value: 1.0, description: t("quiz.q10d1") },
                { label: t("quiz.q10o2"), value: 0.5, description: t("quiz.q10d2") },
                { label: t("quiz.q10o3"), value: 0.3, description: t("quiz.q10d3") },
            ]
        },
    ], [t]);

    const progress = ((currentQuestionIndex) / quizQuestions.length) * 100;

    const handleStart = () => setStep(1);

    const handleAnswer = (value: number) => {
        if (isAnimating) return;

        const updatedAnswers = { ...answers, [quizQuestions[currentQuestionIndex].id]: value };
        setAnswers(updatedAnswers);

        if (currentQuestionIndex < quizQuestions.length - 1) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setIsAnimating(false);
            }, 400);
        } else {
            const scoresByDimension: Record<string, number[]> = {};
            quizQuestions.forEach(q => {
                const val = updatedAnswers[q.id];
                if (val !== undefined) {
                    if (!scoresByDimension[q.dimension]) scoresByDimension[q.dimension] = [];
                    scoresByDimension[q.dimension].push(val);
                }
            });

            const dimensions = Object.entries(scoresByDimension).map(([name, vals]) => ({
                name,
                score: (vals.reduce((a, b) => a + b, 0) / vals.length) * 100
            }));

            const totalScore = dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length;

            localStorage.setItem("behavioral_quiz_complete", "true");
            localStorage.setItem("behavioral_score", Math.round(totalScore).toString());

            setStep(2);
        }
    };

    const calculateResult = useMemo(() => {
        const answeredKeys = Object.keys(answers);
        if (answeredKeys.length === 0) return null;

        const scoresByDimension: Record<string, number[]> = {};
        quizQuestions.forEach(q => {
            if (!scoresByDimension[q.dimension]) scoresByDimension[q.dimension] = [];
            scoresByDimension[q.dimension].push(answers[q.id] || 0);
        });

        const dimensions = Object.entries(scoresByDimension).map(([name, vals]) => {
            const sum = vals.reduce((a, b) => a + b, 0);
            return {
                name,
                score: vals.length > 0 ? (sum / vals.length) * 100 : 0
            };
        });

        const totalScore = dimensions.length > 0
            ? dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length
            : 0;

        return {
            totalScore: Math.round(totalScore),
            dimensions,
            reliability: totalScore > 80 ? "EXCEPTIONAL" : totalScore > 60 ? "STABLE" : totalScore > 40 ? "MODERATE" : "VULNERABLE",
            trustBonus: Math.round(totalScore * 1.5)
        };
    }, [answers, quizQuestions]);

    return (
        <Layout>
            <div className="container min-h-[80vh] py-12 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-2xl text-center space-y-8"
                        >
                            <div className="mx-auto w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center glow-primary">
                                <Brain className="h-10 w-10 text-orange-500" />
                            </div>

                            <div className="space-y-4">
                                <Badge variant="outline" className="border-orange-500/30 text-orange-600 bg-orange-500/5 px-4 py-1">
                                    {t("quiz.badgeLabel")}
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight">
                                    {t("quiz.pageTitle")} <span className="gradient-text">{t("quiz.pageTitleHighlight")}</span>
                                </h1>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    {t("quiz.pageDesc")}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                                {[
                                    { icon: Target, title: t("quiz.featureNoBias"), desc: t("quiz.featureNoBiasDesc") },
                                    { icon: Shield, title: t("quiz.featureConfidential"), desc: t("quiz.featureConfidentialDesc") },
                                    { icon: Zap, title: t("quiz.featureFast"), desc: t("quiz.featureFastDesc") }
                                ].map((item, i) => (
                                    <div key={i} className="glass-card p-4 text-center">
                                        <item.icon className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                                        <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4">
                                <Button
                                    size="lg"
                                    className="px-12 py-7 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-xl shadow-orange-500/20 group"
                                    onClick={handleStart}
                                >
                                    {t("quiz.beginBtn")} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition" />
                                </Button>
                                <p className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-1">
                                    <Info className="h-3 w-3" /> {t("quiz.disclaimerNote")}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-3xl space-y-8"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
                                            {t("quiz.questionLabel")} {currentQuestionIndex + 1} {t("quiz.of")} {quizQuestions.length}
                                        </span>
                                        <h2 className="text-xl font-display font-bold">{t("quiz.evaluationTitle")}</h2>
                                    </div>
                                    <span className="text-sm font-bold text-muted-foreground">{Math.round(progress)}{t("quiz.percentComplete")}</span>
                                </div>
                                <Progress value={progress} className="h-1.5 bg-orange-500/10" />
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentQuestionIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="glass-card overflow-hidden border-orange-500/10 shadow-bespoke">
                                        <CardHeader className="bg-orange-500/5 border-b border-orange-500/10 py-8">
                                            <CardTitle className="text-2xl leading-tight font-display font-bold text-foreground">
                                                {quizQuestions[currentQuestionIndex].text}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-8 space-y-4">
                                            {quizQuestions[currentQuestionIndex].options.map((option, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleAnswer(option.value)}
                                                    className="w-full text-left p-5 rounded-2xl border border-border bg-background/40 hover:bg-orange-500/5 hover:border-orange-500/30 transition-all group flex items-start gap-4"
                                                >
                                                    <div className="mt-1 w-6 h-6 rounded-full border-2 border-border group-hover:border-orange-500 flex items-center justify-center shrink-0 transition-colors">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500 scale-0 group-hover:scale-100 transition-transform" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm mb-0.5 group-hover:text-orange-600 transition-colors">
                                                            {option.label}
                                                        </div>
                                                        {option.description && (
                                                            <div className="text-xs text-muted-foreground">
                                                                {option.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </CardContent>
                                        <CardFooter className="bg-secondary/20 p-4 px-8 border-t border-border flex justify-between items-center">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Brain className="h-3 w-3" /> {t("quiz.measuring")} {quizQuestions[currentQuestionIndex].dimension.replace("_", " ")}
                                            </div>
                                            <div className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-tighter">
                                                {t("quiz.engineLabel")}
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            </AnimatePresence>

                            <div className="text-center">
                                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                    {t("quiz.honestyNote")}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && calculateResult && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-4xl space-y-8"
                        >
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4">
                                    <CheckCircle2 className="h-8 w-8 text-orange-500" />
                                </div>
                                <h2 className="text-3xl font-display font-black tracking-tight uppercase">{t("quiz.resultTitle")}</h2>
                                <p className="text-muted-foreground">{t("quiz.resultDesc")}</p>
                            </div>

                            <div className="grid md:grid-cols-12 gap-6">
                                <Card className="md:col-span-12 glass-card bg-orange-600 border-none text-white overflow-hidden relative shadow-2xl shadow-orange-600/20">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                                    <CardHeader className="relative z-10 text-center pb-2">
                                        <div className="text-lg font-bold opacity-80 uppercase tracking-widest">{t("quiz.behavioralIndex")}</div>
                                    </CardHeader>
                                    <CardContent className="relative z-10 flex flex-col items-center justify-center py-6">
                                        <div className="relative">
                                            <div className="text-8xl font-black font-display tracking-tighter">{calculateResult.totalScore}</div>
                                            <div className="absolute -top-4 -right-8 bg-white/20 px-3 py-1 rounded-full text-[10px] font-black backdrop-blur-md">{t("quiz.scoreLabel")}</div>
                                        </div>
                                        <div className="mt-4 flex flex-col items-center">
                                            <div className="text-sm font-bold opacity-70 mb-1">{t("quiz.statusLabel")}</div>
                                            <Badge className="bg-white text-orange-600 font-black text-lg px-6 py-1">{calculateResult.reliability}</Badge>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="relative z-10 bg-black/10 backdrop-blur-md border-t border-white/10 p-6 flex justify-between items-center text-center">
                                        <div className="flex-1 border-r border-white/10 px-4">
                                            <div className="text-[10px] font-bold opacity-60 uppercase mb-1">{t("quiz.trustBonusLabel")}</div>
                                            <div className="text-xl font-bold">+{calculateResult.trustBonus} pts</div>
                                        </div>
                                        <div className="flex-1 px-4">
                                            <div className="text-[10px] font-bold opacity-60 uppercase mb-1">{t("quiz.inclusionLiftLabel")}</div>
                                            <div className="text-xl font-bold">+24.2%</div>
                                        </div>
                                    </CardFooter>
                                </Card>

                                <div className="md:col-span-7 space-y-4">
                                    <div className="glass-card p-6 h-full">
                                        <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                                            <PieChart className="h-5 w-5 text-orange-500" /> {t("quiz.dimensionsTitle")}
                                        </h3>
                                        <div className="space-y-6">
                                            {calculateResult.dimensions.map(d => (
                                                <div key={d.name} className="space-y-2">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{d.name.replace("_", " ")}</span>
                                                        <span className="text-sm font-bold text-orange-600">{Math.round(d.score)}%</span>
                                                    </div>
                                                    <Progress value={d.score} className="h-1.5 bg-orange-500/10" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-5 space-y-4">
                                    <div className="glass-card p-6 h-full border-l-4 border-l-orange-500">
                                        <h3 className="font-display font-bold text-xl mb-4">{t("quiz.insightsTitle")}</h3>
                                        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                                            <div className="flex gap-3">
                                                <Clock className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                                <p>{t("quiz.insight1")}</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <Save className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                                <p>{t("quiz.insight2")}</p>
                                            </div>
                                        </div>
                                        <div className="mt-8">
                                            <Link to="/simulator" state={{ behavioralScore: calculateResult.totalScore }}>
                                                <Button className="w-full py-6 rounded-xl bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 font-bold gap-2">
                                                    {t("quiz.applySimulator")} <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center pt-8">
                                <Link to="/dashboard" className="text-sm font-bold text-muted-foreground hover:text-orange-500 transition-colors">
                                    {t("quiz.returnDashboard")}
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
}
