"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = { children: ReactNode; className?: string; delay?: number; once?: boolean };

export function Reveal({ children, className, delay = 0, once = true }: RevealProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div className={cn(className)} initial={reduceMotion ? false : { opacity: 0, y: 22, filter: "blur(8px)" }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once, amount: 0.2, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
  );
}

export function HeroReveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();
  return <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 20, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: .7, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: .18 }} variants={{ hidden: {}, show: { transition: { staggerChildren: reduceMotion ? 0 : .08 } } }}>{children}</motion.div>;
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: .5, ease: [0.22, 1, 0.36, 1] } } }}>{children}</motion.div>;
}
