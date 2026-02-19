import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations, Language } from "@/lib/translations";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (path: string) => string;
    speak: (text: string) => void;
    isSpeaking: boolean;
    stopSpeaking: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem("trustscore-lang");
        return (saved as Language) || "en";
    });
    const [isSpeaking, setIsSpeaking] = useState(false);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("trustscore-lang", lang);
    };

    const t = useCallback((path: string): string => {
        const keys = path.split(".");
        let current: any = translations[language] || translations["en"];

        for (const key of keys) {
            if (!current || current[key] === undefined) {
                console.warn(`Translation key not found: ${path}`);
                return path;
            }
            current = current[key];
        }
        return current;
    }, [language]);

    const speak = (text: string) => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-IN";
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const stopSpeaking = () => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, speak, isSpeaking, stopSpeaking }}>
            <div className={language !== "en" ? "font-regional" : ""}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
    return context;
};
