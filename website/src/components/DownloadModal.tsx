"use client";

import { useState } from "react";
import { X, Download, Monitor, Smartphone, CheckCircle, ShieldCheck, FileCode, ExternalLink, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/Icons";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlatform?: "windows" | "android";
}

export default function DownloadModal({
  isOpen,
  onClose,
  defaultPlatform = "windows",
}: DownloadModalProps) {
  const [platform, setPlatform] = useState<"windows" | "android">(defaultPlatform);
  const [downloadStarted, setDownloadStarted] = useState(false);

  if (!isOpen) return null;

  const handleDownload = (filename: string) => {
    setDownloadStarted(true);
    
    // Create direct download link to GitHub Releases
    const url = `https://github.com/darshansatbhai/WINDECK/releases/download/v2.4.0/${filename}`;
    window.open(url, "_blank");

    setTimeout(() => {
      setDownloadStarted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-white/[0.12] bg-[#0c0c0e] p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5E6AD2]/20 blur-[80px] rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#5E6AD2]/40 bg-[#5E6AD2]/10 text-[11px] font-semibold text-[#8B97E8] mb-3">
            <Sparkles className="w-3 h-3 text-[#5E6AD2]" />
            Official Release v2.4.0
          </div>
          <h3 className="text-[26px] font-bold tracking-tight text-white">
            Download WinDeck
          </h3>
          <p className="text-[14px] text-white/50 mt-1">
            Free, open-source, and runs 100% locally on your home Wi-Fi.
          </p>
        </div>

        {/* Platform Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] mb-6">
          <button
            onClick={() => setPlatform("windows")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
              platform === "windows"
                ? "bg-[#5E6AD2] text-white shadow-[0_0_20px_rgba(94,106,210,0.4)]"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Windows PC (v2.4.0)</span>
          </button>
          <button
            onClick={() => setPlatform("android")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
              platform === "android"
                ? "bg-[#5E6AD2] text-white shadow-[0_0_20px_rgba(94,106,210,0.4)]"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android (v2.4.0)</span>
          </button>
        </div>

        {/* Windows Package Details */}
        {platform === "windows" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-white">WinDeck Setup (Installer)</span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Recommended</span>
              </div>
              <p className="text-[12px] text-white/40">
                Automated installer with background system tray support and auto-start option.
              </p>
              <div className="text-[11px] text-white/30 font-mono">
                WinDeck_Server_Setup_v2.4.0.exe · Windows 10 & 11 (64-bit)
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => handleDownload("WinDeck_Server_Setup_v2.4.0.exe")}
                disabled={downloadStarted}
                className="w-full h-12 rounded-xl bg-[#5E6AD2] hover:bg-[#4f5bc4] text-white font-semibold text-[14px] flex items-center justify-center gap-2 glow-btn transition-all active:scale-[0.98]"
              >
                {downloadStarted ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-300" />
                    <span>Download Started (v2.4.0)...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Installer (.exe)</span>
                  </>
                )}
              </button>

              <a
                href="https://github.com/darshansatbhai/WINDECK/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-white/70 hover:text-white font-medium text-[13px] flex items-center justify-center gap-2 transition-all"
              >
                <GithubIcon className="w-4 h-4" />
                <span>View Release on GitHub</span>
              </a>
            </div>
          </div>
        )}

        {/* Android Package Details */}
        {platform === "android" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-white">WinDeck Mobile APK</span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">v2.4.0</span>
              </div>
              <p className="text-[12px] text-white/40">
                Universal Android package. Supports phones and tablets running Android 8.0 or later.
              </p>
              <div className="text-[11px] text-white/30 font-mono">
                WinDeck_App_v2.4.0.apk · Flutter Core Engine
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => handleDownload("WinDeck_App_v2.4.0.apk")}
                disabled={downloadStarted}
                className="w-full h-12 rounded-xl bg-[#5E6AD2] hover:bg-[#4f5bc4] text-white font-semibold text-[14px] flex items-center justify-center gap-2 glow-btn transition-all active:scale-[0.98]"
              >
                {downloadStarted ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-300" />
                    <span>Download Started (v2.4.0)...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Direct APK Download (.apk)</span>
                  </>
                )}
              </button>

              <a
                href="https://github.com/darshansatbhai/WINDECK"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-white/70 hover:text-white font-medium text-[13px] flex items-center justify-center gap-2 transition-all"
              >
                <GithubIcon className="w-4 h-4" />
                <span>View Source & Build Instructions</span>
              </a>
            </div>
          </div>
        )}

        {/* Footer notes */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/35">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>VirusTotal Clean · SHA256 Verified</span>
          </div>
          <span>Local LAN WebSocket</span>
        </div>
      </div>
    </div>
  );
}
