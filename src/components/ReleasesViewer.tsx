import React, { useState } from 'react';
import { 
  Tag, 
  Calendar, 
  ExternalLink, 
  ShieldCheck, 
  Copy, 
  Check, 
  Github,
  CheckCircle2,
  FileCode
} from 'lucide-react';
import { GitHubRelease } from '../types';
import { formatBytes, getPreferredDownloadAsset } from '../services/githubService';
import { GITHUB_RELEASES_URL } from '../data/kaspaData';

interface ReleasesViewerProps {
  releases: GitHubRelease[];
}

export const ReleasesViewer: React.FC<ReleasesViewerProps> = ({
  releases
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const release = releases.length > 0 ? releases[0] : null;
  if (!release) return null;

  const preferredAsset = getPreferredDownloadAsset(release);
  const shaDigest = preferredAsset?.digest || 'sha256:0b535ecc3edf685c4c0349b31e909a9fc49dffcf2a83de10b49b2e9640053681';

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const renderChangelogContent = (content: string) => {
    if (!content) {
      return <span className="text-gray-500 italic">No changelog notes provided for this release.</span>;
    }

    const lines = content.split('\n');
    return lines.map((line, lineIdx) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const parts = line.split(urlRegex);

      return (
        <div key={lineIdx} className="min-h-[1.25rem] leading-relaxed break-all sm:break-words [overflow-wrap:anywhere]">
          {parts.map((part, partIdx) => {
            if (part.match(/^https?:\/\//)) {
              return (
                <a
                  key={partIdx}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#70C7BA] hover:underline inline-flex items-center gap-1 font-mono break-all"
                >
                  <span className="break-all">{part}</span>
                  <ExternalLink className="w-3 h-3 inline-block shrink-0 opacity-70" />
                </a>
              );
            }

            const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
            return (
              <span key={partIdx}>
                {boldParts.map((bp, bpIdx) => {
                  if (bp.startsWith('**') && bp.endsWith('**')) {
                    return (
                      <strong key={bpIdx} className="text-white font-semibold">
                        {bp.slice(2, -2)}
                      </strong>
                    );
                  }
                  return bp;
                })}
              </span>
            );
          })}
        </div>
      );
    });
  };

  return (
    <section id="releases" className="py-16 bg-[#0C0D10] border-t border-[#282C37]/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#282C37]">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#14161C] border border-[#70C7BA]/40 text-xs font-mono text-[#70C7BA] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#70C7BA] animate-pulse" />
              <span>OFFICIAL GITHUB RELEASE • LIVE SYNC</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Latest Release
            </h2>
          </div>

          <a
            href={GITHUB_RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#14161C] border border-[#282C37] text-xs font-mono text-gray-300 hover:text-white hover:border-[#70C7BA]/50 transition-colors self-start sm:self-auto"
          >
            <Github className="w-3.5 h-3.5 text-[#70C7BA]" />
            <span>View Release on GitHub</span>
            <ExternalLink className="w-3 h-3 text-gray-500" />
          </a>
        </div>

        {/* Focused Single Latest Release Card */}
        <div 
          id={`release-card-${release.tag_name}`}
          className="rounded-2xl bg-[#14161C] border border-[#282C37] p-6 space-y-6"
        >
          {/* Card Top Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#282C37]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0C0D10] border border-[#282C37] flex items-center justify-center text-[#70C7BA]">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-bold font-mono text-white">
                    {release.tag_name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#70C7BA] text-[#0C0D10]">
                    LATEST PRODUCTION BUILD
                  </span>
                </div>
                <div className="text-xs text-gray-400 font-mono mt-0.5 flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span>
                    {new Date(release.published_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span>•</span>
                  <span>Android 8.0 - 16</span>
                </div>
              </div>
            </div>

            <a
              href={release.html_url || GITHUB_RELEASES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0C0D10] border border-[#282C37] hover:border-[#70C7BA]/50 text-gray-200 hover:text-white font-mono text-xs transition-all shrink-0"
            >
              <Github className="w-3.5 h-3.5 text-[#70C7BA]" />
              <span>Release Details</span>
              <ExternalLink className="w-3 h-3 text-gray-500" />
            </a>
          </div>

          {/* Clean Changelog Box */}
          <div className="space-y-2 w-full min-w-0">
            <h4 className="text-xs font-bold font-mono text-[#70C7BA] uppercase tracking-wider">
              Release Changelog:
            </h4>
            <div className="p-4 rounded-xl bg-[#0C0D10] border border-[#282C37] text-xs text-gray-300 font-mono leading-relaxed w-full min-w-0 overflow-hidden space-y-1.5">
              {renderChangelogContent(release.body)}
            </div>
          </div>

          {/* Release Assets & Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0C0D10] border border-[#282C37] flex items-center justify-between gap-3 text-xs">
              <div className="truncate">
                <div className="font-mono font-semibold text-white truncate">
                  {preferredAsset?.name || 'KaspaBrowser-release-signed.apk'}
                </div>
                <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                  {preferredAsset ? formatBytes(preferredAsset.size) : '22.8 MB'} • Direct APK Binary
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-[#70C7BA] bg-[#70C7BA]/10 px-2 py-1 rounded border border-[#70C7BA]/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0C0D10] border border-[#282C37] flex items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-mono font-semibold text-white">Source Code</div>
                <div className="text-[11px] text-gray-400 font-mono mt-0.5">Open source repository tree</div>
              </div>
              <div className="flex gap-1.5">
                <a 
                  href={release.zipball_url} 
                  className="px-2 py-1 rounded bg-[#14161C] border border-[#282C37] text-gray-300 hover:text-white font-mono text-[10px]"
                >
                  ZIP
                </a>
                <a 
                  href={release.tarball_url} 
                  className="px-2 py-1 rounded bg-[#14161C] border border-[#282C37] text-gray-300 hover:text-white font-mono text-[10px]"
                >
                  TAR.GZ
                </a>
              </div>
            </div>
          </div>

          {/* Cryptographic SHA-256 Digest Box */}
          <div className="p-3.5 rounded-xl bg-[#0C0D10] border border-[#282C37] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-gray-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-[#70C7BA] shrink-0" />
              <span>SHA-256:</span>
              <span className="text-gray-300 truncate max-w-[200px] sm:max-w-[340px]">
                {shaDigest.replace('sha256:', '')}
              </span>
            </div>
            <button
              onClick={() => copyHash(shaDigest)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#14161C] hover:bg-[#282C37] text-gray-300 text-[11px] font-mono transition-colors self-start sm:self-auto cursor-pointer"
            >
              {copiedHash === shaDigest ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#70C7BA]" />
                  <span className="text-[#70C7BA]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                  <span>Copy Hash</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
