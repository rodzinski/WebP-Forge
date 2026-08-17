import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Map } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { SiteFooter } from "@/components/landing/site-footer";
import { RoadmapBoard } from "@/components/roadmap/roadmap-board";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Roadmap — WebP Forge",
  description: "Acompanhe o que foi entregue, o que está em andamento e as próximas direções do WebP Forge.",
};

export default function RoadmapPage() {
  return <main className="roadmap-page">
    <header className="legal-header">
      <Link href="/" className="site-brand"><BrandMark size={34} priority /><span>WebP Forge</span></Link>
      <Button asChild size="sm" variant="ghost"><Link href="/"><ArrowLeft className="size-3.5" />Voltar ao site</Link></Button>
    </header>
    <section className="roadmap-hero">
      <span className="section-kicker"><Map className="size-3.5" /> CAMINHO DO PRODUTO</span>
      <h1>Construído em público.<br /><em>Evoluindo com propósito.</em></h1>
      <div><p>Este roadmap mostra prioridades, não promessas de data. A ordem pode mudar conforme aprendemos com o uso real e com o feedback da comunidade.</p><Button asChild variant="outline" size="sm"><Link href="/feedback">Sugerir uma melhoria <ArrowUpRight className="size-3.5" /></Link></Button></div>
    </section>
    <RoadmapBoard />
    <section className="roadmap-changelog-callout"><div><span>O QUE JÁ CHEGOU</span><h2>Cada entrega tem uma história.</h2><p>Veja detalhes, correções e downloads de todas as versões publicadas.</p></div><Button asChild variant="accent" size="lg"><Link href="/changelog">Abrir changelog <ArrowUpRight className="size-4" /></Link></Button></section>
    <SiteFooter />
  </main>;
}
