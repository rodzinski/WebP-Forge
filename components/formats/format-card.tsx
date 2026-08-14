import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ImageFormatGuide } from "@/lib/image-formats";

export function FormatCard({ format, index }: { format: ImageFormatGuide; index: number }) {
  return <Link className="format-card" href={`/formats/${format.slug}`}>
    <header><span>{String(index + 1).padStart(2, "0")}</span><i>.{format.name.toLowerCase()}</i></header>
    <div><strong>{format.name}</strong><small>{format.label}</small></div>
    <p>{format.summary}</p>
    <footer><span>{format.compression}</span><ArrowUpRight className="size-4" /></footer>
  </Link>;
}
