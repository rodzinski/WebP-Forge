"use client";

import { useEffect, useState } from "react";
import { type GitHubRelease, parseReleases, releasesApiUrl } from "@/lib/github-releases";

const cacheKey = "webp-forge-public-releases-v2";
const cacheDuration = 60 * 60 * 1000;
let request: Promise<GitHubRelease[]> | undefined;

type CachedReleases = { storedAt: number; releases: GitHubRelease[] };

function readCache(): GitHubRelease[] | undefined {
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) ?? "null") as CachedReleases | null;
    return cached && Date.now() - cached.storedAt < cacheDuration ? cached.releases : undefined;
  } catch { return undefined; }
}

async function loadReleases(): Promise<GitHubRelease[]> {
  const cached = readCache();
  if (cached) return cached;
  request ??= fetch(releasesApiUrl, { headers: { Accept: "application/vnd.github+json" } })
    .then(async (response) => {
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
      const releases = parseReleases(await response.json());
      localStorage.setItem(cacheKey, JSON.stringify({ storedAt: Date.now(), releases } satisfies CachedReleases));
      return releases;
    })
    .finally(() => { request = undefined; });
  return request;
}

export function useGitHubReleases() {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    loadReleases().then((items) => { if (active) setReleases(items); }).catch(() => undefined).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return { releases, loading };
}
