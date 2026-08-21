import { Check, CircleDot, Clock3, Code2, FileText, HeartHandshake, PackageCheck, Palette, Store } from "lucide-react";

const columns = [
  {
    status: "Entregue",
    tone: "done",
    icon: Check,
    description: "Recursos disponíveis nas versões atuais.",
    items: [
      { title: "Conversão multiformato", detail: "WebP, AVIF, PNG, JPG e ICO no desktop e na web." },
      { title: "Experiência para grandes lotes", detail: "Fila virtualizada, concorrência adaptativa, relatórios e histórico local." },
      { title: "Exportação de histórico", detail: "Relatórios locais em PDF, XLSX e CSV no aplicativo Windows.", icon: FileText },
      { title: "Windows para mais dispositivos", detail: "Versões portátil, instalável, x64 e ARM64." },
      { title: "Atualizações pelo instalador", detail: "Detecção da versão existente com opções para atualizar ou desinstalar.", icon: PackageCheck },
      { title: "Produto aberto à comunidade", detail: "Changelog, analytics opcional, guias e canal de feedback." },
      { title: "Distribuição pela Microsoft Store", detail: "Aplicativo certificado, assinado e disponível oficialmente na Store.", icon: Store },
      { title: "Apoio ao projeto", detail: "GitHub Sponsors disponível para contribuições opcionais sem limitar os recursos gratuitos.", icon: HeartHandshake },
    ],
  },
  {
    status: "Em andamento",
    tone: "active",
    icon: CircleDot,
    description: "Trabalho ativo e validações externas.",
    items: [
      { title: "Consistência visual", detail: "Revisão ampla de estilos, estados, temas e acessibilidade.", icon: Palette },
    ],
  },
  {
    status: "Explorando",
    tone: "future",
    icon: Clock3,
    description: "Direções avaliadas para ciclos futuros.",
    items: [
      { title: "Suporte a PDF", detail: "Importação e conversão de páginas com controles de qualidade.", icon: FileText },
      { title: "API e SDK", detail: "Motor de conversão acessível a outros produtos e desenvolvedores.", icon: Code2 },
    ],
  },
] as const;

export function RoadmapBoard() {
  return <section className="roadmap-board" aria-label="Etapas do roadmap">
    {columns.map((column) => {
      const StatusIcon = column.icon;
      return <article className={`roadmap-column roadmap-${column.tone}`} key={column.status}>
        <header><span><StatusIcon className="size-3.5" />{column.status}</span><p>{column.description}</p></header>
        <div>{column.items.map((item) => {
          const ItemIcon = "icon" in item ? item.icon : undefined;
          return <section className="roadmap-item" key={item.title}>
            {ItemIcon && <ItemIcon className="size-4" />}
            <div><h3>{item.title}</h3><p>{item.detail}</p></div>
          </section>;
        })}</div>
      </article>;
    })}
  </section>;
}
