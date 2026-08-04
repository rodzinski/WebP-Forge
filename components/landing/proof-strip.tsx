import { Monitor, Cloud, Cpu, FileImage, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const capabilities = [
  { icon: Monitor, label: "Web APIs" }, { icon: Cloud, label: "Cloudflare" }, { icon: Cpu, label: "Processamento local" },
  { icon: FileImage, label: "WebP nativo" }, { icon: ShieldCheck, label: "Privacy-first" },
];

export function ProofStrip() {
  return <Reveal className="proof-strip"><p>Construído sobre tecnologia web moderna</p><div>{capabilities.map(({ icon: Icon, label }) => <span key={label}><Icon className="size-4" />{label}</span>)}</div></Reveal>;
}
