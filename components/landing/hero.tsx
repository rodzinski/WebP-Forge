import Link from "next/link";
import { ArrowRight, Download, LockKeyhole, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroReveal } from "@/components/motion/reveal";
import { HeroVisual } from "./hero-visual";

export function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <HeroReveal><span className="section-kicker"><Zap className="size-3.5" /> Conversão instantânea no navegador</span></HeroReveal>
        <HeroReveal delay={.08}><h1>Conversão sem upload.<br /><span>Sem espera.</span></h1></HeroReveal>
        <HeroReveal delay={.16}><p>Converta lotes inteiros, padronize dimensões e preserve transparência — com processamento privado que nunca envia seus arquivos para um servidor.</p></HeroReveal>
        <HeroReveal delay={.24} className="hero-actions">
          <Button asChild variant="accent" size="lg"><Link href="/app">Converter imagens <ArrowRight className="size-4" /></Link></Button>
          <Button asChild variant="outline" size="lg"><a href="https://github.com/rodzinski/WebP-Forge/releases/latest/download/WebP-Forge-win-x64.zip"><Download className="size-4" />Baixar para Windows</a></Button>
        </HeroReveal>
        <HeroReveal delay={.32} className="hero-trust"><LockKeyhole className="size-4" /><span>Privado por arquitetura</span><i /><span>Sem cadastro</span><i /><span>Grátis</span></HeroReveal>
      </div>
      <HeroReveal delay={.2} className="hero-visual-wrap"><HeroVisual /></HeroReveal>
    </section>
  );
}
