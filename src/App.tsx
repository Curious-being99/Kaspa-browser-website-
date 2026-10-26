/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { FeaturesGrid } from './components/FeaturesGrid';
import { ArchitectureSection } from './components/ArchitectureSection';
import { InstallationGuide } from './components/InstallationGuide';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { QrCodeModal } from './components/QrCodeModal';

import { GitHubRelease, GitHubRepoMeta } from './types';
import { 
  fetchLatestRelease, 
  fetchRepoMetadata,
  triggerBrowserDownload,
  getPreferredDownloadAsset
} from './services/githubService';
import { fetchLiveKaspaStats, LiveKaspaStats } from './services/liveKaspaService';
import { FALLBACK_REPO_META } from './data/kaspaData';

export default function App() {
  const [latestRelease, setLatestRelease] = useState<GitHubRelease | null>(null);
  const [repoMeta, setRepoMeta] = useState<GitHubRepoMeta | null>(FALLBACK_REPO_META);
  const [kaspaStats, setKaspaStats] = useState<LiveKaspaStats | null>(null);

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Load live release & repo data from GitHub API and Kaspa price stats
  useEffect(() => {
    let isMounted = true;

    async function loadGitHubData() {
      try {
        // Use sequential loads with slight delay or Promise.all if we are sure about limits
        // but here we just want to ensure we get the latest release first
        const latest = await fetchLatestRelease();
        if (!isMounted) return;
        if (latest) setLatestRelease(latest);

        // Fetch meta and commits only if we haven't hit rate limits yet
        // or just fetch them all at once once per cycle
        const meta = await fetchRepoMetadata();
        if (isMounted && meta) setRepoMeta(meta);
      } catch (err) {
        console.warn('GitHub data refresh failed:', err);
      }
    }

    async function loadPriceData() {
      try {
        const stats = await fetchLiveKaspaStats();
        if (!isMounted) return;
        if (stats) setKaspaStats(stats);
      } catch (err) {
        console.warn('Price data refresh failed:', err);
      }
    }

    // Initial loads
    loadGitHubData();
    loadPriceData();
    
    // GitHub: 5 minutes (to prevent 403 rate limits in "no-express" client-only mode)
    const githubInterval = setInterval(loadGitHubData, 300000);
    
    // Price: 10 seconds (CoinGecko / Kaspa API have higher limits)
    const priceInterval = setInterval(loadPriceData, 10000);

    return () => {
      isMounted = false;
      clearInterval(githubInterval);
      clearInterval(priceInterval);
    };
  }, []);

  const handleTriggerDownload = (release?: GitHubRelease) => {
    const targetRelease = release || latestRelease;
    if (!targetRelease) {
      window.open('https://github.com/Curious-being99/Kaspa-browser-/releases/latest', '_blank');
      return;
    }
    const asset = getPreferredDownloadAsset(targetRelease);
    if (asset) {
      setIsDownloading(true);
      setDownloadToast(`Starting download: ${asset.name}`);
      triggerBrowserDownload(asset.browser_download_url, asset.name);
      setTimeout(() => {
        setIsDownloading(false);
      }, 2000);
      setTimeout(() => {
        setDownloadToast(null);
      }, 5000);
    }
  };


  return (
    <div className="min-h-screen bg-[#0C0D10] text-[#F3F4F6] selection:bg-[#70C7BA]/30 selection:text-[#70C7BA]">
      
      {/* Navigation Bar */}
      <Navbar
        repoMeta={repoMeta}
        kaspaStats={kaspaStats}
        onQrClick={() => setIsQrModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero & Auto Download - The ONLY Download Button on the Main Page */}
        <HeroSection
          latestRelease={latestRelease}
          repoMeta={repoMeta}
          onDownloadClick={() => handleTriggerDownload()}
          onQrClick={() => setIsQrModalOpen(true)}
          isDownloading={isDownloading}
        />

        {/* 2. About Us: Dedicated Tool to Browse Kaspa Network */}
        <AboutSection
          latestRelease={latestRelease}
        />

        {/* 3. Core Features (Features Grid) */}
        <FeaturesGrid />

        {/* 4. Architecture & Technology Specifications */}
        <ArchitectureSection />


        {/* 6. Step-by-Step Android Installation Guide */}
        <InstallationGuide />

        {/* 7. Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer
        latestRelease={latestRelease}
      />

      {/* Direct Download Toast Notification */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#14161C] border border-[#70C7BA]/50 shadow-2xl flex items-center gap-3 animate-fadeIn">
          <div className="w-2.5 h-2.5 rounded-full bg-[#70C7BA] animate-ping" />
          <div className="text-xs font-mono text-white">
            {downloadToast}
          </div>
        </div>
      )}

      {/* Mobile QR Scanner Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        latestRelease={latestRelease}
      />

    </div>
  );
}
