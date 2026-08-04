import dynamic from "next/dynamic";
import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { ProofStrip } from "@/components/landing/proof-strip";
import { BentoGrid } from "@/components/landing/bento-grid";
import { FeatureSteps } from "@/components/landing/feature-steps";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { SiteFooter } from "@/components/landing/site-footer";

const InteractiveDemo = dynamic(() => import("@/components/landing/interactive-demo"), {
  loading: () => <div className="demo-loading" aria-hidden="true" />,
});

export default function HomePage() {
  return (
    <main className="landing-page">
      <SiteHeader />
      <Hero />
      <ProofStrip />
      <BentoGrid />
      <FeatureSteps />
      <InteractiveDemo />
      <Testimonials />
      <Pricing />
      <Faq />
      <FinalCta />
      <SiteFooter />
    </main>
  );
}
