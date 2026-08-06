import { Archive, EyeOff, Gauge, Image as ImageIcon, Layers3, Maximize2 } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const smallCards = [
  { icon: Layers3, title: "Lotes sem limite artificial", copy: "Adicione dezenas ou centenas de imagens e acompanhe cada conversão." },
  { icon: Maximize2, title: "Proporção preservada", copy: "Redimensionamento inteligente, centralizado e sem qualquer distorção." },
  { icon: Archive, title: "Um ZIP, tudo pronto", copy: "Baixe arquivos individuais ou todo o lote em um único pacote." },
];

export function BentoGrid() {
  return (
    <section className="section-block" id="recursos">
      <Reveal className="section-heading"><span className="section-kicker">Feito para o trabalho real</span><h2>Menos etapas.<br />Mais imagens prontas.</h2><p>Um fluxo deliberadamente simples, com decisões técnicas que preservam qualidade, privacidade e tempo.</p></Reveal>
      <Stagger className="bento-grid">
        <StaggerItem className="bento-card bento-private">
          <div className="bento-icon"><EyeOff className="size-5" /></div><span className="mini-label">PRIVACIDADE</span><h3>Seus arquivos nunca saem do dispositivo.</h3><p>Não existe upload, armazenamento temporário ou fila externa. A conversão acontece no seu navegador.</p>
          <div className="privacy-orbit"><span /><i>0 bytes enviados</i></div>
        </StaggerItem>
        <StaggerItem className="bento-card bento-quality">
          <div className="quality-meter"><div><Gauge className="size-5" /><span>Qualidade WebP</span></div><strong>95<small>%</small></strong><i><b /></i></div>
          <h3>Qualidade sob seu controle.</h3><p>Ajuste compressão e dimensões com feedback instantâneo.</p>
        </StaggerItem>
        <StaggerItem className="bento-card bento-format">
          <ImageIcon className="size-6" /><div className="format-cloud"><span>PNG</span><span>JPG</span><span>AVIF</span><span>JFIF</span><span>GIF</span><span>BMP</span></div><h3>Um destino.<br />Múltiplas origens.</h3>
        </StaggerItem>
        {smallCards.map(({ icon: Icon, title, copy }) => <StaggerItem className="bento-card bento-small" key={title}><div className="bento-icon"><Icon className="size-5" /></div><h3>{title}</h3><p>{copy}</p></StaggerItem>)}
      </Stagger>
    </section>
  );
}
