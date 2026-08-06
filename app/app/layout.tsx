import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conversor de imagens — WebP Forge",
  description: "Converta imagens em lote para WebP, AVIF, PNG, JPG e ICO diretamente no navegador.",
};

export default function ConverterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
