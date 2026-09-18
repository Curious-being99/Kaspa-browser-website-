import React from 'react';
import { 
  Cpu, 
  Layers, 
  Boxes,
  ShieldCheck,
  Zap,
  Lock,
  Smartphone
} from 'lucide-react';
import { TECH_SPECS } from '../data/kaspaData';

export const ArchitectureSection: React.FC = () => {
  return (
    <section id="architecture" className="py-20 bg-[#0C0D10] border-t border-[#282C37]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14161C] border border-[#70C7BA]/30 text-xs font-mono text-[#70C7BA]">
            <Cpu className="w-3.5 h-3.5" />
            <span>ARCHITECTURE &amp; ENGINEERING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered with Modern Native Android Standards
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            Following Clean Architecture, Unidirectional Data Flow (UDF), and strict MVVM principles for ultra-low latency and battery efficiency.
          </p>
        </div>

        {/* 2 Column Layout: Tech Specs Table + Architecture Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Tech Specs Table */}
          <div className="lg:col-span-6 rounded-2xl bg-[#14161C] border border-[#282C37] p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#282C37]">
              <Boxes className="w-5 h-5 text-[#70C7BA]" />
              <h3 className="text-base font-bold text-white font-mono">
                Technology Stack Specifications
              </h3>
            </div>

            <div className="divide-y divide-[#282C37]">
              {TECH_SPECS.map((spec, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-mono">{spec.label}</span>
                  <span className="font-mono font-semibold text-white text-right pl-3 truncate">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-gray-400 leading-relaxed font-mono">
              * Targets modern Android 16 (API Level 36) runtime with backwards compatibility down to Android 8.0 Oreo (API Level 26).
            </div>
          </div>

          {/* Architecture Pillars */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#14161C] border border-[#282C37] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#70C7BA]/15 flex items-center justify-center text-[#70C7BA]">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold font-mono text-white">
                1. Dual-Stack Interception
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Custom WebViewClient scheme handlers intercept network requests prior to socket dispatch for decentralized protocol routing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#14161C] border border-[#282C37] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#70C7BA]/15 flex items-center justify-center text-[#70C7BA]">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold font-mono text-white">
                2. HTTP/3 &amp; QUIC Transport
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                UDP multiplexing eliminates head-of-line blocking and delivers 0-RTT connection resumption on mobile networks.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#14161C] border border-[#282C37] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#70C7BA]/15 flex items-center justify-center text-[#70C7BA]">
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold font-mono text-white">
                3. Encrypted Room SQLite
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                AndroidX Room database safely stores local browsing state with isolated sandbox security and instantaneous one-tap purge.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#14161C] border border-[#282C37] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#70C7BA]/15 flex items-center justify-center text-[#70C7BA]">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold font-mono text-white">
                4. Jetpack Compose UI
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                100% declarative Material 3 interface optimized for responsive Android navigation, dynamic theming, and low memory usage.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
