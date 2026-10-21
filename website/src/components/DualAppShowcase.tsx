"use client";

import { useState } from "react";
import { Download, Monitor, Smartphone, CheckCircle, ShieldCheck, Wifi, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import DownloadModal from "@/components/DownloadModal";

export default function DualAppShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPlatform, setModalPlatform] = useState<"windows" | "android">("windows");

  const openDownload = (platform: "windows" | "android") => {
    setModalPlatform(platform);
    setModalOpen(true);
  };

  return (
    <>
      <section id="download" className="relative bg-black py-32 sm:py-40 px-6 border-t border-white/[0.04] overflow-hidden scroll-mt-16">
        {/* Background ambient lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[400px] rounded-full bg-[#5E6AD2] opacity-[0.06] blur-[160px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[40px] sm:text-[56px] font-bold tracking-[-0.03em] leading-tight mb-4">
              Get WinDeck.
            </h2>
            <p className="text-[17px] text-white/45 leading-relaxed max-w-md mx-auto">
              Two apps. One seamless workflow. Completely free, forever.
            </p>
          </div>

          {/* Pairing notification banner */}
          <div className="mb-10 flex flex-col sm:flex-row items-center justify-center gap-3 rounded-2xl border border-[#5E6AD2]/30 bg-[#5E6AD2]/10 px-6 py-4 text-center sm:text-left">
            <div className="w-8 h-8 rounded-full bg-[#5E6AD2]/20 flex items-center justify-center text-[#8B97E8] shrink-0">
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-white">
                Instant 6-digit OTP Pairing
              </p>
              <p className="text-[13px] text-white/50">
                Launch the Windows app, open Android app on the same Wi-Fi, enter the 6-digit code once and you're paired.
              </p>
            </div>
          </div>

          {/* Two Bento Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Android Card */}
            <div
              id="android-app"
              className="rounded-3xl border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14] transition-all duration-300 overflow-hidden flex flex-col group scroll-mt-24"
            >
              {/* Visual Top Preview */}
              <div className="relative h-72 bg-[#09090b] flex items-center justify-center px-6 py-6 border-b border-white/[0.06] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <div className="absolute w-60 h-24 bg-[#5E6AD2]/20 blur-[50px] rounded-full pointer-events-none" />

                {/* Mini phone frame graphic */}
                <div className="relative w-64 rounded-2xl border border-white/20 bg-black/90 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500">
                  <div className="flex items-center justify-between text-[9px] text-white/40 mb-3 px-1">
                    <span>WinDeck Mobile</span>
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 rounded-xl bg-white/[0.06] border border-white/10 flex flex-col items-center justify-center text-[10px] text-white/80">
                      <span>🔊 Vol+</span>
                    </div>
                    <div className="h-12 rounded-xl bg-white/[0.06] border border-white/10 flex flex-col items-center justify-center text-[10px] text-white/80">
                      <span>🔉 Vol-</span>
                    </div>
                    <div className="h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex flex-col items-center justify-center text-[10px] text-red-300">
                      <span>🔇 Mute</span>
                    </div>
                    <div className="h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex flex-col items-center justify-center text-[10px] text-purple-300">
                      <span>📹 OBS</span>
                    </div>
                    <div className="h-12 rounded-xl bg-green-500/20 border border-green-500/30 flex flex-col items-center justify-center text-[10px] text-green-300">
                      <span>▶ Play</span>
                    </div>
                    <div className="h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex flex-col items-center justify-center text-[10px] text-blue-300">
                      <span>💻 Code</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Bottom */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#8B97E8]" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8B97E8]">
                      Android App
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.06] text-white/70 border border-white/10">
                    Version: v2.4.0
                  </span>
                </div>

                <h3 className="text-[24px] font-bold tracking-[-0.02em] mb-3">
                  Your wireless controller
                </h3>
                <p className="text-[15px] text-white/50 leading-relaxed mb-8 flex-1">
                  Swipe between profiles and categories. Tap any tile to trigger macros, adjust PC sound, or launch applications with zero perceivable delay.
                </p>

                <div className="mt-auto flex flex-col items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-[11px] font-medium text-green-400">
                    <CheckCircle className="w-3 h-3" />
                    <span>v2.4.0 · Android 8.0+ Ready</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                    <button
                      onClick={() => openDownload("android")}
                      className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-white text-[14px] font-semibold transition-all hover:scale-[1.02]"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download APK</span>
                    </button>
                    <a
                      href="https://github.com/darshansatbhai/WINDECK"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-white text-[14px] font-medium transition-all"
                    >
                      <GithubIcon className="w-4 h-4" />
                      <span>Source Code</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Windows Server Card */}
            <div
              id="windows-app"
              className="rounded-3xl border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14] transition-all duration-300 overflow-hidden flex flex-col group scroll-mt-24"
            >
              {/* Visual Top Preview */}
              <div className="relative h-72 bg-[#09090b] flex items-center justify-center px-6 py-6 border-b border-white/[0.06] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <div className="absolute w-60 h-24 bg-[#5E6AD2]/30 blur-[50px] rounded-full pointer-events-none" />

                {/* Windows Server GUI Mockup */}
                <div className="relative w-72 rounded-2xl border border-white/20 bg-black/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3 text-[11px]">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#5E6AD2]" />
                      <span>WinDeck Server (Windows)</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-white/20" />
                      <span className="w-2 h-2 rounded-full bg-white/20" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 text-[11px]">
                    <div className="flex justify-between items-center px-2 py-1.5 rounded-lg bg-white/[0.04]">
                      <span className="text-white/50">Status</span>
                      <span className="text-green-400 font-medium">● Online (Port 3000)</span>
                    </div>
                    <div className="flex justify-between items-center px-2 py-1.5 rounded-lg bg-white/[0.04]">
                      <span className="text-white/50">Pairing Code</span>
                      <span className="text-yellow-400 font-mono font-bold tracking-widest">849 201</span>
                    </div>
                    <div className="flex justify-between items-center px-2 py-1.5 rounded-lg bg-white/[0.04]">
                      <span className="text-white/50">Active Clients</span>
                      <span className="text-white/80">Pixel 8 Pro (Connected)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Bottom */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-[#8B97E8]" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8B97E8]">
                      Windows Desktop App
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.06] text-white/70 border border-white/10">
                    Version: v2.4.0
                  </span>
                </div>

                <h3 className="text-[24px] font-bold tracking-[-0.02em] mb-3">
                  Your PC command center
                </h3>
                <p className="text-[15px] text-white/50 leading-relaxed mb-8 flex-1">
                  Runs silently in the system tray. Powered by lightweight Node & Electron. Controls Windows system volume, active windows, OBS, and media sessions natively.
                </p>

                <div className="mt-auto flex flex-col items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#5E6AD2]/35 bg-[#5E6AD2]/10 text-[11px] font-medium text-[#8B97E8]">
                    <ShieldCheck className="w-3 h-3 text-[#5E6AD2]" />
                    <span>v2.4.0 · Windows 10 & 11 (64-bit)</span>
                  </div>

                  <button
                    onClick={() => openDownload("windows")}
                    className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-[#5E6AD2] hover:bg-[#4f5bc4] text-white text-[14px] font-semibold shadow-[0_0_28px_rgba(94,106,210,0.4)] transition-all hover:scale-[1.02]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download for Windows (.exe)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Download Dialog */}
      <DownloadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultPlatform={modalPlatform}
      />
    </>
  );
}
