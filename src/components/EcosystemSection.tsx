import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Coins, Terminal, ArrowUpRight, TrendingUp, TrendingDown, RefreshCw, Activity, AlertCircle } from 'lucide-react';
import { KaspaLogo } from './KaspaLogo';
import { fetchKbTokenStats, TokenStats, KB_TOKEN_CONTRACT } from '../services/tokenService';
import { LiveKaspaStats } from '../services/liveKaspaService';

interface EcosystemSectionProps {
  kaspaStats: LiveKaspaStats | null;
}

export const EcosystemSection: React.FC<EcosystemSectionProps> = ({ kaspaStats }) => {
  const [kasInput, setKasInput] = useState<string>('100');
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  const loadTokenData = async (showSpinner = false) => {
    if (showSpinner) setIsLoadingToken(true);
    try {
      const stats = await fetchKbTokenStats();
      if (stats) {
        setTokenStats(stats);
        setError(null);
      } else if (!tokenStats) {
        setError("Waiting for live data...");
      }
    } finally {
      if (showSpinner) setIsLoadingToken(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let timerId: ReturnType<typeof setTimeout>;

    // Real-time streaming loop (every 4 seconds, within the requested 3-5s window)
    const streamCycle = async () => {
      await loadTokenData(false);
      if (isMounted) {
        timerId = setTimeout(streamCycle, 4000);
      }
    };

    // Initial fetch with spinner
    loadTokenData(true);
    timerId = setTimeout(streamCycle, 4000);

    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, []);

  const handleKasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKasInput(e.target.value);
  };


  const kasAmount = parseFloat(kasInput) || 0;
  
  // Real price calculation from DEX pair
  const kbPriceInKas = tokenStats?.priceNative || 0;
  const kbPerKas = tokenStats?.kbPerKas || (kbPriceInKas > 0 ? 1 / kbPriceInKas : 0);
  const estimatedKbOutput = kasAmount * kbPerKas;

  return (
    <section id="ecosystem" className="py-24 bg-[#0C0D10] relative overflow-hidden box-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full box-border">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            The $KB & Si Agent <span className="text-[#70C7BA]">Ecosystem</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          {/* $KB Token & Live REST API Telemetry Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group p-6 sm:p-8 rounded-3xl bg-[#14161C] border border-[#282C37] hover:border-[#70C7BA]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden box-border relative"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl overflow-hidden shadow-md">
                    {tokenStats?.imageUrl && !imageError ? (
                      <img 
                        src={tokenStats.imageUrl} 
                        alt="$KB Token" 
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <KaspaLogo className="w-full h-full" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-white truncate">$KB</h3>
                    <div className="text-[#70C7BA] text-xs font-mono mt-1 flex items-center gap-2">
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button 
                    onClick={() => loadTokenData(true)}
                    disabled={isLoadingToken}
                    className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-[#70C7BA] hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingToken ? 'animate-spin text-[#70C7BA]' : ''}`} />
                  </button>
                  <div className="px-3 py-1 rounded-full bg-[#70C7BA]/10 text-[#70C7BA] text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1.5 shrink-0">
                    <Activity className="w-3 h-3 animate-pulse text-[#70C7BA]" />
                    LIVE STREAM (4s)
                  </div>
                </div>
              </div>
              
              {/* REAL-TIME Telemetry */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6 p-3 sm:p-4 rounded-2xl bg-[#0C0D10] border border-white/5 font-mono overflow-hidden">
                <div className="min-w-0">
                  <div className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider truncate">Price (KAS)</div>
                  <div className="text-[#70C7BA] font-bold text-sm sm:text-base mt-1 truncate" title={tokenStats ? `${tokenStats.priceNative} KAS` : ''}>
                    {tokenStats ? `${tokenStats.priceNative < 0.001 ? tokenStats.priceNative.toFixed(8) : tokenStats.priceNative.toFixed(6)} KAS` : '---'}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider truncate">Rate (KB/KAS)</div>
                  <div className="text-white font-bold text-sm sm:text-base mt-1 truncate">
                    {tokenStats && tokenStats.kbPerKas > 0 ? `${tokenStats.kbPerKas.toLocaleString(undefined, { maximumFractionDigits: 2 })} KB` : '---'}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider truncate">Price (USD)</div>
                  <div className="text-white font-bold text-sm sm:text-base mt-1 truncate" title={tokenStats ? `$${tokenStats.priceUsd}` : ''}>
                    {tokenStats ? `$${tokenStats.priceUsd < 0.0001 ? tokenStats.priceUsd.toFixed(8) : tokenStats.priceUsd.toFixed(6)}` : '---'}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider truncate">24h Change</div>
                  <div className={`font-bold text-sm sm:text-base mt-1 flex items-center gap-1 truncate ${tokenStats && tokenStats.priceChange24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tokenStats ? (
                      <>
                        {tokenStats.priceChange24h >= 0 ? <TrendingUp className="w-3.5 h-3.5 shrink-0" /> : <TrendingDown className="w-3.5 h-3.5 shrink-0" />}
                        <span className="truncate">{`${tokenStats.priceChange24h >= 0 ? '+' : ''}${tokenStats.priceChange24h.toFixed(2)}%`}</span>
                      </>
                    ) : '---'}
                  </div>
                </div>
              </div>

              {/* Calculator */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0C0D10] border border-white/5 space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-mono">Live Estimator</span>
                  <span className="text-xs text-[#70C7BA] font-mono">
                    24h Vol: {tokenStats ? `$${tokenStats.volume24h.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '---'}
                  </span>
                </div>

                <div className="relative">
                  <input 
                    type="number" 
                    value={kasInput}
                    onChange={handleKasChange}
                    className="w-full bg-[#14161C] border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-base sm:text-lg focus:outline-none focus:border-[#70C7BA]"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#70C7BA]">KAS</div>
                </div>

                <div className="p-4 rounded-xl bg-[#14161C] border border-[#70C7BA]/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Receive Estimate:</span>
                    <span className="text-[#70C7BA] font-bold font-mono text-base truncate">
                      {estimatedKbOutput > 0 ? estimatedKbOutput.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'} $KB
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 flex items-center gap-2 text-xs text-red-400 font-mono bg-red-400/5 p-2 rounded-lg border border-red-400/20">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </div>
              )}
            </div>

            <a 
              href={`https://kasparocket.fun/token/${KB_TOKEN_CONTRACT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#70C7BA] text-[#0C0D10] font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-[#70C7BA]/10"
            >
              <span>View Pair on KaspaRocket</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Si Agent Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group p-6 sm:p-8 rounded-3xl bg-[#14161C] border border-[#282C37] hover:border-[#70C7BA]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden box-border"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-[#70C7BA]/10 flex items-center justify-center text-[#70C7BA]">
                  <Terminal className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-white truncate">Si Agent Command</h3>
                  <div className="text-[#70C7BA] text-xs sm:text-sm font-mono mt-1 truncate">Live Automation Protocol</div>
                </div>
              </div>
              
              <div className="mb-4" />

              <ul className="space-y-4 mb-8">
                {[
                  'Automated wallet live activities',
                  'Real-time transaction batching',
                  'Smart gas optimization',
                  'Cross-chain command support'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300 truncate">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#70C7BA] shrink-0" />
                    <span className="truncate">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm italic">
              Integrated in v2.1+
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative background logo */}
      <div className="absolute -right-24 -bottom-24 opacity-10 rotate-12 pointer-events-none w-96 h-96 flex items-center justify-center">
        <KaspaLogo className="w-96 h-96 text-[#70C7BA]" />
      </div>
    </section>
  );
};
