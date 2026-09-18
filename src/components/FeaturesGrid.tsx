import React, { useState } from 'react';
import { 
  Globe, 
  Wallet, 
  Radio, 
  ShieldCheck, 
  KeyRound, 
  Zap, 
  CheckCircle2, 
  Code2, 
  ArrowUpRight,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { FEATURES } from '../data/kaspaData';
import { FeatureItem } from '../types';

export const FeaturesGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'privacy' | 'blockchain' | 'network'>('all');

  const filteredFeatures = activeCategory === 'all' 
    ? FEATURES 
    : FEATURES.filter(f => f.category === activeCategory);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Globe': return <Globe className="w-6 h-6 text-[#70C7BA]" />;
      case 'Wallet': return <Wallet className="w-6 h-6 text-[#70C7BA]" />;
      case 'Radar': return <Radio className="w-6 h-6 text-[#70C7BA]" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-[#70C7BA]" />;
      case 'KeyRound': return <KeyRound className="w-6 h-6 text-[#70C7BA]" />;
      case 'Zap': return <Zap className="w-6 h-6 text-[#70C7BA]" />;
      default: return <Sparkles className="w-6 h-6 text-[#70C7BA]" />;
    }
  };

  return (
    <section id="features" className="py-20 bg-[#0C0D10] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14161C] border border-[#70C7BA]/30 text-xs font-mono text-[#70C7BA]">
            <Layers className="w-3.5 h-3.5" />
            <span>WHAT KASPABROWSER IS ALL ABOUT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built from the Ground Up for Decentralized Speed &amp; Privacy
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            A comprehensive overview of the architecture, protocol interceptors, cryptography engines, and BlockDAG utilities baked natively into KaspaBrowser.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {[
              { id: 'all', label: 'All Capabilities' },
              { id: 'core', label: 'Hybrid Engine' },
              { id: 'blockchain', label: 'Kaspa BlockDAG' },
              { id: 'network', label: 'P2P Mesh & QUIC' },
              { id: 'privacy', label: 'Privacy & Security' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-[#70C7BA] text-[#0C0D10] font-bold'
                    : 'bg-[#14161C] text-gray-400 border border-[#282C37] hover:text-white hover:border-gray-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature: FeatureItem) => (
            <div
              key={feature.id}
              id={`feature-card-${feature.id}`}
              className="group relative rounded-2xl bg-[#14161C] border border-[#282C37] p-6 hover:border-[#70C7BA]/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header Icon + Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0C0D10] border border-[#282C37] group-hover:border-[#70C7BA]/40 flex items-center justify-center transition-colors">
                    {getIcon(feature.iconName)}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-[#70C7BA]/10 text-[#70C7BA] border border-[#70C7BA]/30">
                    {feature.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#70C7BA] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-5 leading-relaxed">
                  {feature.description}
                </p>

                {/* Clean Feature Highlights List */}
                <ul className="space-y-2.5 mb-6">
                  {feature.highlights.map((highlight, idx) => (
                    <li 
                      key={idx} 
                      className="flex items-start gap-2.5 text-xs text-gray-300 font-sans tracking-tight leading-snug"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#70C7BA] mt-1.5 shrink-0 opacity-80" />
                      <span className="text-gray-300 group-hover:text-gray-200 transition-colors">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Tech Footnote */}
              <div className="pt-4 border-t border-[#282C37] flex items-center justify-between text-[11px] font-mono text-gray-500">
                <span className="truncate pr-2">{feature.techDetail}</span>
                <Code2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
