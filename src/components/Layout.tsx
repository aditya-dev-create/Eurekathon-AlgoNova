import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageContext";
import { LanguageSelector } from "./LanguageSelector";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { path: "/", label: "common.home" },
  { path: "/onboarding", label: "Digital Identity" },
  { path: "/behavioral-quiz", label: "Behavioral Quiz" },
  { path: "/dashboard", label: "tabs.overview" },
  { path: "/simulator", label: "tabs.simulator" },
  { path: "/fairness", label: "tabs.fairness" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            {/* Fin Saarthi custom logo: rupee-compass mark */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 shadow-lg shadow-orange-500/30">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Rupee symbol styled as a compass guide */}
                <text x="3.5" y="18" fontSize="16" fontWeight="800" fill="white" fontFamily="serif">₹</text>
                {/* Upward guiding arrow accent */}
                <path d="M18 8 L21 4 L17 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
                <path d="M21 4 L16 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              </svg>
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              Fin <span className="text-primary">Saarthi</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                >
                  {t(item.label)}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 border-l border-border/50 pl-4">
              <ThemeToggle />
              <LanguageSelector />
              <button
                className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border/50 overflow-hidden"
            >
              <div className="container py-3 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                  >
                    {t(item.label)}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>{children}</main>
    </div>
  );
}
