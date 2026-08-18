export type GitHubRelease = {
  tag: string;
  name: string;
  body: string;
  publishedAt: string;
  url: string;
};

type GitHubReleaseResponse = {
  tag_name?: unknown;
  name?: unknown;
  body?: unknown;
  published_at?: unknown;
  html_url?: unknown;
  draft?: unknown;
  prerelease?: unknown;
};

export const releasesUrl = "https://github.com/rodzinski/WebP-Forge/releases";
export const releasesApiUrl = "https://api.github.com/repos/rodzinski/WebP-Forge/releases?per_page=10";

function publishedAtTimestamp(release: GitHubRelease): number {
  const timestamp = Date.parse(release.publishedAt);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function parseReleases(value: unknown): GitHubRelease[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry: unknown) => {
    if (!entry || typeof entry !== "object") return [];
    const item = entry as GitHubReleaseResponse;
    if (item.draft === true || item.prerelease === true || typeof item.tag_name !== "string" || typeof item.html_url !== "string") return [];
    return [{
      tag: item.tag_name.replace(/^v\./i, "v"),
      name: typeof item.name === "string" && item.name.trim() ? item.name : item.tag_name,
      body: typeof item.body === "string" ? item.body : "",
      publishedAt: typeof item.published_at === "string" ? item.published_at : "",
      url: item.html_url,
    }];
  }).sort((left, right) => publishedAtTimestamp(right) - publishedAtTimestamp(left));
}
