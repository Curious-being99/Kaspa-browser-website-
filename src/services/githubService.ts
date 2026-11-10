import { GitHubRelease, GitHubRepoMeta } from '../types';
import { GITHUB_API_BASE } from '../data/kaspaData';

/**
 * Extracts a normalized Unix epoch millisecond timestamp from a release.
 */
export function getReleaseTimestamp(release?: GitHubRelease | null): number {
  if (!release) return 0;
  if (release.published_at) {
    const t = new Date(release.published_at).getTime();
    if (!isNaN(t) && t > 0) return t;
  }
  if (release.created_at) {
    const t = new Date(release.created_at).getTime();
    if (!isNaN(t) && t > 0) return t;
  }
  if (release.tag_name) {
    const match = release.tag_name.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
    if (match) {
      const [_, year, month, day, hour, min, sec] = match;
      const t = Date.UTC(+year, +month - 1, +day, +hour, +min, +sec);
      if (!isNaN(t) && t > 0) return t;
    }
  }
  return release.id || 0;
}

/**
 * Returns true if candidate is strictly newer than current
 */
export function isNewerRelease(candidate: GitHubRelease, current: GitHubRelease): boolean {
  return getReleaseTimestamp(candidate) > getReleaseTimestamp(current);
}

/**
 * Fetches the absolute latest release directly from GitHub API.
 * Strictly returns only the latest release with no fallback or stale cache.
 */
function isUsableRelease(value: unknown): value is GitHubRelease {
  if (!value || typeof value !== 'object') return false;
  const release = value as GitHubRelease & { draft?: boolean };
  return typeof release.tag_name === 'string' && release.tag_name.length > 0 &&
    release.draft !== true && release.prerelease !== true && Array.isArray(release.assets);
}

export async function fetchLatestRelease(): Promise<GitHubRelease | null> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}?path=releases/latest&_t=${Date.now()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 
        'Accept': 'application/vnd.github.v3+json',
        'Cache-Control': 'no-cache'
      }
    });

    if (response.ok && (response.headers.get('content-type') || '').includes('json')) {
      const latest: GitHubRelease = await response.json();
      if (isUsableRelease(latest)) return latest;
    }
  } catch (err) {
    console.debug('Server API /api/github failed, attempting direct GitHub fetch:', err);
  }

  // Direct client-side fallback
  try {
    const directRes = await fetch(`https://api.github.com/repos/Curious-being99/Kaspa-browser-/releases/latest?_t=${Date.now()}`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (directRes.ok) {
      const latest: GitHubRelease = await directRes.json();
      if (isUsableRelease(latest)) return latest;
    }
  } catch (e) {
    console.error('Direct GitHub release fetch failed:', e);
  }

  return null;
}

export async function fetchRepoMetadata(): Promise<GitHubRepoMeta | null> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}?path=&_t=${Date.now()}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.ok && (response.headers.get('content-type') || '').includes('json')) {
      const data: GitHubRepoMeta = await response.json();
      if (data && data.name) return data;
    }
  } catch (err) {
    console.debug('Server API /api/github meta fetch failed, using direct fallback:', err);
  }

  try {
    const directRes = await fetch('https://api.github.com/repos/Curious-being99/Kaspa-browser-', {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (directRes.ok) {
      const data: GitHubRepoMeta = await directRes.json();
      if (data && data.name) return data;
    }
  } catch (e) {
    // Ignore
  }

  return null;
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getPreferredDownloadAsset(release: GitHubRelease) {
  const expectedPath = `/Curious-being99/Kaspa-browser-/releases/download/${encodeURIComponent(release.tag_name)}/KaspaBrowser-release-signed.apk`;
  const asset = release.assets?.find(candidate => {
    if (candidate.name !== 'KaspaBrowser-release-signed.apk' || typeof candidate.browser_download_url !== 'string') return false;
    try {
      const url = new URL(candidate.browser_download_url);
      return url.protocol === 'https:' && url.hostname === 'github.com' && url.pathname === expectedPath;
    } catch {
      return false;
    }
  });
  if (!asset) return null;

  const digest = typeof asset.digest === 'string' && /^sha256:[a-fA-F0-9]{64}$/.test(asset.digest)
    ? asset.digest.toLowerCase()
    : undefined;

  return { ...asset, digest };
}

