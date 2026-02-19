import React, { useState } from "react";
import { Shield, Lock, Eye } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLanguage } from "./LanguageContext";

interface ConsentLayerProps {
    onConsent: () => void;
}

export const ConsentLayer: React.FC<ConsentLayerProps> = ({ onConsent }) => {
    const { t } = useLanguage();
    const [open, setOpen] = useState(true);
    const [consents, setConsents] = useState({
        behavioral: true,
        utility: true,
        psychometric: true,
    });

    const handleAccept = () => {
        setOpen(false);
        onConsent();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px] border-primary/20 backdrop-blur-xl bg-background/95">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <DialogTitle className="text-2xl font-display">{t("consent.title")}</DialogTitle>
                    </div>
                    <DialogDescription className="text-base text-muted-foreground pt-2">
                        {t("consent.desc")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="bg-secondary/50 rounded-xl p-4 flex gap-3 border border-border">
                        <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-semibold text-foreground mb-1">{t("consent.noStore")}</p>
                            <p className="text-muted-foreground leading-snug">
                                {t("consent.noStoreDesc")}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">{t("simulator.upiActivity")}</Label>
                                <p className="text-sm text-muted-foreground">{t("consent.consentDigital")}</p>
                            </div>
                            <Switch checked={consents.behavioral} onCheckedChange={(v) => setConsents(prev => ({ ...prev, behavioral: v }))} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">{t("simulator.utilityStreak")}</Label>
                                <p className="text-sm text-muted-foreground">{t("consent.consentUtility")}</p>
                            </div>
                            <Switch checked={consents.utility} onCheckedChange={(v) => setConsents(prev => ({ ...prev, utility: v }))} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">{t("simulator.psychometric")}</Label>
                                <p className="text-sm text-muted-foreground">{t("consent.consentPrivacy")}</p>
                            </div>
                            <Switch checked={consents.psychometric} onCheckedChange={(v) => setConsents(prev => ({ ...prev, psychometric: v }))} />
                        </div>
                    </div>

                    <div className="flex items-start gap-3 text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
                        <Eye className="h-4 w-4 text-primary shrink-0" />
                        <p>
                            {t("consent.minimization")}
                            <br />
                            {t("consent.compliance")}
                        </p>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-3">
                    <Button variant="outline" onClick={() => window.location.href = "/"}>{t("common.decline")}</Button>
                    <Button className="glow-primary" onClick={handleAccept}>{t("common.accept")}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
