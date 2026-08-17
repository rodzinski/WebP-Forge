"use client";

import { openAnalyticsPreferencesEvent } from "@/components/analytics/analytics-consent";

export function AnalyticsPreferencesButton() {
  if (!process.env.NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN) return null;
  return <button className="footer-preference-button" onClick={() => window.dispatchEvent(new Event(openAnalyticsPreferencesEvent))}>Preferências de analytics</button>;
}
