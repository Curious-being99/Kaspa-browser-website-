import React from 'react';
import { 
  Github, 
  ExternalLink, 
  ArrowUp, 
  ShieldCheck, 
  Radio, 
  Globe 
} from 'lucide-react';
import { KaspaLogo } from './KaspaLogo';
import { GITHUB_REPO_URL, GITHUB_RELEASES_URL } from '../data/kaspaData';
import { GitHubRelease } from '../types';

interface FooterProps {
  latestRelease: GitHubRelease | null;
}

export const Footer: React.FC<FooterProps> = ({ latestRelease }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0C0D10] border-t border-[#282C37] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#282C37]">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <KaspaLogo className="w-8 h-8 rounded-full" />
              <span className="font-extrabold text-lg tracking-tight text-white">
                Kaspa<span className="text-[#70C7BA]">Browser</span>
              </span>
            </div>

            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              Kaspa Browser is a privacy-first, decentralized Android web browser and Web3 gateway designed to seamlessly bridge standard web browsing with peer-to-peer decentralized technologies and the Kaspa network ecosystem. Built with Kotlin and Jetpack Compose (Material 3).
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#14161C] border border-[#282C37] text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
                title="GitHub Repo"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/curiousbeing99"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#14161C] border border-[#282C37] text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
                title="X (Twitter)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold font-mono text-[#70C7BA] uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs font-mono">
              <li>
                <a href="#overview" className="group flex items-center justify-between py-2 px-3 rounded-xl bg-[#14161C]/60 hover:bg-[#14161C] border border-[#282C37]/80 hover:border-[#70C7BA]/40 text-gray-300 hover:text-white transition-all shadow-sm">
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#70C7BA] group-hover:scale-125 transition-transform"></span>
                    Overview
                  </span>
                  <span className="text-[10px] text-gray-500 group-hover:text-[#70C7BA]">01</span>
                </a>
              </li>
              <li>
                <a href="#about-us" className="group flex items-center justify-between py-2 px-3 rounded-xl bg-[#14161C]/60 hover:bg-[#14161C] border border-[#282C37]/80 hover:border-[#70C7BA]/40 text-gray-300 hover:text-white transition-all shadow-sm">
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#70C7BA] group-hover:scale-125 transition-transform"></span>
                    About Us
                  </span>
                  <span className="text-[10px] text-gray-500 group-hover:text-[#70C7BA]">02</span>
                </a>
              </li>
              <li>
                <a href="#features" className="group flex items-center justify-between py-2 px-3 rounded-xl bg-[#14161C]/60 hover:bg-[#14161C] border border-[#282C37]/80 hover:border-[#70C7BA]/40 text-gray-300 hover:text-white transition-all shadow-sm">
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#70C7BA] group-hover:scale-125 transition-transform"></span>
                    Core Features
                  </span>
                  <span className="text-[10px] text-gray-500 group-hover:text-[#70C7BA]">03</span>
                </a>
              </li>
              <li>
                <a href="#architecture" className="group flex items-center justify-between py-2 px-3 rounded-xl bg-[#14161C]/60 hover:bg-[#14161C] border border-[#282C37]/80 hover:border-[#70C7BA]/40 text-gray-300 hover:text-white transition-all shadow-sm">
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#70C7BA] group-hover:scale-125 transition-transform"></span>
                    Architecture
                  </span>
                  <span className="text-[10px] text-gray-500 group-hover:text-[#70C7BA]">04</span>
                </a>
              </li>

              <li>
                <a href="#install-guide" className="group flex items-center justify-between py-2 px-3 rounded-xl bg-[#14161C]/60 hover:bg-[#14161C] border border-[#282C37]/80 hover:border-[#70C7BA]/40 text-gray-300 hover:text-white transition-all shadow-sm">
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#70C7BA] group-hover:scale-125 transition-transform"></span>
                    Installation Guide
                  </span>
                  <span className="text-[10px] text-gray-500 group-hover:text-[#70C7BA]">06</span>
                </a>
              </li>
              <li>
                <a href="#faq" className="group flex items-center justify-between py-2 px-3 rounded-xl bg-[#14161C]/60 hover:bg-[#14161C] border border-[#282C37]/80 hover:border-[#70C7BA]/40 text-gray-300 hover:text-white transition-all shadow-sm">
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#70C7BA] group-hover:scale-125 transition-transform"></span>
                    FAQ
                  </span>
                  <span className="text-[10px] text-gray-500 group-hover:text-[#70C7BA]">07</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold font-mono text-[#70C7BA] uppercase tracking-wider">
              Official Ecosystem &amp; $KB Token
            </h4>
            <ul className="space-y-2 text-xs font-mono">

              <li>
                <a 
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center py-2.5 px-3 rounded-xl bg-[#14161C]/60 hover:bg-[#14161C] border border-[#282C37]/80 hover:border-[#70C7BA]/40 text-gray-300 hover:text-white transition-all shadow-sm w-full"
                >
                  <Github className="w-4 h-4" />
                </a>
              </li>


              <li>
                <a 
                  href="https://kaspa.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#14161C]/60 hover:bg-[#14161C] border border-[#282C37]/80 hover:border-[#70C7BA]/40 text-gray-300 hover:text-white transition-all shadow-sm"
                >
                  <span>Kaspa Network Official (kaspa.org)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#70C7BA] flex-shrink-0" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/Curious-being99/Kaspa-browser-/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#14161C]/60 hover:bg-[#14161C] border border-[#282C37]/80 hover:border-[#70C7BA]/40 text-gray-300 hover:text-white transition-all shadow-sm"
                >
                  <span>Apache License 2.0 (Open Source)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#70C7BA] flex-shrink-0" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright and Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <div>
            KaspaBrowser © 2026. Open-source under Apache 2.0 License.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-gray-400 hover:text-[#70C7BA] transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
