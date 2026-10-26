import React, { useState, useEffect } from 'react';
import { 
  Download, 
  QrCode, 
  Github, 
  Shield, 
  Copy, 
  Check, 
  ExternalLink,
  Lock,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { KaspaLogo } from './KaspaLogo';
import { GitHubRelease, GitHubRepoMeta } from '../types';
import { GITHUB_REPO_URL, GITHUB_RELEASES_URL } from '../data/kaspaData';
import { formatBytes, getPreferredDownloadAsset } from '../services/githubService';

interface HeroSectionProps {
  latestRelease: GitHubRelease | null;
  repoMeta: GitHubRepoMeta | null;
  onDownloadClick: () => void;
  onQrClick: () => void;
  isDownloading: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  latestRelease,
  onDownloadClick,
  onQrClick,
  isDownloading
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'News' | 'YouTube' | 'Reddit' | 'GitHub'>('All');
  const [copiedHash, setCopiedHash] = useState(false);
  const [viewMode, setViewMode] = useState<'screenshot' | 'interactive'>('screenshot');

  const preferredAsset = latestRelease ? getPreferredDownloadAsset(latestRelease) : null;
  const shaDigest = preferredAsset?.digest || 'sha256:0b535ecc3edf685c4c0349b31e909a9fc49dffcf2a83de10b49b2e9640053681';
  const [feedItems, setFeedItems] = useState<any[]>([
    {
      id: 1,
      category: 'GitHub',
      timeAgo: 'Live',
      title: 'Fetching live repository commits from GitHub API...',
      snippet: 'Connecting to https://api.github.com/repos/Curious-being99/Kaspa-browser-/commits',
      author: 'by GitHub Actions CI'
    }
  ]);
  const [isLoadingLive, setIsLoadingLive] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadLive() {
      try {
        const commits = await import('../services/liveKaspaService').then(m => m.fetchLiveGitHubCommits());

        if (!isMounted) return;

        if (commits && commits.length > 0) {
          setFeedItems([
            ...commits,
            {
              id: 'kaspa-net-1',
              category: 'News',
              timeAgo: 'Real-Time',
              title: 'Kaspa BlockDAG Network Active',
              snippet: 'High-performance Web3 browsing with Cronet HTTP/3 QUIC transport.',
              author: 'by Kaspa Network Node'
            }
          ]);
        }
      } catch (e) {
        console.warn('Failed to load live data:', e);
      } finally {
        if (isMounted) setIsLoadingLive(false);
      }
    }
    loadLive();
    return () => { isMounted = false; };
  }, []);

  const filteredFeedItems = activeFilter === 'All' 
    ? feedItems 
    : feedItems.filter(item => item.category === activeFilter);

  const copyHashToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shaDigest);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = shaDigest;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedHash(true);
        setTimeout(() => setCopiedHash(false), 2000);
      } catch {
        // ignore
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <section 
      id="overview" 
      className="relative pt-28 pb-20 overflow-hidden bg-grid-pattern border-b border-[#282C37]/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Headline & CTA */}
          <div className="space-y-6 text-center lg:text-left">
            
            {/* Main Headline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14161C] border border-[#70C7BA]/40 text-xs font-mono text-[#70C7BA]">
              <KaspaLogo className="w-4 h-4 rounded-full shadow-sm" />
              <span>Decentralized Android Client</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F3F4F6] leading-[1.1]">
              The Web3 Browser Engineered for <br />
              <span className="text-[#70C7BA]">
                Kaspa BlockDAG
              </span>
            </h1>

            {/* $KB Token Callout Banner */}
            <div className="my-6 p-5 rounded-2xl bg-[#14161C] border border-[#282C37] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-11 h-11 rounded-xl bg-transparent border border-[#282C37] flex items-center justify-center">
                    <KaspaLogo className="w-7 h-7" />
                  </div>
                </div>

                <div className="text-left space-y-1">
                  <div className="text-sm font-extrabold text-white flex items-center gap-2 flex-wrap">
                    <span>Buy $KB</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#70C7BA]/20 text-[#70C7BA] border border-[#70C7BA]/40 font-bold uppercase">
                      KaspaRocket
                    </span>
                  </div>
                  <div className="text-xs text-[#70C7BA] italic font-semibold pt-0.5">
                    Slogan: &quot;We Stand, Build, Hold, Trade &amp; Succeed&quot;
                  </div>
                </div>
              </div>

              <a
                id="hero-buy-kb-btn"
                href="https://kasparocket.fun/token/b75a6e90f569965bdeec23c460ebd59e0f0445d8aa8f5d4330fe15c66a47b4d8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#70C7BA] hover:brightness-110 text-[#0C0D10] font-black text-sm shadow-md transition-all shrink-0 hover:scale-105"
              >
                <span>Buy $KB</span>
              </a>
            </div>

            {/* Main Action Buttons */}
            <div className="pt-4 flex flex-col items-center justify-center gap-4">
              
              {/* PRIMARY AUTO DOWNLOAD BUTTON */}
              <button
                id="hero-auto-download-btn"
                onClick={onDownloadClick}
                disabled={isDownloading}
                className="group relative inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#70C7BA] hover:brightness-110 text-[#0C0D10] font-extrabold text-base sm:text-lg shadow-sm transition-all transform active:scale-98 cursor-pointer overflow-hidden"
              >
                <Download className={`w-5 h-5 stroke-[2.5] ${isDownloading ? 'animate-bounce' : 'group-hover:translate-y-0.5'} transition-transform`} />
                <div className="text-left">
                  <div className="leading-tight">
                    {isDownloading ? 'Starting Download...' : 'Auto Download Latest Release'}
                  </div>
                  <div className="text-[11px] font-mono font-medium text-emerald-950 opacity-90">
                    {preferredAsset?.name || 'KaspaBrowser-release-signed.apk'} ({preferredAsset ? formatBytes(preferredAsset.size) : '21.8 MB'})
                  </div>
                </div>
              </button>
            </div>

            {/* Release Hash & Quick Verification Pill */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1.5 text-gray-400">
                <Shield className="w-3.5 h-3.5 text-[#70C7BA]" />
                <span>SHA-256:</span>
              </span>
              <button
                onClick={copyHashToClipboard}
                className="group inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#14161C] border border-[#282C37] hover:border-[#70C7BA]/50 text-gray-300 hover:text-white transition-all cursor-pointer"
                title="Click to copy full SHA-256 hash"
              >
                <span className="truncate max-w-[200px] sm:max-w-xs">{shaDigest.replace('sha256:', '')}</span>
                {copiedHash ? (
                  <Check className="w-3.5 h-3.5 text-[#70C7BA]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300" />
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};


