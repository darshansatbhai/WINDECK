"use client";

import { Heart, Wifi, CheckCircle2 } from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black py-20 px-6 border-t border-white/[0.06] text-white/40 text-[13px]">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-white/20 bg-black">
              <Image
                src="/logo.png"
                alt="WinDeck"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-white">
              win<span className="text-[#5E6AD2]">deck</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-white/50 border border-white/10">
              v1.0.0
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[13px] text-white/50">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#download" className="hover:text-white transition-colors">Windows App</a>
            <a href="#download" className="hover:text-white transition-colors">Android App</a>
            <a href="#who-its-for" className="hover:text-white transition-colors">Built For</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-white/30 text-[12px]">
            © 2026 WinDeck. Free & Open-source Stream Deck alternative for Windows & Android.
          </p>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[11px] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Local WebSocket Core · Zero Cloud Dependency</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
