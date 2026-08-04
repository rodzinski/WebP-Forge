"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, ImageIcon, LockKeyhole } from "lucide-react";
import { type CSSProperties, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function InteractiveDemo() {
  const [quality, setQuality] = useState(82);
  const reduceMotion = useReducedMotion();
  const estimatedSize = useMemo(() => Math.round(18 + quality * .72), [quality]);

  return (
    <section className="demo-section">
      <div className="demo-copy"><span className="section-kicker">Experimente o controle</span><h2>Precisão sem complexidade.</h2><p>A mesma configuração é aplicada a todo o lote. O resultado permanece previsível, consistente e pronto para produção.</p><Button asChild variant="outline"><Link href="/app">Abrir experiência completa <ArrowRight className="size-4" /></Link></Button></div>
      <motion.div className="demo-panel" whileInView={reduceMotion ? undefined : { y: [18, 0], opacity: [0, 1] }} viewport={{ once: true, amount: .25 }} transition={{ duration: .62 }}>
        <div className="demo-top"><div><span>Prévia de conversão</span><small><i /> Tudo acontece localmente</small></div><LockKeyhole className="size-4" /></div>
        <div className="demo-file"><div className="demo-thumb"><ImageIcon /></div><div><strong>produto-final.png</strong><span>2048 × 2048 · 1.4 MB</span></div><CheckCircle2 className="demo-check" /></div>
        <div className="demo-controls"><label><span>Qualidade <output>{quality}%</output></span><input aria-label="Qualidade WebP da demonstração" type="range" min="40" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} style={{ "--range": `${((quality - 40) / 60) * 100}%` } as CSSProperties} /></label><div className="demo-dimensions"><span>128</span><i>×</i><span>128</span><small>px</small></div></div>
        <div className="demo-result"><div><span>WEBP</span><strong>produto-final.webp</strong></div><div><small>Tamanho estimado</small><strong>{estimatedSize} KB</strong></div></div>
      </motion.div>
    </section>
  );
}
