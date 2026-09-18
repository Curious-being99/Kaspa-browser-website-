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
import { ReleasesViewer } from './components/ReleasesViewer';
import { InstallationGuide } from './components/InstallationGuide';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { QrCodeModal } from './components/QrCodeModal';

import { GitHubRelease, GitHubRepoMeta } from './types';
import { 
  fetchLatestRelease, 
  fetchAllReleases, 
  fetchRepoMetadata,
  triggerBrowserDownload,
  getPreferredDownloadAsset
} from './services/githubService';
import { DEFAULT_LATEST_RELEASE, FALLBACK_RELEASES, FALLBACK_REPO_META } from './data/kaspaData';

export default function App() {
  const [latestRelease, setLatestRelease] = useState<GitHubRelease | null>(DEFAULT_LATEST_RELEASE);
  const [allReleases, setAllReleases] = useState<GitHubRelease[]>(FALLBACK_RELEASES);
  const [repoMeta, setRepoMeta] = useState<GitHubRepoMeta | null>(FALLBACK_REPO_META);

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  // Load live release & repo data from GitHub API with live auto-refresh
  useEffect(() => {
    async function loadGithubData() {
      try {
        const [latest, list, meta] = await Promise.all([
          fetchLatestRelease(),
          fetchAllReleases(),
          fetchRepoMetadata()
        ]);
        if (latest) {
          setLatestRelease(latest);
        }
        if (list && list.length > 0) setAllReleases(list);
        if (meta) setRepoMeta(meta);
      } catch (err) {
        console.warn('Could not refresh from GitHub API, using fallback data:', err);
      }
    }

    loadGithubData();

    // Auto-poll GitHub API every 60 seconds to dynamically detect new APK releases
    const interval = setInterval(() => {
      loadGithubData();
    }, 60000);

    // Check if URL has ?download=true or ?download=auto
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('download') === 'auto' || urlParams.get('download') === 'true') {
      setTimeout(() => {
        handleTriggerDownload();
        // Clean URL query parameters so refreshing does not force reload/download
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 500);
    }

    return () => clearInterval(interval);
  }, []);

  const handleTriggerDownload = (release?: GitHubRelease) => {
    const targetRelease = release || latestRelease || DEFAULT_LATEST_RELEASE;
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

        {/* 5. GitHub Releases Stream & Detailed Changelog */}
        <ReleasesViewer
          releases={allReleases}
        />

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
