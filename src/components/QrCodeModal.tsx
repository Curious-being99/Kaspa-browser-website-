import React, { useState } from 'react';
import { X, QrCode, Smartphone, Copy, Check, ExternalLink } from 'lucide-react';
import { GitHubRelease } from '../types';
import { getPreferredDownloadAsset } from '../services/githubService';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  latestRelease: GitHubRelease | null;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  latestRelease
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const preferredAsset = latestRelease ? getPreferredDownloadAsset(latestRelease) : null;
  const downloadUrl = preferredAsset?.browser_download_url || 
    (latestRelease?.tag_name 
      ? `https://github.com/Curious-being99/Kaspa-browser-/releases/download/${latestRelease.tag_name}/KaspaBrowser-release-signed.apk`
      : `https://github.com/Curious-being99/Kaspa-browser-/releases/latest/download/KaspaBrowser-release-signed.apk`);

  // Encode QR URL using google chart API or high reliability QR proxy
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(downloadUrl)}&bgcolor=14-16-28&color=112-199-186&margin=10`;

  const copyUrl = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        id="qr-modal-card"
        className="relative w-full max-w-md rounded-2xl bg-[#14161C] border border-[#70C7BA]/50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(112,199,186,0.2)] text-center"
      >
        {/* Close Button */}
        <button
          id="qr-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg bg-[#282C37]/50 hover:bg-[#282C37] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="inline-flex p-3 rounded-2xl bg-[#70C7BA]/10 border border-[#70C7BA]/30 text-[#70C7BA] mb-3">
          <Smartphone className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Scan to Install on Android
        </h2>
        <p className="text-xs text-gray-400 mt-1 mb-4">
          Point your Android camera or QR scanner at the code below to download the latest release APK directly to your phone.
        </p>

        {/* QR Code Container */}
        <div className="mx-auto w-64 h-64 p-3 bg-[#0C0D10] rounded-2xl border border-[#70C7BA]/40 flex items-center justify-center shadow-inner relative group">
          <img 
            src={qrApiUrl} 
            alt="KaspaBrowser APK Download QR Code" 
            className="w-full h-full object-contain rounded-lg"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center pointer-events-none">
            <span className="text-xs font-mono font-bold text-[#70C7BA] bg-[#0C0D10]/90 px-3 py-1.5 rounded-lg border border-[#70C7BA]/40">
              Direct APK Link
            </span>
          </div>
        </div>

        {/* URL Box & Copy */}
        <div className="mt-4 p-2.5 rounded-xl bg-[#0C0D10] border border-[#282C37] flex items-center justify-between gap-2 text-xs">
          <span className="font-mono text-gray-400 truncate text-[11px] text-left">
            {downloadUrl}
          </span>
          <button
            onClick={copyUrl}
            className="px-2.5 py-1 rounded bg-[#282C37] hover:bg-[#343946] text-gray-200 font-mono text-[11px] shrink-0 transition-colors flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-[#70C7BA]" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Close action */}
        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-[#282C37] hover:bg-[#343946] text-white text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
