import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Brain, Target, Zap, ArrowRight, CheckCircle2, AlertCircle, Info, Clock, Save, PieChart } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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

const quizQuestions: Question[] = [
    {
        id: "q1",
        text: "If you received an unexpected ₹5,000 bonus today, how would you most likely use it?",
        dimension: "delayed_gratification",
        options: [
            { label: "Save or invest for a long-term goal", value: 1.0, description: "Future-focused mindset" },
            { label: "Pay off an existing small debt", value: 0.8, description: "Responsible debt management" },
            { label: "Buy something I've needed for a while", value: 0.5, description: "Practical spending" },
            { label: "Celebrate with friends/family or buy a treat", value: 0.2, description: "Immediate gratification" }
        ]
    },
    {
        id: "q2",
        text: "How often do you plan your expenses for the upcoming month?",
        dimension: "conscientiousness",
        options: [
            { label: "Always – I have a strict budget", value: 1.0, description: "High planning discipline" },
            { label: "Usually – I have a general idea", value: 0.7, description: "Moderate planning" },
            { label: "Rarely – I spend as needs arise", value: 0.3, description: "Ad-hoc management" },
            { label: "Never – I don't track my spending", value: 0.0, description: "No structured tracking" }
        ]
    },
    {
        id: "q3",
        text: "A shop offers you a ₹10,000 phone for ₹900/month for 12 months. What's your first thought?",
        dimension: "financial_literacy",
        options: [
            { label: "I'll pay ₹10,800 total – the interest is ₹800", value: 1.0, description: "Clear cost awareness" },
            { label: "₹900 fits my monthly budget, so I'll take it", value: 0.5, description: "Payment-centric focus" },
            { label: "It's a great deal to get the phone now", value: 0.2, description: "Impulse driven" }
        ]
    },
    {
        id: "q4",
        text: "You are short on cash for a week. How do you handle your utility bill due in 3 days?",
        dimension: "impulse_control",
        options: [
            { label: "I'll use my emergency savings to pay on time", value: 1.0, description: "Proactive crisis management" },
            { label: "I'll borrow from a friend to avoid a late fee", value: 0.7, description: "Credit-preservation focus" },
            { label: "I'll pay it late once I get my next salary", value: 0.3, description: "Reactive approach" }
        ]
    },
    {
        id: "q5",
        text: "If a digital lender accidentally sent you ₹1,000 twice, what would you do?",
        dimension: "integrity",
        options: [
            { label: "Contact support immediately to return it", value: 1.0, description: "Absolute integrity" },
            { label: "Wait to see if they ask for it back", value: 0.4, description: "Passive compliance" },
            { label: "Keep it as a 'lucky' error", value: 0.0, description: "Low accountability" }
        ]
    },
    {
        id: "q6",
        text: "How do you feel about mobile payments and UPI tracking your spending?",
        dimension: "conscientiousness",
        options: [
            { label: "Useful for tracking my habits and improving", value: 1.0, description: "Data-driven self-improvement" },
            { label: "Convenient but I don't check the history", value: 0.6, description: "Utility-focused" },
            { label: "I prefer cash to keep my spending private", value: 0.3, description: "Transparency resistance" }
        ]
    },
    {
        id: "q7",
        text: "You notice a subscription charging you for a service you don't use anymore. What's your immediate action?",
        dimension: "financial_literacy",
        options: [
            { label: "Cancel it immediately and check for a refund", value: 1.0, description: "Active financial monitoring" },
            { label: "I'll do it next time I check my accounts", value: 0.6, description: "Delayed management" },
            { label: "It's a small amount, I'll let it be for now", value: 0.2, description: "Passive loss acceptance" }
        ]
    },
    {
        id: "q8",
        text: "When considering a loan, what factor is most important to you?",
        dimension: "integrity",
        options: [
            { label: "The total cost and my ability to repay on time", value: 1.0, description: "Commitment-focused" },
            { label: "The speed of approval and getting the cash", value: 0.4, description: "Urgency-focused" },
            { label: "If the lender has strict collection policies", value: 0.2, description: "Consequence-focused" }
        ]
    },
    {
        id: "q9",
        text: "How do you handle sharing your financial data with new apps?",
        dimension: "conscientiousness",
        options: [
            { label: "I read the privacy policy and only share what's needed", value: 1.0, description: "Diligent data management" },
            { label: "I share it if it helps me get a better deal", value: 0.7, description: "Utility-driven sharing" },
            { label: "I don't mind sharing as long as the app works", value: 0.4, description: "Low friction focus" }
        ]
    },
    {
        id: "q10",
        text: "If you want to buy something expensive, how do you usually get the money?",
        dimension: "delayed_gratification",
        options: [
            { label: "Save up specifically for it over several months", value: 1.0, description: "Patient accumulation" },
            { label: "Pay using a credit card or EMI plan", value: 0.5, description: "Leverage-based purchase" },
            { label: "Borrow from friends or family", value: 0.3, description: "External support dependence" }
        ]
    }
];

