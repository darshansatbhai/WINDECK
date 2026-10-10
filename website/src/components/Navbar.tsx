"use client";

import { useState } from "react";
import { Download, Menu, X, Monitor, Smartphone, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/Icons";

import Image from "next/image";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 h-16 border-b border-white/[0.06] bg-black/60 backdrop-blur-xl transition-all duration-300">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(94,106,210,0.4)] group-hover:scale-105 transition-transform bg-black">
            <Image
              src="/logo.png"
              alt="WinDeck"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-[17px] font-bold tracking-tight">
            win<span className="text-[#5E6AD2]">deck</span>
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-white/[0.06] text-white/60 border border-white/10">
            v1.0.0
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-white/50">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#windows-app" className="hover:text-white transition-colors">
            Windows App
          </a>
          <a href="#who-its-for" className="hover:text-white transition-colors">
            Built for
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors">
            How it works
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/[0.12] text-[13px] font-medium text-white/70 hover:text-white hover:border-white/30 transition-all"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub</span>
          </a>

          <a
            href="#download"
            className="flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-full bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-white/80 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/[0.08] px-6 py-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-1 text-[16px] text-white/60">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 border-b border-white/[0.06] hover:text-white"
            >
              Features
            </a>
            <a
              href="#windows-app"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 border-b border-white/[0.06] hover:text-white"
            >
              Windows App
            </a>
            <a
              href="#who-its-for"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 border-b border-white/[0.06] hover:text-white"
            >
              Built for
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 border-b border-white/[0.06] hover:text-white"
            >
              How it works
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 hover:text-white"
            >
              FAQ
            </a>
          </nav>
          <div className="pt-4 flex flex-col gap-3">
            <a
              href="#download"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-[#5E6AD2] text-white font-medium text-center shadow-[0_0_25px_rgba(94,106,210,0.4)]"
            >
              Download WinDeck (Free)
            </a>
          </div>
        </div>
      )}
    </>
  );
}
