import { Check, Download, Gauge, MonitorDown, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { BrandMark } from "@/components/brand-mark";

const downloadUrl =
  "https://github.com/rodzinski/WebP-Forge/releases/latest/download/WebP-Forge-win-x64.zip";

const benefits = [
  "Conversão em lote sem limites",
  "Funciona completamente offline",
  "Nenhum arquivo sai do computador",
];

export function DesktopDownload() {
  return (
    <section className="desktop-section" id="windows">
      <Reveal className="desktop-copy">
        <span className="section-kicker"><MonitorDown className="size-3.5" /> Aplicativo para Windows</span>
        <h2>O mesmo Forge.<br />Agora no desktop.</h2>
        <p>Processe milhares de imagens em uma experiência nativa, rápida e disponível mesmo sem conexão com a internet.</p>
        <ul>{benefits.map((benefit) => <li key={benefit}><Check className="size-4" />{benefit}</li>)}</ul>
        <div className="desktop-actions">
          <Button asChild variant="accent" size="lg">
            <a href={downloadUrl} aria-label="Baixar WebP Forge para Windows x64"><Download className="size-4" /> Baixar para Windows</a>
          </Button>
          <a className="desktop-release-link" href="https://github.com/rodzinski/WebP-Forge/releases/latest" target="_blank" rel="noreferrer">Ver notas da versão <span aria-hidden="true">↗</span></a>
        </div>
        <span className="desktop-meta">Windows 10/11 · x64 · v1.11.0 · 82 MB</span>
      </Reveal>

      <Reveal className="desktop-preview" delay={0.1}>
        <div className="desktop-window-bar"><div><BrandMark size={24} /><strong>WebP Forge</strong></div><span>—　□　×</span></div>
        <div className="desktop-window-content">
          <div className="desktop-window-heading"><span>CONVERSÃO PRIVADA · SEM UPLOAD</span><strong>Imagens perfeitas.<br /><i>Prontas para a web.</i></strong></div>
          <div className="desktop-file-row"><div className="desktop-file-icon"><BrandMark size={24} /></div><div><strong>produto-final.png</strong><span>2048 × 2048 · 1.4 MB</span></div><span className="desktop-status">Pronto</span></div>
          <div className="desktop-conversion-bar"><div><ShieldCheck className="size-4" /><span>Processamento local</span></div><i><b /></i><span><Gauge className="size-4" /> WebP · 95%</span></div>
        </div>
      </Reveal>
    </section>
  );
}
