import React from "react";
import { useLanguage } from "./LanguageContext";
import { Language } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

export const LanguageSelector: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();

    const langs: { code: Language; label: string; native: string }[] = [
        { code: "en", label: "English", native: "English" },
        { code: "hi", label: "Hindi", native: "हिंदी" },
        { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
    ];

    const currentLang = langs.find((l) => l.code === language);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                    <Languages className="h-4 w-4" />
                    <span className="hidden sm:inline font-medium">{currentLang?.native}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px] bg-background/95 backdrop-blur-sm border-border/50">
                {langs.map((l) => (
                    <DropdownMenuItem
                        key={l.code}
                        onClick={() => setLanguage(l.code)}
                        className={`cursor-pointer ${language === l.code ? "bg-primary/10 text-primary font-bold" : ""}`}
                    >
                        <div className="flex flex-col">
                            <span className="text-sm">{l.native}</span>
                            <span className="text-[10px] opacity-50">{l.label}</span>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
