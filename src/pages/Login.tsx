import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [shake, setShake] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Simple Validation
        if (!email.includes("@")) {
            setError("Please enter a valid business email.");
            setShake(true);
            setLoading(false);
            setTimeout(() => setShake(false), 500);
            return;
        }

        // Simulate specialized authentication logic
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Define a "real" dummy account for the user to use
        // or accept any password longer than 6 chars for a "test" feel
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            setShake(true);
            setLoading(false);
            setTimeout(() => setShake(false), 500);
            return;
        }

        // Successful simulation
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_name", email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1));

        setLoading(false);
        navigate("/onboarding");
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 selection:bg-orange-100 selection:text-orange-900 relative overflow-hidden">
            <div className="absolute inset-0 mesh-gradient opacity-30" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    x: shake ? [-10, 10, -10, 10, 0] : 0
                }}
                transition={{
                    duration: 0.5,
                    x: { type: "spring", stiffness: 300, damping: 10 }
                }}
                className="w-full max-w-md relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20 mb-4 animate-float">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Welcome back</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Enter your credentials to access your dashboard</p>
                </div>

                <Card className="border-slate-200 dark:border-slate-800 shadow-xl shadow-orange-500/5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
                    <form onSubmit={handleSubmit}>
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-xl">Login</CardTitle>
                            <CardDescription>
                                Enter your credentials to access your account
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <a href="#" className="text-xs text-orange-600 hover:text-orange-500 font-medium">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-10 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:ring-orange-500/20 focus:border-orange-500"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 shadow-lg shadow-orange-500/20 transition-all active:scale-95"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Sign In <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-orange-600 hover:text-orange-500 font-bold transition-colors">Sign up here</Link>
                </p>
            </motion.div>
        </div>
    );
}
