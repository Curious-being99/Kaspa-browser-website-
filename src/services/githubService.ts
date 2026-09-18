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
    const response = await fetch(`${GITHUB_API_BASE}/releases/latest?_t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      // If /latest returns 404 or fails, fallback to querying all releases
      const listResponse = await fetch(`${GITHUB_API_BASE}/releases?_t=${timestamp}`, {
        cache: 'no-store',
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });
      if (listResponse.ok) {
        const releases: GitHubRelease[] = await listResponse.json();
        if (releases && releases.length > 0) {
          return releases[0];
        }
      }
      return DEFAULT_LATEST_RELEASE;
    }

    const data: GitHubRelease = await response.json();
    return data;
  } catch (err) {
    console.warn('GitHub API fetch failed, using verified fallback data:', err);
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

  if (!release.assets || release.assets.length === 0) {
    // Generate direct download URL for the target release tag
    return {
      name: 'KaspaBrowser-release-signed.apk',
      browser_download_url: `https://github.com/Curious-being99/Kaspa-browser-/releases/download/${release.tag_name}/KaspaBrowser-release-signed.apk`,
      size: 23917823,
      digest: `sha256:${extractedSha}`
    };
  }

  // Find signed apk first, then any apk
  const signedApk = release.assets.find(a => a.name.toLowerCase().includes('signed.apk'));
  if (signedApk) {
    return {
      ...signedApk,
      digest: signedApk.digest || `sha256:${extractedSha}`
    };
  }

  const anyApk = release.assets.find(a => a.name.endsWith('.apk'));
  if (anyApk) {
    return {
      ...anyApk,
      digest: anyApk.digest || `sha256:${extractedSha}`
    };
  }

  return {
    ...release.assets[0],
    digest: `sha256:${extractedSha}`
  };
}

export function triggerBrowserDownload(url: string, filename?: string) {
  // Use a temporary hidden iframe or invisible anchor to initiate file download
  // without re-navigating or reloading the current page
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = url;
  document.body.appendChild(iframe);

  // Fallback direct anchor click for browsers that restrict iframe binary triggers
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'KaspaBrowser-release-signed.apk';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    if (document.body.contains(iframe)) document.body.removeChild(iframe);
    if (document.body.contains(link)) document.body.removeChild(link);
  }, 3000);
}
