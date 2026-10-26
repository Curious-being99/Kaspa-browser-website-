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

const GITHUB_REPO_API = 'https://api.github.com/repos/Curious-being99/Kaspa-browser-';

export async function fetchLiveGitHubCommits(): Promise<LiveFeedItem[]> {
  try {
    const res = await fetch(`${GITHUB_REPO_API}/commits?per_page=5`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!res.ok) throw new Error('GitHub commits fetch failed');
    const commits = await res.json();
    
    return commits.map((c: any, index: number) => {
      const date = new Date(c.commit.committer.date);
      const hoursAgo = Math.max(1, Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60)));
      const timeAgo = hoursAgo > 24 ? `${Math.floor(hoursAgo / 24)}d ago` : `${hoursAgo}h ago`;
      
      return {
        id: c.sha || index,
        category: 'GitHub' as const,
        timeAgo,
        title: c.commit.message.split('\n')[0],
        snippet: `Commit by ${c.commit.author.name} (${c.sha.substring(0, 7)}) - ${c.commit.message}`,
        author: `by @${c.author?.login || c.commit.author.name}`,
        url: c.html_url
      };
    });
  } catch (err) {
    console.warn('Live GitHub commits fetch error:', err);
    return [];
  }
}

export async function fetchLiveKaspaStats(): Promise<LiveKaspaStats | null> {
  try {
    const [priceRes, dagRes] = await Promise.allSettled([
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=kaspa&vs_currencies=usd&include_24hr_change=true&include_market_cap=true'),
      fetch('https://api.kaspa.org/info/blockdag')
    ]);

    let priceUsd = 0.142;
    let change24h = 3.4;
    let marketCap = 3500000000;
    let blockCount = 104520930;
    let hashrate = '850 PH/s';
    let tps = '10+ TPS';

    if (priceRes.status === 'fulfilled' && priceRes.value.ok) {
      const priceData = await priceRes.value.json();
      if (priceData?.kaspa) {
        priceUsd = priceData.kaspa.usd || priceUsd;
        change24h = priceData.kaspa.usd_24h_change || change24h;
        marketCap = priceData.kaspa.usd_market_cap || marketCap;
      }
    }

    if (dagRes.status === 'fulfilled' && dagRes.value.ok) {
      const dagData = await dagRes.value.json();
      if (dagData) {
        blockCount = dagData.blockCount || blockCount;
        if (dagData.difficulty) {
          hashrate = `${(dagData.difficulty / 1e15).toFixed(1)} PH/s`;
        }
      }
    }

    return {
      priceUsd,
      change24h,
      marketCap,
      blockCount,
      hashrate,
      tps
    };
  } catch (err) {
    console.warn('Live Kaspa stats fetch error:', err);
    return null;
  }
}
