import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQS } from '../data/kaspaData';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIdx(openIdx === i ? null : i);
  };

  return (
    <section id="faq" className="py-20 bg-[#0C0D10] border-t border-[#282C37]/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14161C] border border-[#70C7BA]/30 text-xs font-mono text-[#70C7BA]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>COMMONLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-400">
            Everything you need to know about KaspaBrowser, its decentralized features, and APK safety.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all ${
                  isOpen 
                    ? 'bg-[#14161C] border-[#70C7BA]/40 shadow-lg' 
                    : 'bg-[#14161C]/60 border-[#282C37] hover:border-gray-600'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 select-none cursor-pointer"
                >
                  <span className="font-semibold text-sm sm:text-base text-white">
                    {faq.q}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#0C0D10] border border-[#282C37] flex items-center justify-center text-gray-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#70C7BA]" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-[#282C37]/50 whitespace-pre-line animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
