export interface LiveKaspaStats {
  priceUsd: number;
  change24h: number;
  marketCap: number;
  blockCount: number;
  hashrate: string;
  tps: string;
}

export interface LiveFeedItem {
  id: string | number;
  category: 'GitHub' | 'News' | 'Network' | 'Release';
  timeAgo: string;
  title: string;
  snippet: string;
  author: string;
  url?: string;
}

const GITHUB_REPO_API = '/api/github';

export async function fetchLiveGitHubCommits(): Promise<LiveFeedItem[]> {
  const CACHE_KEY = 'github_commits_cache';
  const CACHE_TIME = 3600000;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedObj = cached ? JSON.parse(cached) : null;
    if (cachedObj && Date.now() - cachedObj.timestamp < CACHE_TIME && Array.isArray(cachedObj.data)) {
      return cachedObj.data;
    }

    const response = await fetch(`${GITHUB_REPO_API}?path=commits&per_page=5`, {
      headers: { Accept: 'application/vnd.github+json' }
    });
    if (!response.ok) return cachedObj && Array.isArray(cachedObj.data) ? cachedObj.data : [];

    const commits = await response.json();
    const data = Array.isArray(commits) ? commits.filter((commit: any) =>
      commit?.commit?.committer?.date && typeof commit?.sha === 'string'
    ).map((commit: any) => {
      const date = new Date(commit.commit.committer.date);
      const hoursAgo = Math.max(0, Math.floor((Date.now() - date.getTime()) / 3600000));
      const timeAgo = hoursAgo > 24 ? `${Math.floor(hoursAgo / 24)}d ago` : `${hoursAgo}h ago`;
      const message = String(commit.commit.message || '').split('\n')[0];
      return {
        id: commit.sha,
        category: 'GitHub' as const,
        timeAgo,
        title: message,
        snippet: `Commit ${commit.sha.substring(0, 7)} — ${message}`,
        author: `by @${commit.author?.login || commit.commit.author?.name || 'unknown'}`,
        url: commit.html_url
      };
    }) : [];

    if (data.length > 0) localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  } catch (error) {
    console.warn('Live GitHub commits fetch error:', error);
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const parsed = cached ? JSON.parse(cached) : null;
      return Array.isArray(parsed?.data) ? parsed.data : [];
    } catch {
      return [];
    }
  }
}

export async function fetchLiveKaspaStats(): Promise<LiveKaspaStats | null> {
  try {
    const [priceResult, dagResult] = await Promise.allSettled([
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=kaspa&vs_currencies=usd&include_24hr_change=true&include_market_cap=true', { cache: 'no-store' }),
      fetch('https://api.kaspa.org/info/blockdag', { cache: 'no-store' })
    ]);

    let priceUsd = 0;
    let change24h = 0;
    let marketCap = 0;
    let blockCount = 0;
    let hashrate = 'Unavailable';
    const tps = 'Unavailable';
    let hasLiveData = false;

    if (priceResult.status === 'fulfilled' && priceResult.value.ok) {
      const data = await priceResult.value.json();
      const kaspa = data?.kaspa;
      if (Number.isFinite(kaspa?.usd) && kaspa.usd > 0) {
        priceUsd = kaspa.usd;
        change24h = Number.isFinite(kaspa.usd_24h_change) ? kaspa.usd_24h_change : 0;
        marketCap = Number.isFinite(kaspa.usd_market_cap) ? kaspa.usd_market_cap : 0;
        hasLiveData = true;
      }
    }

    if (dagResult.status === 'fulfilled' && dagResult.value.ok) {
      const data = await dagResult.value.json();
      if (Number.isFinite(data?.blockCount) && data.blockCount >= 0) {
        blockCount = data.blockCount;
        hasLiveData = true;
      }
      if (Number.isFinite(data?.difficulty) && data.difficulty > 0) {
        hashrate = `${(data.difficulty / 1e15).toFixed(1)} PH/s`;
        hasLiveData = true;
      }
    }

    return hasLiveData ? { priceUsd, change24h, marketCap, blockCount, hashrate, tps } : null;
  } catch (error) {
    console.warn('Live Kaspa stats fetch error:', error);
    return null;
  }
}
