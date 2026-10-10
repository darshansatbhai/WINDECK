"use client";

import { Sparkles, Check } from "lucide-react";

export default function PriceComparison() {
  return (
    <section className="relative bg-black py-32 sm:py-40 px-6 border-t border-white/[0.04] overflow-hidden">
      {/* Background glow blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-[#5E6AD2] opacity-[0.05] blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-[38px] sm:text-[54px] md:text-[68px] font-bold tracking-[-0.035em] leading-[1.08] mb-6">
          The StreamDeck<br />
          <span className="text-white/30">you already own.</span>
        </h2>

        {/* Price comparison numbers */}
        <div className="mt-14 sm:mt-20 flex items-center justify-center gap-8 sm:gap-20">
          {/* Elgato StreamDeck $250 */}
          <div className="flex flex-col items-center gap-3 group">
            <div className="relative inline-block">
              <span className="text-[56px] sm:text-[84px] md:text-[96px] font-bold tracking-tight text-white/35 transition-colors group-hover:text-white/50">
                $250
              </span>
              <span className="absolute left-[-5%] top-[52%] w-[110%] h-[4px] sm:h-[5px] rounded-full bg-red-500/80 shadow-[0_0_12px_rgba(239,68,68,0.5)] rotate-[-6deg]" />
            </div>
            <span className="text-[12px] font-semibold text-white/30 uppercase tracking-[0.2em]">
              Hardware StreamDeck
            </span>
          </div>

          <span className="text-[16px] sm:text-[20px] text-white/20 font-light">vs</span>

          {/* WinDeck $0 */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative inline-block">
              <span className="text-[56px] sm:text-[84px] md:text-[96px] font-bold tracking-tight text-white drop-shadow-[0_0_35px_rgba(94,106,210,0.6)]">
                $0
              </span>
              <span className="absolute -top-3 -right-6 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                FREE
              </span>
            </div>
            <span className="text-[12px] font-semibold text-[#8B97E8] uppercase tracking-[0.2em] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5E6AD2]" />
              WinDeck
            </span>
          </div>
        </div>

        <p className="mt-12 text-[16px] sm:text-[18px] text-white/40 max-w-lg mx-auto leading-relaxed font-light">
          The hardware is already in your pocket. Or sitting on your desk stand. You paid for it years ago.
        </p>

        {/* Feature Checkpoints */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-left">
          <div className="flex items-center gap-2.5 text-[13px] text-white/70">
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-2.5 h-2.5" />
            </div>
            <span>Zero hardware cost</span>
          </div>
          <div className="flex items-center gap-2.5 text-[13px] text-white/70">
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-2.5 h-2.5" />
            </div>
            <span>Unlimited Pages</span>
          </div>
          <div className="flex items-center gap-2.5 text-[13px] text-white/70">
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-2.5 h-2.5" />
            </div>
            <span>Wireless local Wi-Fi</span>
          </div>
          <div className="flex items-center gap-2.5 text-[13px] text-white/70">
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-2.5 h-2.5" />
            </div>
            <span>Open source</span>
          </div>
        </div>
      </div>
    </section>
  );
}
