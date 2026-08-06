import { Check, FilePlus2, Settings2, Download } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const steps = [
  { number: "01", icon: FilePlus2, title: "Adicione", copy: "Arraste imagens ou selecione uma pasta inteira." },
  { number: "02", icon: Settings2, title: "Configure", copy: "Defina dimensões e qualidade para todo o lote." },
  { number: "03", icon: Download, title: "Converta", copy: "Escolha o formato e baixe cada imagem ou um ZIP completo." },
];

export function FeatureSteps() {
  return (
    <section className="steps-section" id="como-funciona">
      <Reveal className="steps-intro"><span className="section-kicker">Como funciona</span><h2>Três passos.<br />Nenhuma surpresa.</h2><div className="step-checks"><span><Check /> Transparência preservada</span><span><Check /> Sem distorção</span><span><Check /> Nomes mantidos</span></div></Reveal>
      <Stagger className="steps-list">{steps.map(({ number, icon: Icon, title, copy }) => <StaggerItem className="step-row" key={number}><span className="step-number">{number}</span><div className="step-icon"><Icon /></div><div><h3>{title}</h3><p>{copy}</p></div></StaggerItem>)}</Stagger>
    </section>
  );
}
