import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";

const questions = [
  { question: "Minhas imagens são enviadas para algum servidor?", answer: "Não. A leitura, o redimensionamento e a codificação WebP acontecem integralmente no navegador. O servidor entrega apenas a interface da aplicação." },
  { question: "A imagem fica distorcida ao chegar em 128 × 128?", answer: "Não. O WebP Forge mantém a proporção original, centraliza a imagem e preenche o espaço restante com transparência quando necessário." },
  { question: "Quais formatos são aceitos?", answer: "A versão web aceita PNG, JPG, JPEG, JFIF, WebP, AVIF, GIF e BMP quando suportados pelo navegador. GIFs usam o primeiro quadro para conversão." },
  { question: "Existe limite de imagens por lote?", answer: "Não impomos um limite artificial. A capacidade prática depende da memória disponível no dispositivo e do tamanho dos arquivos selecionados." },
  { question: "Funciona em celular e tablet?", answer: "Sim. A interface é responsiva e a conversão utiliza APIs disponíveis nos navegadores modernos. Em lotes muito grandes, computadores continuam oferecendo mais memória e desempenho." },
];

export function Faq() {
  return <section className="faq-section" id="faq"><Reveal className="faq-heading"><span className="section-kicker">FAQ</span><h2>Perguntas frequentes.</h2></Reveal><Reveal className="faq-list" delay={.08}><Accordion type="single" collapsible>{questions.map(({ question, answer }, index) => <AccordionItem value={`item-${index}`} key={question}><AccordionTrigger>{question}</AccordionTrigger><AccordionContent>{answer}</AccordionContent></AccordionItem>)}</Accordion></Reveal></section>;
}
