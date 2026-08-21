import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/brand-mark";
import { AmbientBackdrop } from "@/components/landing/ambient-backdrop";
import { SiteFooter } from "@/components/landing/site-footer";
import { Button } from "@/components/ui/button";

export function FormatShell({ children, backHref = "/", backLabel = "Voltar ao site" }: { children: ReactNode; backHref?: string; backLabel?: string }) {
  return <main className="formats-page">
    <AmbientBackdrop subtle />
    <header className="legal-header"><Link href="/" className="site-brand"><BrandMark size={34} priority /><span>WebP Forge</span></Link><Button asChild size="sm" variant="ghost"><Link href={backHref}><ArrowLeft className="size-3.5" />{backLabel}</Link></Button></header>
    {children}
    <SiteFooter />
  </main>;
}
