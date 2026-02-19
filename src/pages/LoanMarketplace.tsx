import { useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Building2, Percent, Calendar, CheckCircle, AlertTriangle,
    ArrowRight, ShieldCheck, Banknote, Filter, Star
} from "lucide-react";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/components/LanguageContext";
import { getScoreColor, getRiskCategory } from "@/lib/trustscore";

interface LoanOffer {
    id: string;
    bankName: string;
    logo: string; // Placeholder color or text
    type: "Personal" | "Micro" | "Business";
    interestRange: string;
    maxAmount: number;
    tenure: string;
    chance: "High" | "Medium" | "Low";
    reason: string;
}

export default function LoanMarketplace() {
    const { t } = useLanguage();
    const location = useLocation();
    const state = location.state as { score: number; income: number } | undefined;

    // Default values if accessing directly (demo mode)
    const score = state?.score || 650;
    const income = state?.income || 25000;
    const risk = getRiskCategory(score);

    const [sortBy, setSortBy] = useState<"rate" | "chance">("chance");

    const eligibleAmount = useMemo(() => {
        // Rough logic: 10x - 20x monthly income based on score
        const multiplier = score > 750 ? 24 : score > 600 ? 12 : 6;
        return income * multiplier;
    }, [score, income]);

    const offers: LoanOffer[] = useMemo(() => {
        const allOffers: LoanOffer[] = [
            {
                id: "sbi",
                bankName: "State Bank of India",
                logo: "bg-blue-600",
                type: "Personal",
                interestRange: "10.5% - 12.5%",
                maxAmount: 2000000,
                tenure: "1 - 5 Years",
                chance: score > 720 ? "High" : score > 650 ? "Medium" : "Low",
                reason: "Best rates for high TrustScore"
            },
            {
                id: "hdfc",
                bankName: "HDFC Bank",
                logo: "bg-indigo-900",
                type: "Personal",
                interestRange: "11% - 14%",
                maxAmount: 1500000,
                tenure: "1 - 4 Years",
                chance: score > 700 ? "High" : "Medium",
                reason: "Pre-approved based on income stability"
            },
            {
                id: "ujjivan",
                bankName: "Ujjivan Small Finance",
                logo: "bg-green-700",
                type: "Micro",
                interestRange: "18% - 22%",
                maxAmount: 500000,
                tenure: "6 - 24 Months",
                chance: score > 550 ? "High" : "Medium",
                reason: "Specializes in underbanked profiles"
            },
            {
                id: "karnataka",
                bankName: "Karnataka Bank",
                logo: "bg-orange-800",
                type: "Business",
                interestRange: "14% - 16%",
                maxAmount: 1000000,
                tenure: "1 - 3 Years",
                chance: score > 600 ? "Medium" : "Low",
                reason: "Good for small business loans"
            },
            {
                id: "kreditbee",
                bankName: "KreditBee (Fintech)",
                logo: "bg-pink-600",
                type: "Micro",
                interestRange: "24% - 29%",
                maxAmount: 200000,
                tenure: "3 - 12 Months",
                chance: "High",
                reason: "High approval rate for thin-file"
            }
        ];

        // Filter logic
        let filtered = allOffers;
        if (score < 500) {
            filtered = allOffers.filter(o => o.type === "Micro");
        } else if (score < 650) {
            filtered = allOffers.filter(o => o.id !== "sbi");
        }

        // Sort logic
        return filtered.sort((a, b) => {
            if (sortBy === "rate") {
                return parseFloat(a.interestRange) - parseFloat(b.interestRange);
            } else {
                const map = { High: 3, Medium: 2, Low: 1 };
                return map[b.chance] - map[a.chance];
            }
        });
    }, [score, sortBy]);

    const fade = (i: number) => ({
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: i * 0.05 }
    });

    return (
        <Layout>
            <div className="container py-10">
                <motion.div {...fade(0)} className="mb-8">
                    <Link to="/simulator" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2">
                        ← {t("common.back")}
                    </Link>
                    <h1 className="font-display text-4xl font-bold">{t("marketplace.title")}</h1>
                    <p className="text-muted-foreground">{t("marketplace.subtitle")}</p>
                </motion.div>

                {/* User Summary Widget */}
                <motion.div {...fade(1)} className="grid md:grid-cols-4 gap-4 mb-10">
                    <Card className="md:col-span-1 bg-secondary/30 border-border">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                            <div className="relative mb-2">
                                <svg className="h-24 w-24 transform -rotate-90">
                                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-secondary" />
                                    <circle cx="48" cy="48" r="40" stroke={getScoreColor(score)} strokeWidth="8" fill="transparent"
                                        strokeDasharray={251.2}
                                        strokeDashoffset={251.2 - (251.2 * (score - 300)) / 600}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-2xl font-bold font-mono">{score}</span>
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground">TrustScore</span>
                                </div>
                            </div>
                            <Badge variant="outline" className={`${risk === "Low" ? "text-green-500 border-green-500/20" : risk === "Medium" ? "text-yellow-500 border-yellow-500/20" : "text-red-500 border-red-500/20"}`}>
                                {risk.toUpperCase()} RISK
                            </Badge>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-3 bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
                        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-around h-full gap-6">
                            <div className="text-center md:text-left">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold mb-1">{t("marketplace.eligibleAmount")}</div>
                                <div className="text-4xl font-display font-bold text-primary">
                                    ₹{(eligibleAmount).toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Based on ₹{income.toLocaleString()}/mo income & score
                                </div>
                            </div>
                            <Separator orientation="vertical" className="hidden md:block h-12" />
                            <div className="grid grid-cols-2 gap-8 text-center">
                                <div>
                                    <div className="text-sm text-muted-foreground font-medium">{t("marketplace.interestRate")}</div>
                                    <div className="text-xl font-bold">{score > 700 ? "10.5%" : score > 600 ? "14%" : "18%"} +</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground font-medium">{t("marketplace.matchChance")}</div>
                                    <div className="text-xl font-bold text-green-500">{score > 600 ? "High" : "Moderate"}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Sort & Filter */}
                <div className="flex justify-between items-center mb-6">
                    <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        {offers.length} {t("marketplace.recommended")} Offers
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={sortBy === "chance" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setSortBy("chance")}
                            className="gap-2"
                        >
                            <Star className="h-4 w-4" /> {t("marketplace.filters.sortByChance")}
                        </Button>
                        <Button
                            variant={sortBy === "rate" ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setSortBy("rate")}
                            className="gap-2"
                        >
                            <Percent className="h-4 w-4" /> {t("marketplace.filters.sortByRate")}
                        </Button>
                    </div>
                </div>

                {/* Loan Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer, i) => (
                        <motion.div key={offer.id} {...fade(2 + i)}>
                            <Card className="h-full hover:border-primary/50 transition-all duration-300 group overflow-hidden">
                                <CardHeader className="flex flex-row items-start justify-between pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-lg ${offer.logo} flex items-center justify-center text-white font-bold text-xs`}>
                                            {offer.bankName.substring(0, 2)}
                                        </div>
                                        <div>
                                            <div className="font-bold">{offer.bankName}</div>
                                            <div className="text-xs text-muted-foreground">{offer.type} Loan</div>
                                        </div>
                                    </div>
                                    <Badge variant={offer.chance === "High" ? "default" : offer.chance === "Medium" ? "secondary" : "outline"} className={offer.chance === "High" ? "bg-green-500 hover:bg-green-600" : ""}>
                                        {offer.chance === "High" ? <ShieldCheck className="h-3 w-3 mr-1" /> : null}
                                        {offer.chance} Chance
                                    </Badge>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-3 bg-secondary/30 rounded-lg text-xs text-muted-foreground flex gap-2">
                                        <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                                        {offer.reason}
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                                        <div>
                                            <div className="text-muted-foreground text-xs">{t("marketplace.interestRate")}</div>
                                            <div className="font-bold text-lg">{offer.interestRange}</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground text-xs">Max Amount</div>
                                            <div className="font-bold">₹{(offer.maxAmount / 100000).toFixed(1)} Lakh</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground text-xs">{t("marketplace.tenure")}</div>
                                            <div className="font-medium">{offer.tenure}</div>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground text-xs">Processing</div>
                                            <div className="font-medium">1-3 Days</div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full gap-2 font-bold" onClick={() => window.open("#", "_blank")}>
                                        {t("marketplace.apply")} <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* CTA if low score */}
                {score < 600 && (
                    <motion.div {...fade(5)} className="mt-12 p-8 rounded-2xl bg-secondary/20 border border-primary/20 text-center">
                        <h3 className="text-lg font-bold mb-2">Want better rates?</h3>
                        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                            Improving your TrustScore by just 50 points can unlock interest rates as low as 12%.
                        </p>
                        <Link to="/simulator">
                            <Button variant="outline" className="gap-2">
                                <Banknote className="h-4 w-4" /> Improve My TrustScore
                            </Button>
                        </Link>
                    </motion.div>
                )}

                <div className="mt-16 text-center text-xs text-muted-foreground max-w-2xl mx-auto border-t border-border pt-8">
                    <AlertTriangle className="h-4 w-4 mx-auto mb-2 opacity-50" />
                    {t("marketplace.disclaimer")}
                </div>
            </div>
        </Layout>
    );
}
