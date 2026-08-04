import { Quote } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const perspectives = [
  { area: "Design systems", quote: "Padronizar centenas de assets deixa de ser uma tarefa manual e passa a ser uma única ação." },
  { area: "E-commerce", quote: "Imagens mais leves, dimensões consistentes e nenhum arquivo de produto enviado a terceiros." },
  { area: "Desenvolvimento", quote: "Um utilitário direto para preparar assets sem abrir editores pesados ou escrever scripts descartáveis." },
];

export function Testimonials() {
  return (
    <section className="voices-section">
      <Reveal className="section-heading compact"><span className="section-kicker">Para quem trabalha com imagem</span><h2>Um fluxo que se adapta ao seu.</h2></Reveal>
      <Stagger className="voices-grid">{perspectives.map(({ area, quote }) => <StaggerItem className="voice-card" key={area}><Quote className="size-5" /><blockquote>“{quote}”</blockquote><span>{area}</span></StaggerItem>)}</Stagger>
    </section>
  );
}
