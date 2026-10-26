import React from 'react';
import { motion } from 'motion/react';
import { Coins, Terminal, Zap, Shield, ArrowUpRight } from 'lucide-react';
import { KaspaLogo } from './KaspaLogo';

export const EcosystemSection: React.FC = () => {
  return (
    <section id="ecosystem" className="py-24 bg-[#0C0D10] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            The $KB & Si Agent <span className="text-[#70C7BA]">Ecosystem</span>
          </h2>
          <p className="text-gray-400 max-w-2xl text-lg">
            Beyond browsing, KaspaBrowser integrates deeply with the BlockDAG network through utility-driven assets and advanced command automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* $KB Token Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group p-8 rounded-3xl bg-[#14161C] border border-[#282C37] hover:border-[#70C7BA]/40 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#70C7BA]/10 flex items-center justify-center text-[#70C7BA]">
                <Coins className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">$KB Utility Token</h3>
                <div className="text-[#70C7BA] text-sm font-mono mt-1">Contract: b75a6...47b4d8</div>
              </div>
            </div>
            
            <p className="text-gray-400 mb-8 leading-relaxed">
              The $KB token is the native utility asset powering the KaspaBrowser ecosystem. It enables premium features, governance participation, and fuels decentralized transactions within the browser.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                'Access premium Web3 gateways',
                'Priority mesh network routing',
                'Ecosystem governance rights',
                'Staking for browser rewards'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#70C7BA]" />
                  {item}
                </li>
              ))}
            </ul>

            <a 
              href="https://kasparocket.fun/token/b75a6e90f569965bdeec23c460ebd59e0f0445d8aa8f5d4330fe15c66a47b4d8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#70C7BA] text-[#0C0D10] font-bold text-sm hover:brightness-110 transition-all"
            >
              Buy $KB Token
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Si Agent Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group p-8 rounded-3xl bg-[#14161C] border border-[#282C37] hover:border-[#70C7BA]/40 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#70C7BA]/10 flex items-center justify-center text-[#70C7BA]">
                <Terminal className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Si Agent Command</h3>
                <div className="text-[#70C7BA] text-sm font-mono mt-1">Live Automation Protocol</div>
              </div>
            </div>
            
            <p className="text-gray-400 mb-8 leading-relaxed">
              Advanced support for managing wallet live activities and streamlining decentralized transactions. Si Agent Command acts as your intelligent co-pilot for the BlockDAG network.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                'Automated wallet live activities',
                'Real-time transaction batching',
                'Smart gas optimization',
                'Cross-chain command support'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#70C7BA]" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm italic">
              Integrated in v2.1+
            </div>
          </motion.div>
        </div>

        {/* Slogan Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#70C7BA]/20 to-transparent border border-[#70C7BA]/30 text-center"
        >
          <div className="text-2xl sm:text-3xl font-black text-[#70C7BA] italic tracking-tight">
            "WE STAND, BUILD, HOLD, TRADE & SUCCEED"
          </div>
          <p className="text-gray-400 mt-4 text-sm font-medium uppercase tracking-[0.2em]">
            The KaspaBrowser Core Philosophy
          </p>
        </motion.div>
      </div>

      {/* Decorative background logo */}
      <div className="absolute -right-24 -bottom-24 opacity-5 rotate-12 pointer-events-none">
        <KaspaLogo className="w-96 h-96" />
      </div>
    </section>
  );
};
