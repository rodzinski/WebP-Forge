import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { href: "#recursos", label: "Recursos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#precos", label: "Preços" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="site-brand" aria-label="WebP Forge — Página inicial">
        <Image src="/icon.png" alt="" width={34} height={34} priority />
        <span>WebP Forge</span>
      </Link>
      <nav aria-label="Navegação principal">{navigation.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}</nav>
      <Button asChild size="sm" variant="primary"><Link href="/app">Abrir conversor <ArrowUpRight className="size-3.5" /></Link></Button>
    </header>
  );
}
