import { GitHubRelease, GitHubRepoMeta } from '../types';
import { 
  FALLBACK_REPO_META, 
  GITHUB_API_BASE 
} from '../data/kaspaData';

const LATEST_CACHE_KEY = 'kaspa_latest_release_v4';

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

function getStoredLatest(): GitHubRelease | null {
  try {
    const raw = localStorage.getItem(LATEST_CACHE_KEY);
    if (raw) {
      const parsed: GitHubRelease = JSON.parse(raw);
      if (parsed && parsed.tag_name) return parsed;
    }
  } catch (e) {
    // Ignore storage
  }
  return null;
}

function storeLatest(release: GitHubRelease) {
  try {
    localStorage.setItem(LATEST_CACHE_KEY, JSON.stringify(release));
  } catch (e) {
    // Ignore storage
  }
}

/**
 * Fetches the freshest release directly from GitHub API.
 * Uses /releases instead of /releases/latest for better consistency.
 * Always respects the live API result first.
 */
export async function fetchLatestRelease(): Promise<GitHubRelease | null> {
  try {
    // Using /releases/latest is more direct and returns only the single latest stable release
    const response = await fetch(`${GITHUB_API_BASE}/releases/latest`, {
      method: 'GET',
      headers: { 
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.status === 403) {
      const stored = getStoredLatest();
      if (stored) {
        console.warn('GitHub API Rate Limit reached (403). Using cached release:', stored.tag_name);
        return stored;
      }
      return null;
    }

    if (response.ok) {
      const latest: GitHubRelease = await response.json();
      if (latest && latest.tag_name) {
        storeLatest(latest);
        return latest;
      }
    }

    return getStoredLatest();
  } catch (err) {
    console.debug('GitHub API fetch failed (network error), using cache:', err);
    return getStoredLatest();
  }
}

export async function fetchRepoMetadata(): Promise<GitHubRepoMeta> {
  try {
    const response = await fetch(GITHUB_API_BASE, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.status === 403 || !response.ok) {
       return FALLBACK_REPO_META;
    }

    const data: GitHubRepoMeta = await response.json();
    return data;
  } catch (err) {
    console.debug('GitHub API repo metadata fetch failed, using fallback:', err);
    return FALLBACK_REPO_META;
  }
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
  const tagName = release.tag_name;
  let extractedSha = '';

  if (release.body) {
    const shaMatch = release.body.match(/[a-fA-F0-9]{64}/);
    if (shaMatch) {
      extractedSha = shaMatch[0].toLowerCase();
    }
  }

  // 1. First priority: Look for signed APK asset in the release payload
  if (release.assets && release.assets.length > 0) {
    const signedApk = release.assets.find(a => 
      a.name.toLowerCase().endsWith('.apk') && a.name.toLowerCase().includes('signed')
    );
    if (signedApk && signedApk.browser_download_url) {
      return {
        ...signedApk,
        digest: signedApk.digest || (extractedSha ? `sha256:${extractedSha}` : undefined)
      };
    }

    // 2. Second priority: Any .apk asset attached to this release
    const anyApk = release.assets.find(a => a.name.toLowerCase().endsWith('.apk'));
    if (anyApk && anyApk.browser_download_url) {
      return {
        ...anyApk,
        digest: anyApk.digest || (extractedSha ? `sha256:${extractedSha}` : undefined)
      };
    }
  }

  // 3. Direct mapping to GitHub release tag download route
  return {
    name: 'KaspaBrowser-release-signed.apk',
    browser_download_url: `https://github.com/Curious-being99/Kaspa-browser-/releases/download/${tagName}/KaspaBrowser-release-signed.apk`,
    size: release.assets?.[0]?.size || 0,
    digest: extractedSha ? `sha256:${extractedSha}` : undefined
  };
}

export function triggerBrowserDownload(url: string, filename?: string) {
  // Direct hidden anchor triggering single download instance
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'KaspaBrowser-release-signed.apk';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    if (document.body.contains(link)) document.body.removeChild(link);
  }, 1000);
}

