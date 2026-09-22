import { GitHubRelease, GitHubRepoMeta } from '../types';
import { 
  DEFAULT_LATEST_RELEASE, 
  FALLBACK_RELEASES, 
  FALLBACK_REPO_META, 
  GITHUB_API_BASE 
} from '../data/kaspaData';

const LATEST_CACHE_KEY = 'kaspa_latest_release_v3';
const ALL_RELEASES_CACHE_KEY = 'kaspa_all_releases_v3';

/**
 * Extracts a normalized Unix epoch millisecond timestamp from a release.
 * Correctly parses ISO strings as well as formatted tags like v1.0.20260922123310.
 */
export function getReleaseTimestamp(release?: GitHubRelease | null): number {
  if (!release) return 0;
  
  // 1. Try published_at
  if (release.published_at) {
    const t = new Date(release.published_at).getTime();
    if (!isNaN(t) && t > 0) return t;
  }

  // 2. Try created_at
  if (release.created_at) {
    const t = new Date(release.created_at).getTime();
    if (!isNaN(t) && t > 0) return t;
  }

  // 3. Parse tag timestamp e.g. v1.0.20260922123310 -> YYYY=2026, MM=09, DD=22, HH=12, mm=33, ss=10
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
    // Ignore storage errors in restricted contexts
  }
  return null;
}

function storeLatest(release: GitHubRelease) {
  try {
    localStorage.setItem(LATEST_CACHE_KEY, JSON.stringify(release));
  } catch (e) {
    // Ignore storage errors
  }
}

function getStoredAllReleases(): GitHubRelease[] | null {
  try {
    const raw = localStorage.getItem(ALL_RELEASES_CACHE_KEY);
    if (raw) {
      const parsed: GitHubRelease[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    // Ignore storage errors
  }
  return null;
}

function storeAllReleases(releases: GitHubRelease[]) {
  try {
    localStorage.setItem(ALL_RELEASES_CACHE_KEY, JSON.stringify(releases));
  } catch (e) {
    // Ignore storage errors
  }
}

/**
 * Fetches the freshest release directly from GitHub API.
 * Always respects the live API result first.
 */
export async function fetchLatestRelease(): Promise<GitHubRelease> {
  try {
    const timestamp = Date.now();
    
    // Concurrently fetch both /releases/latest and /releases list to ensure freshest release
    const [latestRes, listRes] = await Promise.allSettled([
      fetch(`${GITHUB_API_BASE}/releases/latest?_t=${timestamp}`, {
        cache: 'no-store',
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      }),
      fetch(`${GITHUB_API_BASE}/releases?_t=${timestamp}`, {
        cache: 'no-store',
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      })
    ]);

    let latestFromEndpoint: GitHubRelease | null = null;
    if (latestRes.status === 'fulfilled' && latestRes.value.ok) {
      latestFromEndpoint = await latestRes.value.json();
    }

    let newestFromList: GitHubRelease | null = null;
    if (listRes.status === 'fulfilled' && listRes.value.ok) {
      const releasesList: GitHubRelease[] = await listRes.value.json();
      if (releasesList && releasesList.length > 0) {
        const sorted = [...releasesList].sort((a, b) => getReleaseTimestamp(b) - getReleaseTimestamp(a));
        newestFromList = sorted[0];
        storeAllReleases(sorted);
      }
    }

    let liveNewest: GitHubRelease | null = null;
    if (latestFromEndpoint && newestFromList) {
      liveNewest = isNewerRelease(newestFromList, latestFromEndpoint) ? newestFromList : latestFromEndpoint;
    } else {
      liveNewest = newestFromList || latestFromEndpoint;
    }

    if (liveNewest) {
      storeLatest(liveNewest);
      return liveNewest;
    }

    // If live API returned empty (e.g. rate limit), use stored or default
    const stored = getStoredLatest();
    return stored || DEFAULT_LATEST_RELEASE;
  } catch (err) {
    console.debug('GitHub API live query failed, utilizing cached/default release:', err);
    const stored = getStoredLatest();
    return stored || DEFAULT_LATEST_RELEASE;
  }
}

/**
 * Fetches all releases directly from GitHub API.
 */
export async function fetchAllReleases(): Promise<GitHubRelease[]> {
  try {
    const timestamp = Date.now();
    const response = await fetch(`${GITHUB_API_BASE}/releases?_t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.ok) {
      const data: GitHubRelease[] = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        const sorted = [...data].sort((a, b) => getReleaseTimestamp(b) - getReleaseTimestamp(a));
        storeAllReleases(sorted);
        if (sorted[0]) storeLatest(sorted[0]);
        return sorted;
      }
    }

    const cachedAll = getStoredAllReleases();
    return cachedAll && cachedAll.length > 0 ? cachedAll : FALLBACK_RELEASES;
  } catch (err) {
    console.warn('GitHub API releases fetch failed, using cached/fallback:', err);
    const cachedAll = getStoredAllReleases();
    return cachedAll && cachedAll.length > 0 ? cachedAll : FALLBACK_RELEASES;
  }
}

export async function fetchRepoMetadata(): Promise<GitHubRepoMeta> {
  try {
    const response = await fetch(GITHUB_API_BASE, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      return FALLBACK_REPO_META;
    }

    const data: GitHubRepoMeta = await response.json();
    return data;
  } catch (err) {
    console.warn('GitHub API repo metadata fetch failed, using fallback:', err);
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
  const defaultAsset = DEFAULT_LATEST_RELEASE.assets?.[0];
  const defaultSha = defaultAsset?.digest?.replace('sha256:', '') || '96229c614e43cda4e7397c8b52ca186cdd72974b4ce39441d8024e9c76cbf91e';

  // Extract potential sha256 from release body if present
  let extractedSha = defaultSha;
  if (release.body) {
    const shaMatch = release.body.match(/[a-fA-F0-9]{64}/);
    if (shaMatch) {
      extractedSha = shaMatch[0].toLowerCase();
    }
  }

  const tagName = release.tag_name || DEFAULT_LATEST_RELEASE.tag_name;

  // 1. First priority: Look for signed APK asset in the release payload
  if (release.assets && release.assets.length > 0) {
    const signedApk = release.assets.find(a => 
      a.name.toLowerCase().endsWith('.apk') && a.name.toLowerCase().includes('signed')
    );
    if (signedApk && signedApk.browser_download_url) {
      return {
        ...signedApk,
        digest: signedApk.digest || `sha256:${extractedSha}`
      };
    }

    // 2. Second priority: Any .apk asset attached to this release
    const anyApk = release.assets.find(a => a.name.toLowerCase().endsWith('.apk'));
    if (anyApk && anyApk.browser_download_url) {
      return {
        ...anyApk,
        digest: anyApk.digest || `sha256:${extractedSha}`
      };
    }
  }

  // 3. Direct mapping to GitHub release tag download route
  const resolvedTag = (tagName && tagName !== 'latest') ? tagName : DEFAULT_LATEST_RELEASE.tag_name;
  return {
    name: 'KaspaBrowser-release-signed.apk',
    browser_download_url: `https://github.com/Curious-being99/Kaspa-browser-/releases/download/${resolvedTag}/KaspaBrowser-release-signed.apk`,
    size: release.assets?.[0]?.size || defaultAsset?.size || 21068947,
    digest: `sha256:${extractedSha}`
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

