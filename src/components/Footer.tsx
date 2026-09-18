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
              Open-source Android web browser and decentralized network gateway. Features HTTP/3 QUIC transport, custom protocol resolution, and privacy-first browsing. Built with Kotlin and Jetpack Compose.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#14161C] border border-[#282C37] text-xs font-mono text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
                title="GitHub Repo"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 text-gray-500" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold font-mono text-[#70C7BA] uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#overview" className="text-gray-400 hover:text-[#70C7BA] transition-colors flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-gray-600"></span>Overview</a></li>
              <li><a href="#about-us" className="text-gray-400 hover:text-[#70C7BA] transition-colors flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-gray-600"></span>About Us</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-[#70C7BA] transition-colors flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-gray-600"></span>Core Features</a></li>
              <li><a href="#architecture" className="text-gray-400 hover:text-[#70C7BA] transition-colors flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-gray-600"></span>Architecture</a></li>
              <li><a href="#releases" className="text-gray-400 hover:text-[#70C7BA] transition-colors flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-gray-600"></span>Latest Release</a></li>
              <li><a href="#install-guide" className="text-gray-400 hover:text-[#70C7BA] transition-colors flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-gray-600"></span>Installation Guide</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-[#70C7BA] transition-colors flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-gray-600"></span>FAQ</a></li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold font-mono text-[#70C7BA] uppercase tracking-wider">
              Official Ecosystem &amp; Source
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a 
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-gray-400 hover:text-white group"
                >
                  <span className="font-mono">Curious-being99/Kaspa-browser-</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#70C7BA]" />
                </a>
              </li>
              <li>
                <a 
                  href={GITHUB_RELEASES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-gray-400 hover:text-white group"
                >
                  <span className="font-mono">GitHub Releases Stream</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#70C7BA]" />
                </a>
              </li>
              <li>
                <a 
                  href="https://kaspa.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-gray-400 hover:text-white group"
                >
                  <span>Kaspa Network Official (kaspa.org)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#70C7BA]" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/Curious-being99/Kaspa-browser-/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-gray-400 hover:text-white group"
                >
                  <span>Apache License 2.0 (Open Source)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#70C7BA]" />
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
