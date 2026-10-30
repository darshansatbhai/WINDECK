"use client";

import { MessageSquare, Terminal, Sliders, Radio, Laptop, Smartphone, Volume2, Gamepad2 } from "lucide-react";

export default function PersonaCards() {
  return (
    <section id="who-its-for" className="bg-[#080808] py-36 px-6 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5E6AD2] mb-3">
            Why it matters
          </p>
          <h2 className="text-[40px] sm:text-[54px] font-bold tracking-[-0.03em] leading-[1.06]">
            Built for people<br />
            <span className="text-white/60">who actually </span>
            <span className="text-[#5E6AD2]">focus.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* 1. For the builder */}
          <div className="rounded-3xl border border-white/[0.06] bg-black p-8 flex flex-col gap-6 hover:border-white/[0.12] transition-colors">
            <div className="h-20 flex items-center">
              <div className="flex gap-2 items-center p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <span className="px-2 py-1 rounded bg-black/40 text-[11px] font-mono">Ctrl</span>
                <span className="text-white/20 text-xs">+</span>
                <span className="px-2 py-1 rounded bg-black/40 text-[11px] font-mono">Shift</span>
                <span className="text-white/20 text-xs">+</span>
                <span className="px-2 py-1 rounded bg-black/40 text-[11px] font-mono">B</span>
                <span className="text-white/30 text-xs mx-1">→</span>
                <span className="text-[11px] font-semibold">Build & Run</span>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-2 text-amber-400">
                For the builder
              </p>
              <h3 className="text-[22px] sm:text-[24px] font-bold tracking-tight mb-2">
                Never break your flow state.
              </h3>
              <p className="text-white/45 leading-relaxed text-[14px]">
                Reaching for the mouse kills the moment. Trigger compilers, switch virtual desktops, and mute calls in one tap. Keep your hands on the keyboard.
              </p>
            </div>
          </div>

          {/* 2. For the streamer */}
          <div className="rounded-3xl border border-white/[0.06] bg-black p-8 flex flex-col gap-6 hover:border-white/[0.12] transition-colors">
            <div className="h-20 flex items-center">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 w-full max-w-[280px]">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                <span className="text-[12px] font-semibold">OBS Studio</span>
                <span className="ml-auto text-[10px] text-red-400 font-mono font-bold">● LIVE 1080p</span>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-2 text-purple-400">
                For the streamer
              </p>
              <h3 className="text-[22px] sm:text-[24px] font-bold tracking-tight mb-2">
                Go live. Stay in control.
              </h3>
              <p className="text-white/45 leading-relaxed text-[14px]">
                Switch between OBS cameras, game capture, and your chat without alt-tabbing. Fire soundboard effects, mute Discord, and focus on your audience.
              </p>
            </div>
          </div>

          {/* 3. For the gamer */}
          <div className="rounded-3xl border border-white/[0.06] bg-black p-8 flex flex-col gap-6 hover:border-white/[0.12] transition-colors">
            <div className="h-20 flex items-center">
              <div className="flex items-center gap-3 w-full max-w-[260px] p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Volume2 className="w-4 h-4 shrink-0" />
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span>Discord / Game Mix</span>
                    <span>70 / 30</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[70%]" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-2 text-emerald-400">
                For the gamer
              </p>
              <h3 className="text-[22px] sm:text-[24px] font-bold tracking-tight mb-2">
                Real-time audio balancing.
              </h3>
              <p className="text-white/45 leading-relaxed text-[14px]">
                Teammates screaming during a clutch round? Lower Discord volume instantly on the phone screen without minimizing your full-screen game.
              </p>
            </div>
          </div>

          {/* 4. For the minimalist */}
          <div className="rounded-3xl border border-white/[0.06] bg-black p-8 flex flex-col gap-6 hover:border-white/[0.12] transition-colors">
            <div className="h-20 flex items-center">
              <div className="flex items-center gap-4 text-white/50 text-[12px]">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                  <Laptop className="w-4 h-4" />
                  <span>PC</span>
                </div>
                <span className="text-white/20">+</span>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5E6AD2]/20 border border-[#5E6AD2]/40 text-[#8B97E8]">
                  <Smartphone className="w-4 h-4" />
                  <span>Phone on Stand</span>
                </div>
                <span className="text-rose-400/50 line-through text-[11px]">No $250 Box</span>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-2 text-pink-400">
                For the minimalist
              </p>
              <h3 className="text-[22px] sm:text-[24px] font-bold tracking-tight mb-2">
                A clean desk. Zero clutter.
              </h3>
              <p className="text-white/45 leading-relaxed text-[14px]">
                No extra USB cables trailing across your workspace. No bulky plastic desk hub. Just the Android smartphone that&apos;s already resting on your charger.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
