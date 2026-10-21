"use client";

import { Download, Wifi, Zap, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Get WinDeck",
      desc: "Download the Windows Server app and install the Android app. Takes 30 seconds with no complex drivers.",
      color: "#3b82f6",
      bgBadge: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    },
    {
      num: "02",
      title: "Connect over Wi-Fi",
      desc: "Same local network. WinDeck generates an instant QR code and 6-digit OTP. Scan or enter it once to pair.",
      color: "#22c55e",
      bgBadge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    },
    {
      num: "03",
      title: "Control your Windows PC",
      desc: "Launch apps, trigger OBS macros, mix sound, and control Spotify. All with zero internet lag and tactile haptic feedback.",
      color: "#8b5cf6",
      bgBadge: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    },
  ];

  return (
    <section id="how-it-works" className="bg-[#080808] py-36 px-6 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5E6AD2] mb-3">
            How it works
          </p>
          <h2 className="text-[40px] sm:text-[54px] font-light tracking-[-0.03em] leading-[1.06]">
            Set up in under a minute.
          </h2>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06] rounded-3xl overflow-hidden border border-white/[0.08]">
          {steps.map((step) => (
            <div key={step.num} className="bg-[#0a0a0c] p-8 sm:p-10 flex flex-col justify-between hover:bg-[#111114] transition-colors">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full border text-[11px] font-bold tracking-widest mb-6 ${step.bgBadge}`}>
                  STEP {step.num}
                </span>

                <h3 className="text-[20px] font-semibold tracking-tight mb-3 text-white">
                  {step.title}
                </h3>

                <p className="text-[14px] text-white/45 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.05] flex items-center justify-between text-[12px] text-white/30">
                <span>Free & Open Source</span>
                <ArrowRight className="w-4 h-4 text-white/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
