import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { ReleaseVersion } from "@/components/release-version";
import { AnalyticsPreferencesButton } from "@/components/analytics/analytics-preferences-button";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <Link href="/" className="site-brand" aria-label="WebP Forge — Página inicial">
          <BrandMark size={30} />
          <span>WebP Forge</span>
        </Link>
        <p>
          Uma ferramenta simples para deixar imagens mais leves, consistentes e
          prontas para produção.
        </p>
        <div className="footer-links">
          <div>
            <strong>Produto</strong>
            <Link href="/app">Conversor</Link>
            <Link href="/#windows">Aplicativo Windows</Link>
            <Link href="/#recursos">Recursos</Link>
            <Link href="/#precos">Preços</Link>
            <Link href="/changelog">Changelog</Link>
            <Link href="/roadmap">Roadmap</Link>
            <Link href="/formats">Guia de formatos</Link>
          </div>
          <div>
            <strong>Informações</strong>
            <Link href="/#faq">FAQ</Link>
            <Link href="/privacy">Política de Privacidade</Link>
            <Link href="/feedback">Enviar feedback</Link>
            <Link href="/support">Apoie o projeto</Link>
            <AnalyticsPreferencesButton />
            <span>Aplicativo <ReleaseVersion /></span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} WebP Forge</span>
        <span>Feito para a web moderna.</span>
      </div>
    </footer>
  );
}
