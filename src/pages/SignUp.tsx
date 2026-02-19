import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Mail, ArrowRight, AlertTriangle, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignUp() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [shake, setShake] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setShake(false);

        // Validation logic
        if (fullName.length < 2) {
            setError("Please enter your full legal name.");
            setShake(true);
            setLoading(false);
            setTimeout(() => setShake(false), 500);
            return;
        }

        if (!email.includes("@")) {
            setError("Please enter a valid business email.");
            setShake(true);
            setLoading(false);
            setTimeout(() => setShake(false), 500);
            return;
        }

        if (password.length < 6) {
            setError("Security requirement: password must be at least 6 characters.");
            setShake(true);
            setLoading(false);
            setTimeout(() => setShake(false), 500);
            return;
        }

        // Simulate account synthesis
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Persist session
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_name", fullName.split(" ")[0]);
        localStorage.setItem("onboarding_complete", "false"); // New user needs onboarding

        setSuccess(true);
        setLoading(false);

        setTimeout(() => {
            navigate("/onboarding");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 selection:bg-orange-100 selection:text-orange-900 relative overflow-hidden">
            <div className="absolute inset-0 mesh-gradient opacity-30" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    x: shake ? [-10, 10, -10, 10, 0] : 0
                }}
                transition={{
                    duration: 0.5,
                    x: { type: "spring", stiffness: 300, damping: 10 }
                }}
                className="w-full max-w-md relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-orange-500/20 mb-4 animate-float">
                        <Shield className="w-7 h-7" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-slate-50">Create Identity</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Start your alternative credit journey</p>
                </div>

                <Card className="border-slate-200 dark:border-slate-800 shadow-2xl shadow-orange-500/5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl overflow-hidden border-t-4 border-t-orange-500">
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-12 text-center space-y-4"
                            >
                                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold">Identity Created!</h2>
                                <p className="text-muted-foreground">Redirecting to digital onboarding...</p>
                            </motion.div>
                        ) : (
                            <form key="form" onSubmit={handleSubmit}>
                                <CardHeader className="space-y-1">
                                    <CardTitle className="text-xl">Sign Up</CardTitle>
                                    <CardDescription>
                                        Register your account to unlock the sovereign credit engine
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-medium flex items-center gap-2"
                                        >
                                            <AlertTriangle className="h-3.5 w-3.5" />
                                            {error}
                                        </motion.div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Legal Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                id="fullName"
                                                type="text"
                                                placeholder="Alex Taylor"
                                                className="pl-10 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:ring-orange-500/20 focus:border-orange-500"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="name@example.com"
                                                className="pl-10 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:ring-orange-500/20 focus:border-orange-500"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Security Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:ring-orange-500/20 focus:border-orange-500"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                                            Account creation implies consent to alternative credit data ingestion and behavioral modeling.
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="submit"
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 shadow-xl shadow-orange-500/20 transition-all active:scale-95 text-lg group"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Create Account <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        )}
                    </AnimatePresence>
                </Card>

                <p className="text-center text-sm text-slate-500 mt-6 font-medium">
                    Already have an account?{" "}
                    <Link to="/login" className="text-orange-600 hover:text-orange-500 font-bold transition-colors">Sign in here</Link>
                </p>

                <div className="mt-8 flex items-center justify-center gap-6 opacity-30 grayscale text-center">
                    <Shield className="h-5 w-5" />
                    <div className="text-[10px] font-black uppercase tracking-tighter">SECURE CLOUD ENGINE</div>
                </div>
            </motion.div>
        </div>
    );
}
