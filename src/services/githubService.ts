import { GitHubRelease, GitHubRepoMeta } from '../types';
import { 
  DEFAULT_LATEST_RELEASE, 
  FALLBACK_RELEASES, 
  FALLBACK_REPO_META, 
  GITHUB_API_BASE 
} from '../data/kaspaData';

export async function fetchLatestRelease(): Promise<GitHubRelease> {
  try {
    // 1. Fetch releases list directly to ensure we sort by published date
    const listResponse = await fetch(`${GITHUB_API_BASE}/releases`, {
      headers: { 
        'Accept': 'application/vnd.github.v3+json' 
      }
    });

    if (listResponse.ok) {
      const releases: GitHubRelease[] = await listResponse.json();
      if (releases && releases.length > 0) {
        // Sort explicitly by published_at or created_at descending to guarantee absolute newest
        const sorted = [...releases].sort((a, b) => {
          const dateA = new Date(a.published_at || a.created_at || 0).getTime();
          const dateB = new Date(b.published_at || b.created_at || 0).getTime();
          return dateB - dateA;
        });
        return sorted[0];
      }
    }

    // 2. Fallback to /releases/latest endpoint if list failed
    const response = await fetch(`${GITHUB_API_BASE}/releases/latest`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.ok) {
      const data: GitHubRelease = await response.json();
      return data;
    }

    return DEFAULT_LATEST_RELEASE;
  } catch (err) {
    console.debug('GitHub API rate limit or network offline, using fallback data:', err);
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

  // 3. Guaranteed dynamic mapping to GitHub's official latest download route
  return {
    name: 'KaspaBrowser-release-signed.apk',
    browser_download_url: tagName !== 'latest' && tagName !== ''
      ? `https://github.com/Curious-being99/Kaspa-browser-/releases/download/${tagName}/KaspaBrowser-release-signed.apk`
      : `https://github.com/Curious-being99/Kaspa-browser-/releases/latest/download/KaspaBrowser-release-signed.apk`,
    size: release.assets?.[0]?.size || 23934207,
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
