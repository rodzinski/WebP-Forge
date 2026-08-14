export type ImageFormatGuide = {
  slug: string;
  name: string;
  label: string;
  summary: string;
  idealFor: string;
  compression: string;
  transparency: string;
  animation: string;
  strengths: string[];
  limitations: string[];
  recommendation: string;
};

export const imageFormats: ImageFormatGuide[] = [
  {
    slug: "webp", name: "WebP", label: "Equilíbrio para a web",
    summary: "Formato moderno e versátil para fotografias, interfaces e imagens com transparência.",
    idealFor: "Sites, lojas virtuais e aplicativos", compression: "Com e sem perdas", transparency: "Sim", animation: "Sim",
    strengths: ["Boa relação entre qualidade e tamanho", "Aceita transparência", "Pode substituir JPG, PNG e GIF em muitos fluxos"],
    limitations: ["Ferramentas muito antigas podem não oferecer suporte completo", "Arquivos sem perdas nem sempre serão menores que PNG"],
    recommendation: "É a escolha padrão mais equilibrada quando o destino principal é a web.",
  },
  {
    slug: "avif", name: "AVIF", label: "Compressão avançada",
    summary: "Formato de alta eficiência indicado quando reduzir o tamanho final é prioridade.",
    idealFor: "Fotografias e páginas focadas em desempenho", compression: "Com e sem perdas", transparency: "Sim", animation: "Sim",
    strengths: ["Excelente eficiência em fotografias", "Suporta transparência e alta profundidade de cor", "Pode preservar boa qualidade em arquivos pequenos"],
    limitations: ["Codificação normalmente mais lenta", "Compatibilidade com editores antigos é mais limitada"],
    recommendation: "Use quando cada quilobyte importa e o ambiente de destino oferece suporte a AVIF.",
  },
  {
    slug: "png", name: "PNG", label: "Precisão sem perdas",
    summary: "Formato confiável para interfaces, ilustrações, capturas de tela e transparência.",
    idealFor: "Logotipos, UI, gráficos e imagens técnicas", compression: "Sem perdas", transparency: "Sim", animation: "Não no PNG tradicional",
    strengths: ["Preserva os pixels sem perdas", "Transparência amplamente suportada", "Ótimo para textos, linhas e áreas de cor sólida"],
    limitations: ["Fotografias geralmente ficam maiores", "Não é a melhor opção quando tamanho mínimo é prioridade"],
    recommendation: "Prefira PNG quando fidelidade exata e transparência forem mais importantes que o tamanho.",
  },
  {
    slug: "jpg", name: "JPG", label: "Compatibilidade universal",
    summary: "Formato tradicional e amplamente compatível para fotografias sem transparência.",
    idealFor: "Fotos, documentos e sistemas legados", compression: "Com perdas", transparency: "Não", animation: "Não",
    strengths: ["Compatibilidade muito ampla", "Arquivos pequenos para fotografias", "Fluxos de edição e publicação consolidados"],
    limitations: ["Não possui transparência", "Recompressões sucessivas degradam a imagem", "Pode criar artefatos em textos e bordas"],
    recommendation: "Use JPG quando compatibilidade máxima for obrigatória e transparência não for necessária.",
  },
  {
    slug: "gif", name: "GIF", label: "Animações simples",
    summary: "Formato clássico para animações curtas e gráficos com uma paleta limitada.",
    idealFor: "Animações simples e compatibilidade legada", compression: "Sem perdas com paleta limitada", transparency: "Limitada", animation: "Sim",
    strengths: ["Animação amplamente reconhecida", "Reprodução previsível", "Adequado para gráficos simples com poucas cores"],
    limitations: ["Limitado a 256 cores por quadro", "Animações podem ficar muito maiores que alternativas modernas", "Transparência sem suavidade parcial"],
    recommendation: "Mantenha GIF por compatibilidade; para novos projetos, avalie WebP animado.",
  },
  {
    slug: "ico", name: "ICO", label: "Ícones do Windows",
    summary: "Contêiner usado para reunir ícones em diferentes tamanhos para Windows e aplicativos.",
    idealFor: "Executáveis, atalhos e ícones de aplicativos", compression: "Varia conforme a imagem interna", transparency: "Sim", animation: "Não",
    strengths: ["Pode armazenar várias resoluções no mesmo arquivo", "Integração nativa com o Windows", "Suporta ícones com transparência"],
    limitations: ["Não é indicado para imagens comuns", "A qualidade depende das resoluções incluídas"],
    recommendation: "Use ICO somente para ícones e inclua tamanhos adequados ao contexto do aplicativo.",
  },
];

export function getImageFormat(slug: string) {
  return imageFormats.find((format) => format.slug === slug);
}
