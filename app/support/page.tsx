import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Code2, Heart, MessageCircleHeart, Share2, Star } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { SiteFooter } from "@/components/landing/site-footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Apoie o projeto — WebP Forge", description: "Ajude o WebP Forge a continuar gratuito, privado e em evolução." };
const repositoryUrl = "https://github.com/rodzinski/WebP-Forge";
const defaultFinancialSupportUrl = "https://github.com/sponsors/rodzinski";

export default function SupportPage() {
  const financialSupportUrl = process.env.NEXT_PUBLIC_SUPPORT_URL?.trim() || defaultFinancialSupportUrl;
  return <main className="support-page">
    <header className="legal-header"><Link href="/" className="site-brand"><BrandMark size={34} priority /><span>WebP Forge</span></Link><Button asChild size="sm" variant="ghost"><Link href="/"><ArrowLeft className="size-3.5" />Voltar ao site</Link></Button></header>
    <section className="support-hero"><span className="section-kicker"><Heart className="size-3.5" /> APOIE O FORGE</span><h1>Gratuito por escolha.<br /><em>Melhor com a comunidade.</em></h1><p>Seu apoio ajuda a manter o conversor privado, sem publicidade e acessível para todos.</p></section>
    <section className="support-grid">
      <article className="support-primary"><span><Heart className="size-4" /> APOIO FINANCEIRO</span><h2>Ajude a sustentar o desenvolvimento.</h2><p>Contribuições serão usadas para distribuição, infraestrutura e tempo de desenvolvimento. Os recursos principais continuarão gratuitos.</p><Button asChild variant="accent" size="lg"><a href={financialSupportUrl} target="_blank" rel="noreferrer">Apoiar pelo GitHub Sponsors <ArrowUpRight className="size-4" /></a></Button></article>
      <div className="support-community">
        <a href={`${repositoryUrl}/stargazers`} target="_blank" rel="noreferrer"><Star className="size-5" /><div><span>01</span><h2>Dê uma estrela</h2><p>Ajude mais pessoas a encontrar o projeto no GitHub.</p></div><ArrowUpRight className="size-4" /></a>
        <Link href="/feedback"><MessageCircleHeart className="size-5" /><div><span>02</span><h2>Compartilhe feedback</h2><p>Ideias e relatos reais direcionam as próximas melhorias.</p></div><ArrowUpRight className="size-4" /></Link>
        <a href={repositoryUrl} target="_blank" rel="noreferrer"><Code2 className="size-5" /><div><span>03</span><h2>Contribua no GitHub</h2><p>Acompanhe o código web e participe das discussões.</p></div><ArrowUpRight className="size-4" /></a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(repositoryUrl)}`} target="_blank" rel="noreferrer"><Share2 className="size-5" /><div><span>04</span><h2>Divulgue o projeto</h2><p>Uma recomendação pode levar o Forge a quem precisa.</p></div><ArrowUpRight className="size-4" /></a>
      </div>
    </section><SiteFooter />
  </main>;
}
