export type ConversionSettings = {
  width: number;
  height: number;
  quality: number;
  fitMode: "contain" | "crop" | "stretch";
  outputFormat: "webp" | "avif" | "png" | "jpg" | "ico";
  theme: "system" | "light" | "dark";
};

export type ConversionPreset = {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  quality: number;
};

export const defaultSettings: ConversionSettings = {
  width: 128,
  height: 128,
  quality: 95,
  fitMode: "contain",
  outputFormat: "webp",
  theme: "system",
};

export const conversionPresets: readonly ConversionPreset[] = [
  { id: "icon", name: "Ícone", description: "Interfaces e aplicativos", width: 128, height: 128, quality: 95 },
  { id: "avatar", name: "Avatar", description: "Perfis com alta definição", width: 512, height: 512, quality: 92 },
  { id: "commerce", name: "E-commerce", description: "Produtos e catálogos", width: 1200, height: 1200, quality: 90 },
  { id: "social", name: "Social", description: "Publicações quadradas", width: 1080, height: 1080, quality: 90 },
];

export const fitModeOptions: readonly { value: ConversionSettings["fitMode"]; name: string; description: string }[] = [
  { value: "contain", name: "Conter", description: "Mantém tudo e adiciona transparência." },
  { value: "crop", name: "Recortar", description: "Preenche a área e corta o excedente." },
  { value: "stretch", name: "Esticar", description: "Preenche exatamente e pode alterar a proporção." },
];

export const outputFormatOptions: readonly { value: ConversionSettings["outputFormat"]; name: string; description: string }[] = [
  { value: "webp", name: "WebP", description: "Qualidade e tamanho equilibrados." },
  { value: "avif", name: "AVIF", description: "Compressão moderna carregada sob demanda." },
  { value: "png", name: "PNG", description: "Sem perdas e com transparência." },
  { value: "jpg", name: "JPG", description: "Alta compatibilidade para fotografias." },
  { value: "ico", name: "ICO", description: "Ícones de até 256 × 256 pixels." },
];
