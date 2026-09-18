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
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [activePreviewTab, setActivePreviewTab] = useState<'gateway' | 'privacy' | 'roadmap'>('gateway');
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const preferredAsset = latestRelease ? getPreferredDownloadAsset(latestRelease) : null;
  const shaDigest = preferredAsset?.digest || 'sha256:0b535ecc3edf685c4c0349b31e909a9fc49dffcf2a83de10b49b2e9640053681';

  // Auto-navigate between Gateway -> Privacy -> Roadmap every 4 seconds unless user manually interacts
  useEffect(() => {
    if (isUserInteracting) return;

    const interval = setInterval(() => {
      setActivePreviewTab((prevTab) => {
        if (prevTab === 'gateway') return 'privacy';
        if (prevTab === 'privacy') return 'roadmap';
        return 'gateway';
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isUserInteracting]);

  const handleTabClick = (tab: 'gateway' | 'privacy' | 'roadmap') => {
    setIsUserInteracting(true);
    setActivePreviewTab(tab);
  };

  const copyHashToClipboard = () => {
    navigator.clipboard.writeText(shaDigest);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <section 
      id="overview" 
      className="relative pt-28 pb-20 overflow-hidden bg-grid-pattern border-b border-[#282C37]/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F3F4F6] leading-[1.1]">
              The Web3 Browser Engineered for <br />
              <span className="text-[#70C7BA]">
                Kaspa BlockDAG
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl leading-relaxed">
              Open-source Android web browser powered by <strong className="text-gray-200">HTTP/3 QUIC</strong> 0-RTT transport, 
              custom decentralized protocol interception, 
              built-in <strong className="text-gray-200">Privacy &amp; Tracker Shield</strong>, and modern 
              <strong className="text-gray-200"> Jetpack Compose Material 3</strong> design.
            </p>

            {/* Main Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              
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

              {/* QR Code Trigger for Android Phones */}
              <button
                id="hero-qr-code-btn"
                onClick={onQrClick}
                className="inline-flex items-center gap-2 px-4 py-4 rounded-xl bg-[#14161C] border border-[#282C37] text-gray-200 hover:text-[#70C7BA] hover:border-[#70C7BA]/50 transition-all font-semibold text-sm cursor-pointer"
              >
                <QrCode className="w-5 h-5 text-[#70C7BA]" />
                <span>Scan for Phone</span>
              </button>

              {/* GitHub Link */}
              <a
                id="hero-github-repo-link"
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-4 rounded-xl bg-[#14161C] border border-[#282C37] text-gray-300 hover:text-white hover:border-gray-500 transition-all font-mono text-sm"
              >
                <Github className="w-5 h-5" />
                <span>GitHub Repo</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              </a>
            </div>

            {/* Release Hash & Quick Verification Pill */}

          </div>

          {/* Right Column: Interactive App Interface Preview Cardboard with Animated Transitions */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-lg rounded-xl p-3 bg-[#14161C] border border-[#282C37]">
              
              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-3 gap-1 p-2 bg-[#0C0D10] border-b border-[#282C37] rounded-t-lg">
                <button
                  onClick={() => handleTabClick('gateway')}
                  className={`relative py-2 px-3 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
                    activePreviewTab === 'gateway' 
                      ? 'text-[#70C7BA] font-bold' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {activePreviewTab === 'gateway' && (
                    <motion.div 
                      layoutId="tab-pill" 
                      className="absolute inset-0 bg-[#14161C] rounded-md border border-[#282C37]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">Gateway</span>
                </button>
                <button
                  onClick={() => handleTabClick('privacy')}
                  className={`relative py-2 px-3 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
                    activePreviewTab === 'privacy' 
                      ? 'text-[#70C7BA] font-bold' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {activePreviewTab === 'privacy' && (
                    <motion.div 
                      layoutId="tab-pill" 
                      className="absolute inset-0 bg-[#14161C] rounded-md border border-[#282C37]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">Privacy Shield</span>
                </button>
                <button
                  onClick={() => handleTabClick('roadmap')}
                  className={`relative py-2 px-3 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
                    activePreviewTab === 'roadmap' 
                      ? 'text-[#70C7BA] font-bold' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {activePreviewTab === 'roadmap' && (
                    <motion.div 
                      layoutId="tab-pill" 
                      className="absolute inset-0 bg-[#14161C] rounded-md border border-[#282C37]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">Roadmap</span>
                </button>
              </div>

              {/* Screen Content Container with Fixed Height and Cross-Fade Transitions */}
              <div className="bg-[#0C0D10] rounded-b-lg p-4 flex flex-col justify-between h-[360px] overflow-hidden relative">
                
                <div className="relative flex-1">
                  <AnimatePresence mode="wait">
                    {/* 1. GATEWAY SCREEN */}
                    {activePreviewTab === 'gateway' && (
                      <motion.div 
                        key="gateway"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3.5 absolute inset-0"
                      >
                        {/* Simulated URL Bar */}
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#14161C] border border-[#282C37]">
                          <Lock className="w-3.5 h-3.5 text-[#70C7BA]" />
                          <div className="flex-1 font-mono text-xs text-[#70C7BA] truncate">
                            kas://network.protocol/explore
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#14161C] text-[#70C7BA] border border-[#282C37] font-mono font-bold tracking-wider">
                            VERIFIED
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#14161C] border border-[#282C37] space-y-2.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Interception Layer</span>
                            <span className="font-mono text-[#70C7BA] font-semibold">Android WebViewClient</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Supported Protocols</span>
                            <span className="font-mono text-indigo-300 font-semibold">kas://, ipfs://, dweb://</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Transport Pipeline</span>
                            <span className="font-mono text-emerald-400 font-semibold">HTTP/3 QUIC (0-RTT)</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Binary Integrity</span>
                            <span className="font-mono text-[#70C7BA] font-semibold">SHA-256 Verified</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-[#14161C] border border-[#282C37]">
                          <div className="text-xs font-semibold text-white mb-1">Decentralized Web Routing</div>
                          <p className="text-[11px] text-gray-300 leading-relaxed">
                            Native scheme handler maps custom decentralized protocols directly into the browser pipeline.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* 2. PRIVACY SHIELD SCREEN */}
                    {activePreviewTab === 'privacy' && (
                      <motion.div 
                        key="privacy"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3 absolute inset-0"
                      >
                        <div className="p-3 rounded-xl bg-[#14161C] border border-[#282C37] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[#70C7BA]" />
                            <span className="text-xs font-bold text-white">Browser Security &amp; Privacy</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#14161C] text-[#70C7BA] border border-[#282C37]">
                            PROTECTED
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          <div className="p-2.5 rounded-lg bg-[#14161C] border border-[#282C37] flex justify-between items-center">
                            <span className="text-gray-400">HTTPS-Only Mode</span>
                            <span className="text-[#70C7BA] font-mono font-semibold">Auto Upgrade</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[#14161C] border border-[#282C37] flex justify-between items-center">
                            <span className="text-gray-400">Tracker &amp; Ad Interception</span>
                            <span className="text-emerald-400 font-mono font-semibold">Active</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[#14161C] border border-[#282C37] flex justify-between items-center">
                            <span className="text-gray-400">Local Data Storage</span>
                            <span className="text-indigo-400 font-mono font-semibold">Room SQLite Encrypted</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-[#14161C] border border-[#282C37]">
                          <div className="text-xs font-semibold text-white mb-1">Zero Telemetry</div>
                          <p className="text-[11px] text-gray-300 leading-relaxed">
                            No user tracking beacons, no analytics collection, and full local sandbox isolation.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* 3. ROADMAP / STATUS SCREEN */}
                    {activePreviewTab === 'roadmap' && (
                      <motion.div 
                        key="roadmap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3.5 absolute inset-0"
                      >
                        <div className="p-3.5 rounded-xl bg-[#14161C] border border-[#282C37] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">Kaspa (KAS) Token Integration</span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#14161C] text-amber-400 border border-[#282C37]">
                              IN DEVELOPMENT
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-300 leading-relaxed">
                            As noted in GitHub release updates, native on-device KAS wallet features and dApp transaction signing are currently in active development.
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#14161C] border border-[#282C37] space-y-2">
                          <div className="text-xs font-semibold text-white">Current Production Highlights</div>
                          <ul className="text-[11px] text-gray-300 space-y-1 font-mono">
                            <li>• Security &amp; bug fix patches</li>
                            <li>• HTTP/3 QUIC connection pooling</li>
                            <li>• Jetpack Compose Material 3 UI</li>
                            <li>• Android 8.0 - Android 16 support</li>
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Phone Bottom Control Bar */}
                <div className="pt-3 mt-auto border-t border-[#282C37] flex items-center justify-between text-[11px] font-mono text-gray-400 relative z-10 bg-[#0C0D10]">
                  <span>Android 16 • Compose M3</span>
                  <a 
                    href={GITHUB_RELEASES_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#70C7BA] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View Releases</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

