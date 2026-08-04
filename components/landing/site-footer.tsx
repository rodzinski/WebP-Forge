import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

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
            <a href="#recursos">Recursos</a>
            <a href="#precos">Preços</a>
          </div>
          <div>
            <strong>Informações</strong>
            <a href="#faq">FAQ</a>
            <span>Privacidade local</span>
            <span>Versão web 1.0</span>
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
