import { GitHubRelease, GitHubRepoMeta } from '../types';
import { 
  DEFAULT_LATEST_RELEASE, 
  FALLBACK_RELEASES, 
  FALLBACK_REPO_META, 
  GITHUB_API_BASE 
} from '../data/kaspaData';

export async function fetchLatestRelease(): Promise<GitHubRelease> {
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
        const sorted = [...releasesList].sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || 0).getTime();
          const dateB = new Date(b.published_at || b.created_at || 0).getTime();
          return dateB - dateA;
        });
        newestFromList = sorted[0];
      }
    }

    // Compare timestamps if both exist, picking whichever is newer
    if (latestFromEndpoint && newestFromList) {
      const timeEndpoint = new Date(latestFromEndpoint.published_at || latestFromEndpoint.created_at || 0).getTime();
      const timeList = new Date(newestFromList.published_at || newestFromList.created_at || 0).getTime();

      return timeList > timeEndpoint ? newestFromList : latestFromEndpoint;
    }

    if (newestFromList) return newestFromList;
    if (latestFromEndpoint) return latestFromEndpoint;

    return DEFAULT_LATEST_RELEASE;
  } catch (err) {
    console.debug('GitHub API query failed, utilizing fallback data:', err);
    return DEFAULT_LATEST_RELEASE;
  }
}

export async function fetchAllReleases(): Promise<GitHubRelease[]> {
  try {
    const timestamp = Date.now();
    const response = await fetch(`${GITHUB_API_BASE}/releases?_t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      return FALLBACK_RELEASES;
    }

    const data: GitHubRelease[] = await response.json();
    return data && data.length > 0 ? data : FALLBACK_RELEASES;
  } catch (err) {
    console.warn('GitHub API releases fetch failed, using fallback:', err);
    return FALLBACK_RELEASES;
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
  // Extract potential sha256 from release body if present
  let extractedSha = '0b535ecc3edf685c4c0349b31e909a9fc49dffcf2a83de10b49b2e9640053681';
  if (release.body) {
    const shaMatch = release.body.match(/[a-fA-F0-9]{64}/);
    if (shaMatch) {
      extractedSha = shaMatch[0].toLowerCase();
    }
  }

  const tagName = release.tag_name || 'latest';

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
  const resolvedTag = (tagName && tagName !== 'latest') ? tagName : 'v1.0.20260920031739';
  return {
    name: 'KaspaBrowser-release-signed.apk',
    browser_download_url: `https://github.com/Curious-being99/Kaspa-browser-/releases/download/${resolvedTag}/KaspaBrowser-release-signed.apk`,
    size: release.assets?.[0]?.size || 21183635,
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
