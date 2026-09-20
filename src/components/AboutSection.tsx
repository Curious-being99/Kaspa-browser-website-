import React from 'react';
import { 
  Info, 
  ShieldCheck, 
  Code2, 
  Github, 
  ExternalLink, 
  Layers, 
  Network, 
  Lock, 
  Zap, 
  Globe2, 
  Radio, 
  Sparkles,
  GitPullRequest
} from 'lucide-react';
import { GITHUB_REPO_URL, GITHUB_RELEASES_URL } from '../data/kaspaData';
import { GitHubRelease } from '../types';

interface AboutSectionProps {
  latestRelease: GitHubRelease | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  latestRelease
}) => {
  return (
    <section id="about-us" className="py-20 bg-[#0C0D10] border-t border-[#282C37]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14161C] border border-[#70C7BA]/40 text-xs font-mono text-[#70C7BA]">
            <Info className="w-3.5 h-3.5" />
            <span>ABOUT KASPABROWSER • ORG.KASPA.BROWSER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy-First, Decentralized Android Web Browser &amp; Web3 Gateway
          </h2>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Kaspa Browser is a privacy-first, decentralized Android web browser and Web3 gateway designed to seamlessly bridge standard web browsing with peer-to-peer decentralized technologies and the Kaspa network ecosystem.
          </p>
        </div>

        {/* 2-Column Content: Mission / Narrative + Key Functionalities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          
          {/* Left: What it is all about & Open Source ethos */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-2xl bg-[#14161C] border border-[#282C37] space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                <Globe2 className="w-5 h-5 text-[#70C7BA]" />
                <span>What is KaspaBrowser?</span>
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                <strong>Kaspa Browser (Package ID: <code className="text-[#70C7BA] font-mono text-xs">org.kaspa.browser</code>)</strong> is a privacy-first, decentralized Android web browser and Web3 gateway designed to seamlessly bridge standard web browsing with peer-to-peer decentralized technologies and the Kaspa network ecosystem.
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                Built with <strong>Kotlin</strong> and <strong>Jetpack Compose (Material 3)</strong>, it unifies standard web browsing, decentralized peer-to-peer mesh discovery, cryptographic identity management, on-device local node hosting, and native Kaspa BlockDAG (KAS) wallet utilities into a fast, privacy-first mobile client.
              </p>
            </div>

            {/* Open Source Commitment Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#14161C] to-[#181c24] border border-[#70C7BA]/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-base">
                  <ShieldCheck className="w-5 h-5 text-[#70C7BA]" />
                  <span>100% Free &amp; Open Source</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#70C7BA]/20 text-[#70C7BA] border border-[#70C7BA]/40 font-bold">
                  Apache 2.0
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Security and sovereignty are fundamental to decentralized technology. KaspaBrowser is completely open source—all code for on-device cryptographic key management, Room SQLite database caching, and protocol interception is publicly verifiable on GitHub.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0C0D10] border border-[#282C37] text-xs font-mono text-gray-200 hover:text-white hover:border-gray-500 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Inspect Source Code</span>
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </a>
                <a
                  href={GITHUB_RELEASES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0C0D10] border border-[#282C37] text-xs font-mono text-gray-200 hover:text-white hover:border-gray-500 transition-colors"
                >
                  <GitPullRequest className="w-3.5 h-3.5 text-[#70C7BA]" />
                  <span>Changelogs &amp; Releases</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Key Functionalities Breakdown */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-sm font-bold font-mono text-[#70C7BA] uppercase tracking-wider mb-2">
              Key Functionalities from GitHub Releases:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              <div className="p-4 rounded-xl bg-[#14161C] border border-[#282C37] hover:border-[#70C7BA]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#0C0D10] border border-[#282C37] flex items-center justify-center text-[#70C7BA] mb-2.5">
                  <Network className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">BlockDAG Network Explorer</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Real-time querying of UTXO balances, sompis values, block blue scores, and instant GHOSTDAG transactions.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#14161C] border border-[#282C37] hover:border-[#70C7BA]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#0C0D10] border border-[#282C37] flex items-center justify-center text-[#70C7BA] mb-2.5">
                  <Radio className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">P2P Mesh Discovery</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Visual radar finding nearby peers over Wi-Fi Direct and LAN with on-device micro-daemon hosting.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#14161C] border border-[#282C37] hover:border-[#70C7BA]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#0C0D10] border border-[#282C37] flex items-center justify-center text-[#70C7BA] mb-2.5">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">HTTP/3 QUIC Transport</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  0-RTT connection handshakes over UDP with zero head-of-line packet blocking and fast network roaming.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#14161C] border border-[#282C37] hover:border-[#70C7BA]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#0C0D10] border border-[#282C37] flex items-center justify-center text-[#70C7BA] mb-2.5">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Privacy &amp; Security Shield</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  HTTPS-only enforcement, live tracker interception, FIDO2 biometric passkeys, and one-tap Room DB purge.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
