import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircleHeart } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import { SiteFooter } from "@/components/landing/site-footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Feedback — WebP Forge",
  description: "Compartilhe ideias, problemas e sugestões para ajudar a melhorar o WebP Forge.",
};

export default function FeedbackPage() {
  return <main className="feedback-page">
    <header className="legal-header">
      <Link href="/" className="site-brand"><BrandMark size={34} priority /><span>WebP Forge</span></Link>
      <Button asChild size="sm" variant="ghost"><Link href="/"><ArrowLeft className="size-3.5" />Voltar ao site</Link></Button>
    </header>
    <section className="feedback-hero">
      <span className="section-kicker"><MessageCircleHeart className="size-3.5" /> CONSTRUÍDO COM VOCÊ</span>
      <h1>Sua experiência.<br /><em>Nosso próximo passo.</em></h1>
      <p>Encontrou um problema ou imaginou uma forma melhor de fazer algo? Queremos ouvir.</p>
    </section>
    <FeedbackForm />
    <SiteFooter />
  </main>;
}
