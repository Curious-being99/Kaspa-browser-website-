import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Shield, 
  Copy, 
  Check, 
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { KaspaLogo } from './KaspaLogo';
import { GitHubRelease, GitHubRepoMeta } from '../types';
import { GITHUB_REPO_URL } from '../data/kaspaData';
import { formatBytes, getPreferredDownloadAsset } from '../services/githubService';
import { KB_TOKEN_CONTRACT } from '../services/tokenService';
import heroBgImage from '../assets/images/kaspa_blockdag_hero_background_1793176557783.jpg';

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
  isDownloading
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);
  const preferredAsset = latestRelease ? getPreferredDownloadAsset(latestRelease) : null;
  // Dynamically uses the live release SHA from GitHub, falling back to current stable digest
  const shaDigest = preferredAsset?.digest || '24e7b273dd9a6ada97a0104210386aa55f43e56f45aedbfec57f1f18529bac5d';

  const copyContractToClipboard = async () => {
      await navigator.clipboard.writeText(KB_TOKEN_CONTRACT);
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 2000);
  };

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
      } catch { /* ignore */ }
      document.body.removeChild(textArea);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBgImage} 
          alt="Kaspa BlockDAG Network Visualization"
          className="w-full h-full object-cover opacity-25"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0D10] via-transparent to-[#0C0D10]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0D10] via-[#0C0D10]/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Content Left */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#70C7BA]/10 border border-[#70C7BA]/20 text-[#70C7BA] text-xs font-mono font-bold tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#70C7BA] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#70C7BA]"></span>
              </span>
              {latestRelease?.tag_name ? (latestRelease.tag_name.startsWith('v') ? latestRelease.tag_name : `v${latestRelease.tag_name}`) : 'v1.0'} Stable Release
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[0.9]">
              WEB3 BROWSER FOR <br />
              <span className="text-[#70C7BA]">KASPA BLOCKDAG</span>
            </h1>

            <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
              Engineered for speed, privacy, and decentralized connectivity. KaspaBrowser is your native gateway to the Kaspa BlockDAG ecosystem, with $KB — the meme-born utility token of the KaspaBrowser ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onDownloadClick}
                disabled={isDownloading}
                className="group relative flex items-center justify-center gap-4 px-8 py-5 rounded-2xl bg-[#70C7BA] text-[#0C0D10] font-black text-lg transition-all hover:scale-105 hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                {isDownloading ? (
                  <div className="w-6 h-6 border-4 border-[#0C0D10]/20 border-t-[#0C0D10] rounded-full animate-spin" />
                ) : (
                  <Download className="w-6 h-6" />
                )}
                <span>{isDownloading ? 'Downloading...' : 'Auto Download APK'}</span>
              </button>

              <a 
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all"
              >
                <span>View on GitHub</span>
                <ChevronRight className="w-5 h-5 opacity-50" />
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
                <span className="text-[#70C7BA]">Contract:</span>
                <button
                  onClick={copyContractToClipboard}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#70C7BA]/40 transition-colors"
                >
                  <span className="truncate max-w-[300px]">{KB_TOKEN_CONTRACT}</span>
                  <Copy className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* SHA Verification */}
            {shaDigest && (
              <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
                <Shield className="w-4 h-4 text-[#70C7BA]" />
                <span className="hidden sm:inline">SHA-256:</span>
                <button
                  onClick={copyHashToClipboard}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#70C7BA]/40 transition-colors"
                >
                  <span className="truncate max-w-[120px] sm:max-w-xs">{shaDigest.replace('sha256:', '')}</span>
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-[#70C7BA]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </motion.div>

          {/* Visual Right (Optional device mockup or stats) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative z-10 p-8 rounded-[3rem] bg-[#14161C] border border-white/5 shadow-2xl backdrop-blur-3xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#70C7BA]/10 flex items-center justify-center">
                      <KaspaLogo className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">KaspaBrowser {latestRelease?.tag_name || 'v1.0'}</div>
                      <div className="text-[10px] text-gray-500 font-mono">Build: {latestRelease?.published_at ? new Date(latestRelease.published_at).toISOString().split('T')[0] : 'SIGNED'}</div>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded-md bg-[#70C7BA]/10 text-[#70C7BA] text-[10px] font-bold">STABLE</div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Network', value: 'BlockDAG' },
                    { label: 'Security', value: 'SHA-256 Verified' },
                    { label: 'Core', value: 'Kotlin 2.0 Native' },
                    { label: 'Features', value: '$KB + Si Agent' }
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{stat.label}</span>
                      <span className="text-gray-300 font-mono">{stat.value}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 mt-4 border-t border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Live Feed</div>
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="h-full bg-[#70C7BA]"
                      />
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-[#70C7BA]/60">
                      <span>SYNCING_BLOCKS...</span>
                      <span>LATENCY: 12ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Glowing background behind card */}
            <div className="absolute inset-0 bg-[#70C7BA] blur-[120px] opacity-10 rounded-full" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
