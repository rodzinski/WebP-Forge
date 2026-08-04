import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function FinalCta() {
  return <Reveal className="final-cta"><div className="cta-glow" /><span className="section-kicker light"><ShieldCheck className="size-3.5" /> Rápido por design. Privado por arquitetura.</span><h2>Suas imagens.<br />Agora prontas para a web.</h2><p>Comece em segundos. Sem cadastro, sem upload e sem instalar nada.</p><Button asChild variant="accent" size="lg"><Link href="/app">Abrir WebP Forge <ArrowRight className="size-4" /></Link></Button></Reveal>;
}
