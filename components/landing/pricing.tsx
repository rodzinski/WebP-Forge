import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

const included = ["Conversões ilimitadas", "Processamento local", "Download em ZIP", "Dimensões personalizadas", "Tema claro e escuro"];

export function Pricing() {
  return (
    <section className="pricing-section" id="precos">
      <Reveal className="pricing-copy"><span className="section-kicker">Preço simples</span><h2>Use agora.<br />Sem cartão.</h2><p>As funcionalidades essenciais do WebP Forge são gratuitas. Recursos avançados para equipes poderão chegar no futuro — sem retirar o que já funciona hoje.</p></Reveal>
      <Reveal className="price-card" delay={.1}><div className="price-head"><span><Sparkles className="size-4" /> Plano atual</span><strong>Grátis</strong><small>para uso pessoal e profissional</small></div><ul>{included.map((item) => <li key={item}><Check className="size-4" />{item}</li>)}</ul><Button asChild variant="accent" size="lg" className="w-full"><Link href="/app">Começar agora</Link></Button></Reveal>
    </section>
  );
}
