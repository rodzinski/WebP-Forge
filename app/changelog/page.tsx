import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { AmbientBackdrop } from "@/components/landing/ambient-backdrop";
import { ReleaseList } from "@/components/changelog/release-list";
import { SiteFooter } from "@/components/landing/site-footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Changelog — WebP Forge",
  description: "Acompanhe as novidades, melhorias e correções publicadas no WebP Forge.",
};

export default function ChangelogPage() {
  return <main className="changelog-page">
    <AmbientBackdrop subtle />
    <header className="legal-header">
      <Link href="/" className="site-brand"><BrandMark size={34} priority /><span>WebP Forge</span></Link>
      <Button asChild size="sm" variant="ghost"><Link href="/"><ArrowLeft className="size-3.5" />Voltar ao site</Link></Button>
    </header>
    <section className="changelog-hero">
      <span className="section-kicker"><History className="size-3.5" /> EVOLUÇÃO CONTÍNUA</span>
      <h1>Cada versão.<br /><em>Um Forge melhor.</em></h1>
      <p>Novos recursos, melhorias e correções sincronizados diretamente com as releases oficiais.</p>
    </section>
    <ReleaseList />
    <SiteFooter />
  </main>;
}