export default function PsychometricQuiz() {
    const { t } = useLanguage();
    const [step, setStep] = useState(0); // 0 = Intro, 1...n = Questions, n+1 = Result
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [isAnimating, setIsAnimating] = useState(false);

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
            // Calculate final score for persistence
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

            setStep(2); // Result step
        }
    };

    const calculateResult = useMemo(() => {
        const answeredKeys = Object.keys(answers);
        if (answeredKeys.length === 0) return null;

        const scoresByDimension: Record<string, number[]> = {};
        quizQuestions.forEach(q => {
            if (!scoresByDimension[q.dimension]) scoresByDimension[q.dimension] = [];
            // Use fallback 0 only for calculateResult used in rendering intermediate states or when finishing
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
    }, [answers]);

    return (
        <Layout>
            <div className="container min-h-[80vh] py-12 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background Accents */}
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
                                    BEHAVIORAL ECONOMICS MODULE
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight">
                                    Measure Your <span className="gradient-text">Financial Mindset</span>
                                </h1>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Traditional credit scores only look at history. We look at character. This assessment measures behavioral markers that predict future financial reliability.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                                {[
                                    { icon: Target, title: "No Bias", desc: "Measures intent, not just income" },
                                    { icon: Shield, title: "Confidential", desc: "Anonymized behavioral data" },
                                    { icon: Zap, title: "Fast", desc: "5 minutes to unlock character score" }
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
                                    Begin Assessment <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition" />
                                </Button>
                                <p className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-1">
                                    <Info className="h-3 w-3" /> All answers are weighted scientifically to build your character profile.
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
                            {/* Quiz Header */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
                                            Question {currentQuestionIndex + 1} of {quizQuestions.length}
                                        </span>
                                        <h2 className="text-xl font-display font-bold">Behavioral Evaluation</h2>
                                    </div>
                                    <span className="text-sm font-bold text-muted-foreground">{Math.round(progress)}% Complete</span>
                                </div>
                                <Progress value={progress} className="h-1.5 bg-orange-500/10" />
                            </div>

                            {/* Question Card */}
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
                                                <Brain className="h-3 w-3" /> Measuring: {quizQuestions[currentQuestionIndex].dimension.replace("_", " ")}
                                            </div>
                                            <div className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-tighter">
                                                TrustScore Cognitive Engine v2.0
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            </AnimatePresence>

                            <div className="text-center">
                                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                    Be honest. There are no "right" answers, only patterns that help us build your personalized risk profile.
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
                                <h2 className="text-3xl font-display font-black tracking-tight uppercase">Character Analysis Complete</h2>
                                <p className="text-muted-foreground">Your behavioral profile has been synthesized.</p>
                            </div>

                            <div className="grid md:grid-cols-12 gap-6">
                                {/* Main Score Card */}
                                <Card className="md:col-span-12 glass-card bg-orange-600 border-none text-white overflow-hidden relative shadow-2xl shadow-orange-600/20">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                                    <CardHeader className="relative z-10 text-center pb-2">
                                        <CardTitle className="text-lg font-bold opacity-80 uppercase tracking-widest">Behavioral Reliability Index</CardTitle>
                                    </CardHeader>
                                    <CardContent className="relative z-10 flex flex-col items-center justify-center py-6">
                                        <div className="relative">
                                            <div className="text-8xl font-black font-display tracking-tighter">{calculateResult.totalScore}</div>
                                            <div className="absolute -top-4 -right-8 bg-white/20 px-3 py-1 rounded-full text-[10px] font-black backdrop-blur-md">SCORE</div>
                                        </div>
                                        <div className="mt-4 flex flex-col items-center">
                                            <div className="text-sm font-bold opacity-70 mb-1">Status</div>
                                            <Badge className="bg-white text-orange-600 font-black text-lg px-6 py-1">{calculateResult.reliability}</Badge>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="relative z-10 bg-black/10 backdrop-blur-md border-t border-white/10 p-6 flex justify-between items-center text-center">
                                        <div className="flex-1 border-r border-white/10 px-4">
                                            <div className="text-[10px] font-bold opacity-60 uppercase mb-1">TrustScore Bonus</div>
                                            <div className="text-xl font-bold">+{calculateResult.trustBonus} pts</div>
                                        </div>
                                        <div className="flex-1 px-4">
                                            <div className="text-[10px] font-bold opacity-60 uppercase mb-1">Inclusion Lift</div>
                                            <div className="text-xl font-bold">+24.2%</div>
                                        </div>
                                    </CardFooter>
                                </Card>

                                {/* Dimension Breakdown */}
                                <div className="md:col-span-7 space-y-4">
                                    <div className="glass-card p-6 h-full">
                                        <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                                            <PieChart className="h-5 w-5 text-orange-500" /> Behavioral Dimensions
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

                                {/* Recommendations */}
                                <div className="md:col-span-5 space-y-4">
                                    <div className="glass-card p-6 h-full border-l-4 border-l-orange-500">
                                        <h3 className="font-display font-bold text-xl mb-4">Financial Insights</h3>
                                        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                                            <div className="flex gap-3">
                                                <Clock className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                                <p>Your <strong>Delayed Gratification</strong> score indicates a strong ability to prioritize long-term stability over short-term impulses.</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <Save className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                                <p>Maintain your <strong>Conscientiousness</strong> by sticking to your budget tracking habit, which is a key predictor of loan repayment.</p>
                                            </div>
                                        </div>
                                        <div className="mt-8">
                                            <Link to="/simulator" state={{ behavioralScore: calculateResult.totalScore }}>
                                                <Button className="w-full py-6 rounded-xl bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 font-bold gap-2">
                                                    Apply to Simulator <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center pt-8">
                                <Link to="/dashboard" className="text-sm font-bold text-muted-foreground hover:text-orange-500 transition-colors">
                                    Return to Global Dashboard
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
}
