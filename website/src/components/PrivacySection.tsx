"use client";

import { Shield, Lock, Wifi, EyeOff } from "lucide-react";

export default function PrivacySection() {
  return (
    <section id="privacy" className="bg-black py-36 px-6 border-t border-white/[0.04] overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5E6AD2] mb-3">
              Privacy & Security
            </p>
            <h2 className="text-[40px] sm:text-[52px] font-bold tracking-[-0.03em] leading-[1.06] mb-6">
              Nothing<br />
              <span className="text-white/25">leaves your home.</span>
            </h2>
            <p className="text-[16px] text-white/45 leading-relaxed mb-6 font-light">
              No cloud servers. No forced sign-up accounts. Zero telemetry tracking. WinDeck communicates 100% locally over your home Wi-Fi using authenticated WebSockets.
            </p>
            <p className="text-[15px] text-white/30 leading-relaxed font-light">
              Your keystrokes, application names, macros, and personal usage data never touch external cloud servers.
            </p>
          </div>

          {/* Privacy Visual Badges */}
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 flex flex-col gap-5 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[16px] font-semibold text-white mb-1">Local Network Only</h4>
                <p className="text-[13px] text-white/40 leading-relaxed">
                  Traffic stays inside your router's LAN. Even if your internet goes down, WinDeck keeps working.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center text-[#8B97E8] shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[16px] font-semibold text-white mb-1">AES-256-CBC & QR Code Pairing</h4>
                <p className="text-[13px] text-white/40 leading-relaxed">
                  Fast QR code scanning and OTP authentication with end-to-end symmetric encryption derived locally.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <EyeOff className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[16px] font-semibold text-white mb-1">Zero Telemetry</h4>
                <p className="text-[13px] text-white/40 leading-relaxed">
                  No Google Analytics, no tracking pixels, no keystroke loggers. Complete peace of mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
