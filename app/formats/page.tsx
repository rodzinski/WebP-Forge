import type { Metadata } from "next";
import { BookOpen, Sparkles } from "lucide-react";
import { FormatCard } from "@/components/formats/format-card";
import { FormatComparison } from "@/components/formats/format-comparison";
import { FormatShell } from "@/components/formats/format-shell";
import { imageFormats } from "@/lib/image-formats";

export const metadata: Metadata = { title: "Guia de formatos de imagem — WebP Forge", description: "Compare WebP, AVIF, PNG, JPG, GIF e ICO e escolha o formato ideal para cada projeto." };

export default function FormatsPage() {
  return <FormatShell>
    <section className="formats-hero"><span className="section-kicker"><BookOpen className="size-3.5" /> GUIA DE FORMATOS</span><h1>O formato certo.<br /><em>Para cada imagem.</em></h1><p>Entenda as diferenças práticas entre qualidade, tamanho, transparência e compatibilidade antes de converter.</p></section>
    <section className="formats-index"><div className="formats-heading"><span><Sparkles className="size-4" />ESCOLHA COM CONFIANÇA</span><h2>Compare antes de converter.</h2></div><div className="formats-grid">{imageFormats.map((format, index) => <FormatCard format={format} index={index} key={format.slug} />)}</div></section>
    <section className="formats-comparison"><div><span className="section-kicker">VISÃO RÁPIDA</span><h2>Todos lado a lado.</h2><p>Uma comparação direta para orientar a escolha inicial. O resultado ideal ainda depende do conteúdo e do destino da imagem.</p></div><FormatComparison /></section>
  </FormatShell>;
}
