"use client";

import { CalendarDays, ExternalLink, LoaderCircle } from "lucide-react";
import { releasesUrl } from "@/lib/github-releases";
import { useGitHubReleases } from "@/lib/use-github-releases";

function ReleaseBody({ body }: { body: string }) {
  const lines = body.split("\n").map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return <p>Consulte os detalhes completos desta versão no GitHub.</p>;
  return <div className="release-body">{lines.map((line, index) => {
    if (line.startsWith("## ")) return <h3 key={index}>{line.slice(3)}</h3>;
    if (/^[-*] /.test(line)) return <p className="release-item" key={index}><span>✓</span>{line.slice(2)}</p>;
    if (line.startsWith("# ")) return null;
    return <p key={index}>{line.replaceAll("**", "")}</p>;
  })}</div>;
}

export function ReleaseList() {
  const { releases, loading } = useGitHubReleases();
  if (loading) return <div className="changelog-state"><LoaderCircle className="size-5 animate-spin" />Buscando versões publicadas…</div>;
  if (!releases.length) return <div className="changelog-state">Não foi possível carregar o changelog agora. <a href={releasesUrl}>Ver no GitHub</a></div>;

  return <div className="release-list">{releases.map((release, index) => <article className="release-card" key={release.tag}>
    <div className="release-rail"><span>{index === 0 ? "ATUAL" : "VERSÃO"}</span><i /></div>
    <div className="release-card-content">
      <header><div><span className="release-tag">{release.tag}</span><h2>{release.name}</h2></div><time dateTime={release.publishedAt}><CalendarDays className="size-3.5" />{release.publishedAt ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(release.publishedAt)) : "Data indisponível"}</time></header>
      <ReleaseBody body={release.body} />
      <a className="release-source" href={release.url} target="_blank" rel="noreferrer">Ver release e downloads <ExternalLink className="size-3.5" /></a>
    </div>
  </article>)}</div>;
}
