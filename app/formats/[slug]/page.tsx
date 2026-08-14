import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, CircleAlert } from "lucide-react";
import { notFound } from "next/navigation";
import { FormatShell } from "@/components/formats/format-shell";
import { Button } from "@/components/ui/button";
import { getImageFormat, imageFormats } from "@/lib/image-formats";

type FormatPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return imageFormats.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: FormatPageProps): Promise<Metadata> {
  const format = getImageFormat((await params).slug);
  return format ? { title: `${format.name}: guia de formato — WebP Forge`, description: format.summary } : {};
}

export default async function FormatPage({ params }: FormatPageProps) {
  const format = getImageFormat((await params).slug);
  if (!format) notFound();
  return <FormatShell backHref="/formats" backLabel="Todos os formatos">
    <section className="format-detail-hero"><span className="format-extension">.{format.slug}</span><div><span className="section-kicker">GUIA PRÁTICO</span><h1>{format.name}</h1><p>{format.summary}</p></div></section>
    <section className="format-facts"><div><span>COMPRESSÃO</span><strong>{format.compression}</strong></div><div><span>TRANSPARÊNCIA</span><strong>{format.transparency}</strong></div><div><span>ANIMAÇÃO</span><strong>{format.animation}</strong></div></section>
    <section className="format-detail-grid"><div className="format-copy"><span className="section-kicker">QUANDO USAR</span><h2>{format.idealFor}</h2><p>{format.recommendation}</p><Button asChild variant="accent" size="lg"><Link href="/app">Converter imagens <ArrowRight className="size-4" /></Link></Button></div><div className="format-pros-cons"><article><header><Check className="size-4" />Pontos fortes</header>{format.strengths.map((item) => <p key={item}>{item}</p>)}</article><article><header><CircleAlert className="size-4" />Limitações</header>{format.limitations.map((item) => <p key={item}>{item}</p>)}</article></div></section>
  </FormatShell>;
}
