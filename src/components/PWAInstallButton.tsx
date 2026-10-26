import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#70C7BA] text-[#0C0D10] text-xs font-bold hover:brightness-110 transition-all shadow-sm shadow-[#70C7BA]/20 cursor-pointer"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#70C7BA]/40 text-[#70C7BA] text-xs font-bold hover:bg-[#70C7BA]/10 transition-all cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#14161C] border border-[#282C37] p-6 shadow-2xl animate-fadeIn relative">
              <button 
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-lg font-extrabold text-white mb-4">Install on iPhone / iPad</h3>
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#70C7BA]/20 flex items-center justify-center text-[#70C7BA] font-bold text-xs shrink-0 mt-0.5">1</div>
                  <p>Tap the <span className="font-bold text-white">Share</span> button in the Safari toolbar (the square with an arrow pointing up).</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#70C7BA]/20 flex items-center justify-center text-[#70C7BA] font-bold text-xs shrink-0 mt-0.5">2</div>
                  <p>Scroll down and tap <span className="font-bold text-white">Add to Home Screen</span>.</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-[#0C0D10] border border-[#282C37] py-2.5 text-sm font-bold text-[#70C7BA] hover:bg-[#14161C] transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
