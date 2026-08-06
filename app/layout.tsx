import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const bodyFont = Manrope({ variable: "--font-body", subsets: ["latin"] });
const displayFont = Space_Grotesk({ variable: "--font-display", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const title = "WebP Forge — Conversor de imagens privado";
  const description = "Converta imagens em lote para WebP, AVIF, PNG, JPG e ICO com processamento privado no navegador.";
  return {
    title, description, metadataBase: base,
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      shortcut: "/favicon.svg",
      apple: "/favicon.svg",
    },
    manifest: "/manifest.webmanifest",
    openGraph: { title, description, type: "website", url: base, images: [{ url: new URL("/og-home.png", base).toString(), width: 1672, height: 941, alt: "WebP sem upload — rápido por design e privado por arquitetura" }] },
    twitter: { card: "summary_large_image", title, description, images: [new URL("/og-home.png", base).toString()] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${bodyFont.variable} ${displayFont.variable}`}>{children}</body></html>;
}
