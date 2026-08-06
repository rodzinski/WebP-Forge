export type ConversionSettings = {
  width: number;
  height: number;
  quality: number;
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
  theme: "system",
};

export const conversionPresets: readonly ConversionPreset[] = [
  { id: "icon", name: "Ícone", description: "Interfaces e aplicativos", width: 128, height: 128, quality: 95 },
  { id: "avatar", name: "Avatar", description: "Perfis com alta definição", width: 512, height: 512, quality: 92 },
  { id: "commerce", name: "E-commerce", description: "Produtos e catálogos", width: 1200, height: 1200, quality: 90 },
  { id: "social", name: "Social", description: "Publicações quadradas", width: 1080, height: 1080, quality: 90 },
];
