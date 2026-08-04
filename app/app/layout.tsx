import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conversor WebP — WebP Forge",
  description: "Converta imagens em lote para WebP diretamente no navegador.",
};

export default function ConverterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
