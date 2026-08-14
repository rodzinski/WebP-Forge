"use client";

import { releasesUrl } from "@/lib/github-releases";
import { useGitHubReleases } from "@/lib/use-github-releases";

export function ReleaseVersion({ className }: { className?: string }) {
  const { releases, loading } = useGitHubReleases();
  const label = releases[0]?.tag ?? (loading ? "Verificando versão…" : "Ver releases");
  return <a className={className} href={releases[0]?.url ?? releasesUrl} target="_blank" rel="noreferrer">{label}</a>;
}
