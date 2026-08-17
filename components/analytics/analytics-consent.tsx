"use client";

import { useEffect, useState } from "react";
import { BarChart3, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const preferenceKey = "webp-forge-analytics-consent";
const defaultCloudflareWebAnalyticsToken = "dd2ab5f9c77f4b6c814f6285e0400b5d";
export const openAnalyticsPreferencesEvent = "webp-forge:open-analytics-preferences";
type Consent = "unknown" | "granted" | "denied";

function installCloudflareBeacon(token: string) {
  if (document.querySelector("script[data-webp-forge-analytics]")) return;
  const script = document.createElement("script");
  script.type = "module";
  script.src = "https://static.cloudflareinsights.com/beacon.min.js";
  script.dataset.webpForgeAnalytics = "true";
  script.dataset.cfBeacon = JSON.stringify({ token });
  document.head.appendChild(script);
}

export function AnalyticsConsent() {
  const token = process.env.NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN?.trim() || defaultCloudflareWebAnalyticsToken;
  const [consent, setConsent] = useState<Consent>("unknown");
  const [ready, setReady] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(preferenceKey);
    setConsent(stored === "granted" || stored === "denied" ? stored : "unknown");
    setReady(true);
    const open = () => setPreferencesOpen(true);
    window.addEventListener(openAnalyticsPreferencesEvent, open);
    return () => window.removeEventListener(openAnalyticsPreferencesEvent, open);
  }, []);

  useEffect(() => {
    if (token && consent === "granted") installCloudflareBeacon(token);
  }, [consent, token]);

  if (!token || !ready || (consent !== "unknown" && !preferencesOpen)) return null;

  function choose(next: Exclude<Consent, "unknown">) {
    const mustReload = consent === "granted" && next === "denied";
    localStorage.setItem(preferenceKey, next);
    setConsent(next);
    setPreferencesOpen(false);
    if (mustReload) window.location.reload();
  }

  return <aside className="analytics-consent" role="dialog" aria-modal="false" aria-labelledby="analytics-title">
    {preferencesOpen && <button className="analytics-close" onClick={() => setPreferencesOpen(false)} aria-label="Fechar preferências"><X className="size-4" /></button>}
    <div className="analytics-icon"><BarChart3 className="size-5" /></div>
    <div className="analytics-copy"><span><ShieldCheck className="size-3.5" /> ANALYTICS OPCIONAL</span><strong id="analytics-title">Ajude a melhorar o WebP Forge.</strong><p>Com sua permissão, coletamos apenas métricas agregadas de navegação pela Cloudflare. Nenhuma imagem, nome de arquivo ou histórico é enviado.</p></div>
    <div className="analytics-actions"><Button variant="ghost" size="sm" onClick={() => choose("denied")}>Não permitir</Button><Button variant="accent" size="sm" onClick={() => choose("granted")}>Permitir métricas</Button></div>
  </aside>;
}
