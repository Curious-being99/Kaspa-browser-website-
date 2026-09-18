import React from 'react';
import { Download, ShieldAlert, CheckCircle, Smartphone, Lock, CheckCircle2 } from 'lucide-react';
import { GITHUB_REPO_URL } from '../data/kaspaData';

export const InstallationGuide: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Download Release APK',
      desc: 'Download KaspaBrowser-release-signed.apk directly using the Auto Download button at the top of the page.',
      icon: <Download className="w-5 h-5 text-[#70C7BA]" />
    },
    {
      step: '02',
      title: 'Enable Unknown Sources',
      desc: 'When opening the APK on Android, allow "Install Unknown Apps" for your mobile browser or Files app in system settings.',
      icon: <ShieldAlert className="w-5 h-5 text-amber-400" />
    },
    {
      step: '03',
      title: 'Install & Launch',
      desc: 'Tap "Install". KaspaBrowser installs cleanly without unnecessary permissions or background telemetry tracking.',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />
    },
    {
      step: '04',
      title: 'Fast & Private Browsing',
      desc: 'Browse with HTTP/3 QUIC acceleration, automated HTTPS upgrade, and tracker protection.',
      icon: <Smartphone className="w-5 h-5 text-[#6366F1]" />
    }
  ];

  return (
    <section id="install-guide" className="py-20 bg-[#0C0D10] border-t border-[#282C37]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14161C] border border-[#70C7BA]/30 text-xs font-mono text-[#70C7BA]">
            <Smartphone className="w-3.5 h-3.5" />
            <span>SIDELOAD INSTRUCTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How to Install KaspaBrowser on Android
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            Follow these 4 straightforward steps to sideload the signed APK on any device running Android 8.0 through Android 16.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((item, index) => (
            <div
              key={index}
              className="relative p-6 rounded-2xl bg-[#14161C] border border-[#282C37] hover:border-[#70C7BA]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0C0D10] border border-[#282C37] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-xl font-extrabold font-mono text-gray-600">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 font-mono">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#282C37]/60 text-[10px] font-mono text-gray-500">
                Step {index + 1} of 4
              </div>
            </div>
          ))}
        </div>

        {/* Security & Verification Callout Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#14161C] via-[#1a1e27] to-[#14161C] border border-[#70C7BA]/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#70C7BA]/10 border border-[#70C7BA]/40 flex items-center justify-center text-[#70C7BA] shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                Cryptographically Signed &amp; Auditable
              </h4>
              <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
                Every release APK is compiled and signed directly via GitHub Actions CI/CD. You can independently verify SHA-256 checksums or inspect the Apache 2.0 source code.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0C0D10] border border-[#70C7BA]/40 text-xs font-mono text-[#70C7BA] shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>GitHub CI/CD Signed Build</span>
          </div>
        </div>

      </div>
    </section>
  );
};
