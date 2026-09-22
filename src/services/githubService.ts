import { GitHubRelease, GitHubRepoMeta } from '../types';
import { 
  DEFAULT_LATEST_RELEASE, 
  FALLBACK_RELEASES, 
  FALLBACK_REPO_META, 
  GITHUB_API_BASE 
} from '../data/kaspaData';

const LATEST_CACHE_KEY = 'kaspa_latest_release_v2';
const ALL_RELEASES_CACHE_KEY = 'kaspa_all_releases_v2';

/**
 * Extracts a comparable timestamp from a release using published_at, created_at, or tag name.
 */
export function getReleaseTimestamp(release?: GitHubRelease | null): number {
  if (!release) return 0;
  
  // 1. Try date properties
  const dateVal = new Date(release.published_at || release.created_at || 0).getTime();
  if (dateVal && !isNaN(dateVal) && dateVal > 0) {
    return dateVal;
  }

  // 2. Try parsing tag timestamp e.g. v1.0.20260922123310
  if (release.tag_name) {
    const match = release.tag_name.match(/\d{14}/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (!isNaN(num)) return num;
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
    const existing = getStoredLatest();
    if (!existing || isNewerRelease(release, existing) || release.tag_name === existing.tag_name) {
      localStorage.setItem(LATEST_CACHE_KEY, JSON.stringify(release));
    }
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

export async function fetchLatestRelease(): Promise<GitHubRelease> {
  const stored = getStoredLatest();
  let candidate: GitHubRelease = stored && isNewerRelease(stored, DEFAULT_LATEST_RELEASE) 
    ? stored 
    : DEFAULT_LATEST_RELEASE;

  try {
    const timestamp = Date.now();
    
    // Concurrently fetch both /releases/latest and /releases list to ensure absolute freshest release
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

    // Pick newest between endpoint & list
    let fetchedNewest: GitHubRelease | null = null;
    if (latestFromEndpoint && newestFromList) {
      fetchedNewest = isNewerRelease(newestFromList, latestFromEndpoint) ? newestFromList : latestFromEndpoint;
    } else {
      fetchedNewest = newestFromList || latestFromEndpoint;
    }

    // If fetched release is newer or equal, persist and return it
    if (fetchedNewest && (!candidate || isNewerRelease(fetchedNewest, candidate) || fetchedNewest.tag_name === candidate.tag_name)) {
      candidate = fetchedNewest;
      storeLatest(fetchedNewest);
    }

    return candidate;
  } catch (err) {
    console.debug('GitHub API query failed, utilizing newest verified release:', err);
    return candidate;
  }
}

export async function fetchAllReleases(): Promise<GitHubRelease[]> {
  const cachedAll = getStoredAllReleases();
  let baseList = cachedAll && cachedAll.length > 0 ? cachedAll : FALLBACK_RELEASES;

  try {
    const timestamp = Date.now();
    const response = await fetch(`${GITHUB_API_BASE}/releases?_t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      return baseList;
    }

    const data: GitHubRelease[] = await response.json();
    if (data && Array.isArray(data) && data.length > 0) {
      const sorted = [...data].sort((a, b) => getReleaseTimestamp(b) - getReleaseTimestamp(a));
      storeAllReleases(sorted);
      if (sorted[0]) storeLatest(sorted[0]);
      return sorted;
    }

    return baseList;
  } catch (err) {
    console.warn('GitHub API releases fetch failed, using cached/fallback:', err);
    return baseList;
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

