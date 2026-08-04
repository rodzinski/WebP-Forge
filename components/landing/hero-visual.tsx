"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { FileImage, Sparkles } from "lucide-react";
import { type PointerEvent } from "react";

const sourceCards = [
  { label: "PNG", tone: "lime" },
  { label: "JPG", tone: "sand" },
  { label: "JFIF", tone: "blue" },
];

export function HeroVisual() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(.5);
  const pointerY = useMotionValue(.5);
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [3, -3]), { stiffness: 160, damping: 22 });
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-4, 4]), { stiffness: 160, damping: 22 });

  function handlePointer(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width);
    pointerY.set((event.clientY - bounds.top) / bounds.height);
  }

  return (
    <motion.div className="hero-visual" onPointerMove={handlePointer} onPointerLeave={() => { pointerX.set(.5); pointerY.set(.5); }}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 900 }} aria-label="Representação do processamento de imagens para WebP">
      <div className="visual-grid" />
      <div className="source-stack">
        {sourceCards.map((card, index) => (
          <motion.div className={`source-card ${card.tone}`} key={card.label} initial={reduceMotion ? false : { opacity: 0, x: -24, rotate: -5 }} animate={{ opacity: 1, x: 0, rotate: index * 3 - 3 }} transition={{ delay: .45 + index * .08, duration: .55 }}>
            <FileImage className="size-5" /><span>{card.label}</span>
          </motion.div>
        ))}
      </div>
      <div className="forge-core"><span className="forge-glow" /><Sparkles className="size-6" /><strong>128</strong><small>× 128</small></div>
      <motion.div className="output-card" initial={reduceMotion ? false : { opacity: 0, scale: .9, x: 18 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: .72, duration: .62, ease: [0.22, 1, 0.36, 1] }}>
        <span>WEBP</span><strong>95%</strong><small>Pronto para usar</small>
      </motion.div>
      <div className="flow-line first" /><div className="flow-line second" />
      <span className="privacy-dot"><i /> Processamento local</span>
    </motion.div>
  );
}
