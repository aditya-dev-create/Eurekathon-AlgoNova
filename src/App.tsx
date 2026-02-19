import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Simulator from "./pages/Simulator";
import Fairness from "./pages/Fairness";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import LoanMarketplace from "./pages/LoanMarketplace";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import PsychometricQuiz from "./pages/PsychometricQuiz";
import SignUp from "./pages/SignUp"; // Added import
import { LanguageProvider } from "./components/LanguageContext";
import { ThemeProvider } from "./components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="trustscore-theme">
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/behavioral-quiz" element={<PsychometricQuiz />} />
              <Route path="/fairness" element={<Fairness />} />
              <Route path="/loan-marketplace" element={<LoanMarketplace />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
