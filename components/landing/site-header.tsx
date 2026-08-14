import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";

const navigation = [
  { href: "/#recursos", label: "Recursos" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#windows", label: "Windows" },
  { href: "/formats", label: "Guias" },
  { href: "/changelog", label: "Changelog" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="site-brand" aria-label="WebP Forge — Página inicial">
        <BrandMark size={34} priority />
        <span>WebP Forge</span>
      </Link>
      <nav aria-label="Navegação principal">{navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}</nav>
      <Button asChild size="sm" variant="primary"><Link href="/app">Abrir conversor <ArrowUpRight className="size-3.5" /></Link></Button>
    </header>
  );
}
