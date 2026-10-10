"use client";

import { Monitor, Smartphone, Check, Cpu, Zap, Shield, Wifi } from "lucide-react";

export default function VersionSpecs() {
  return (
    <section className="bg-black py-28 px-6 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-white/[0.03] text-[11px] font-semibold text-white/70 mb-3 uppercase tracking-widest">
            Release Architecture
          </div>
          <h2 className="text-[36px] sm:text-[48px] font-bold tracking-tight">
            Current App Versions & Specs
          </h2>
          <p className="text-[15px] text-white/45 max-w-lg mx-auto mt-2">
            Both apps are engineered for local-only, zero-cloud execution with sub-5ms input latency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Windows Specs Card */}
          <div className="p-8 rounded-3xl border border-white/[0.08] bg-white/[0.02] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/30 flex items-center justify-center text-[#8B97E8]">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-white">Windows Server</h3>
                    <p className="text-[12px] text-white/40">Desktop Host Engine</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#5E6AD2]/20 border border-[#5E6AD2]/40 text-[#8B97E8] font-mono text-[12px] font-bold">
                  v2.4.0
                </span>
              </div>

              <div className="space-y-3 text-[13px] text-white/60">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Electron & Node.js:</strong> Lightweight background daemon</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Native Volume Mixer:</strong> Windows CoreAudio API integration</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Active Window Hook:</strong> Auto-detect focused app</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>System Tray:</strong> Background execution with minimize-to-tray</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Compatibility:</strong> Windows 10 & Windows 11 (64-bit)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/30 font-mono">
              <span>windeck-server@1.0.0</span>
              <span>Port: 5000 (Local)</span>
            </div>
          </div>

          {/* Android Specs Card */}
          <div className="p-8 rounded-3xl border border-white/[0.08] bg-white/[0.02] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-white">Android Client</h3>
                    <p className="text-[12px] text-white/40">Handheld Deck Remote</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 font-mono text-[12px] font-bold">
                  v2.4.0
                </span>
              </div>

              <div className="space-y-3 text-[13px] text-white/60">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Flutter Engine:</strong> 60fps/120fps smooth responsive UI</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Socket.IO Client:</strong> Instant binary stream communication</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Haptic Vibration:</strong> Real-time tactile physical touch feedback</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Soundboard Player:</strong> Integrated audio effects engine</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Compatibility:</strong> Android 8.0 Oreo up to Android 15</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/30 font-mono">
              <span>windeck@1.0.0+1</span>
              <span>Local Wi-Fi Client</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
