"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Volume2,
  VolumeX,
  Volume1,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Monitor,
  Maximize2,
  Lock,
  Power,
  Clipboard,
  Send,
  AppWindow,
  Music,
  Globe,
  Film,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Battery,
} from "lucide-react";

const TABS = ["launcher", "controls"] as const;
type Tab = (typeof TABS)[number];

export default function InteractiveDeviceShowcase() {
  const [activeTab, setActiveTab] = useState<Tab>("launcher");
  const [volume, setVolume] = useState(65);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lastAction, setLastAction] = useState<string>(
    "Ready — Tap any tile to test live"
  );

  // Real-time drag / swipe tracking
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const hasMovedPastThreshold = useRef(false);

  const activeIndex = TABS.indexOf(activeTab);

  const handleTileClick = (name: string, callback?: () => void) => {
    // If the user was dragging the slide, don't execute the tile click
    if (hasMovedPastThreshold.current) return;
    setLastAction(`Executed: ${name} (0ms local latency)`);
    if (callback) callback();
  };

  const switchTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setDragOffset(0);
    setIsDragging(false);
  }, []);

  const goToTab = useCallback(
    (direction: "next" | "prev") => {
      const idx = TABS.indexOf(activeTab);
      if (direction === "next" && idx < TABS.length - 1) {
        switchTab(TABS[idx + 1]);
      } else if (direction === "prev" && idx > 0) {
        switchTab(TABS[idx - 1]);
      } else {
        setDragOffset(0);
        setIsDragging(false);
      }
    },
    [activeTab, switchTab]
  );

  // Unified drag start
  const handleStart = (clientX: number) => {
    dragStartX.current = clientX;
    hasMovedPastThreshold.current = false;
    setIsDragging(true);
  };

  // Unified drag move
  const handleMove = (clientX: number) => {
    if (dragStartX.current === null) return;
    const diff = clientX - dragStartX.current;

    if (Math.abs(diff) > 8) {
      hasMovedPastThreshold.current = true;
    }

    // Apply slight resistance at boundaries
    if (
      (activeIndex === 0 && diff > 0) ||
      (activeIndex === TABS.length - 1 && diff < 0)
    ) {
      setDragOffset(diff * 0.3);
    } else {
      setDragOffset(diff);
    }
  };

  // Unified drag end
  const handleEnd = () => {
    if (dragStartX.current === null) return;
    const threshold = 40;

    if (dragOffset < -threshold && activeIndex < TABS.length - 1) {
      goToTab("next");
    } else if (dragOffset > threshold && activeIndex > 0) {
      goToTab("prev");
    } else {
      // Snap back
      setDragOffset(0);
      setIsDragging(false);
    }

    dragStartX.current = null;
  };

  return (
    <div
      id="features"
      className="w-full max-w-5xl mx-auto flex flex-col items-center gap-6 sm:gap-8 mt-8 sm:mt-12 px-2.5 sm:px-4 scroll-mt-24 select-none"
    >
      {/* Category Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 p-1 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md max-w-full overflow-x-auto">
        <button
          onClick={() => switchTab("launcher")}
          className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-[13px] font-medium transition-all whitespace-nowrap ${
            activeTab === "launcher"
              ? "bg-[#5E6AD2] text-white shadow-[0_0_20px_rgba(94,106,210,0.5)]"
              : "text-white/50 hover:text-white"
          }`}
        >
          <span className="sm:hidden">App Launcher</span>
          <span className="hidden sm:inline">App Launcher &amp; Macros</span>
        </button>
        <button
          onClick={() => switchTab("controls")}
          className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-[13px] font-medium transition-all whitespace-nowrap ${
            activeTab === "controls"
              ? "bg-[#5E6AD2] text-white shadow-[0_0_20px_rgba(94,106,210,0.5)]"
              : "text-white/50 hover:text-white"
          }`}
        >
          <span className="sm:hidden">Controls &amp; Media</span>
          <span className="hidden sm:inline">Media &amp; System Controls</span>
        </button>
      </div>

      {/* Main Interactive Showcase Container */}
      <div className="relative w-full rounded-[24px] sm:rounded-[36px] border border-white/[0.1] bg-gradient-to-b from-[#141418] to-[#0a0a0c] p-3 sm:p-7 md:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[300px] bg-[#5E6AD2] opacity-[0.12] blur-[100px] pointer-events-none rounded-full" />

        {/* Live Windows PC Response Banner */}
        <div className="relative z-10 mb-5 sm:mb-8 rounded-xl sm:rounded-2xl border border-white/[0.08] bg-black/60 p-3 sm:p-5 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-green-400 truncate">
                Connected PC — Windows 11 (DESKTOP-WINDECK)
              </span>
              <span className="text-[12px] sm:text-[14px] text-white font-mono font-medium truncate">
                {lastAction}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 text-[11px] sm:text-[12px] text-white/60 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
            {/* Live Volume Meter */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5E6AD2]" />
              )}
              <span>{isMuted ? "MUTED" : `${volume}%`}</span>
            </div>

            {/* Media Status */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isPlaying ? "bg-green-500 animate-pulse" : "bg-white/20"
                }`}
              />
              <span>{isPlaying ? "♪ Playing" : "⏸ Paused"}</span>
            </div>

            {/* Ping */}
            <div className="flex items-center gap-1.5 text-white/40">
              <span className="text-emerald-400 font-bold text-[10px]">●</span>
              <span>1.2 ms Wi-Fi</span>
            </div>
          </div>
        </div>

        {/* Android Flagship Phone Frame with Lateral Controls */}
        <div className="relative z-10 w-full flex items-center justify-center gap-2 sm:gap-4">
          {/* Left Arrow Button (Desktop/Tablet) */}
          <button
            onClick={() => goToTab("prev")}
            disabled={activeIndex === 0}
            aria-label="Previous Page"
            className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all shrink-0 ${
              activeIndex === 0
                ? "opacity-20 cursor-not-allowed pointer-events-none"
                : "opacity-100 cursor-pointer"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* REALISTIC ANDROID FLAGSHIP PHONE MOCKUP */}
          <div className="relative w-full max-w-[325px] xs:max-w-[345px] sm:max-w-[420px] md:max-w-[480px]">
            {/* Hardware Side Buttons (Android Style) */}
            {/* Right side Power Button */}
            <div className="hidden sm:block absolute -right-2 top-24 w-1.5 h-10 bg-[#2d2e33] rounded-r-md border-y border-r border-white/15 shadow-sm pointer-events-none" />
            {/* Right side Volume Rocker */}
            <div className="hidden sm:block absolute -right-2 top-40 w-1.5 h-20 bg-[#2d2e33] rounded-r-md border-y border-r border-white/15 shadow-sm pointer-events-none" />

            {/* Outer Matte Metallic Frame (Android Galaxy / Pixel Bezel) */}
            <div
              className="relative w-full rounded-[38px] sm:rounded-[46px] bg-gradient-to-b from-[#2a2c33] via-[#1a1c22] to-[#121318] p-2.5 sm:p-3.5 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.12),0_0_0_4px_#0e0f12] cursor-grab active:cursor-grabbing"
              onTouchStart={(e) => handleStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleMove(e.touches[0].clientX)}
              onTouchEnd={handleEnd}
              onMouseDown={(e) => {
                if (e.button === 0) handleStart(e.clientX);
              }}
              onMouseMove={(e) => handleMove(e.clientX)}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
            >
              {/* Phone Inner Display Screen */}
              <div className="relative rounded-[30px] sm:rounded-[38px] bg-black p-3 sm:p-5 border border-white/[0.08] overflow-hidden">
                {/* Android Centered Punch-Hole Camera */}
                <div className="absolute top-2.5 sm:top-3 left-1/2 -translate-x-1/2 w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full bg-[#050507] ring-2 ring-[#22232a] flex items-center justify-center z-30 shadow-inner pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0b1226] ring-1 ring-blue-500/30" />
                </div>

                {/* Android Status Bar */}
                <div className="relative z-20 flex items-center justify-between mb-3 sm:mb-4 text-[10px] sm:text-[11px] text-white/50 px-1 font-mono">
                  {/* Left: Clock */}
                  <span className="font-semibold text-white/80">9:41</span>

                  {/* Right: Network & Battery Indicators */}
                  <div className="flex items-center gap-1.5 text-white/60">
                    <span className="text-[9px] font-sans font-bold text-white/40">
                      5G
                    </span>
                    <Wifi className="w-3 h-3 text-white/60" />
                    <div className="flex items-center gap-0.5">
                      <span className="text-[9px] font-sans">100%</span>
                      <Battery className="w-3.5 h-3.5 text-white/70 rotate-90" />
                    </div>
                  </div>
                </div>

                {/* WinDeck Android App Header Bar */}
                <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b border-white/[0.06] px-1">
                  <div className="flex items-center gap-2">
                    <div className="relative w-5 h-5 rounded-md overflow-hidden bg-black border border-white/20">
                      <Image
                        src="/logo.png"
                        alt="WinDeck"
                        fill
                        sizes="20px"
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[12px] sm:text-[13px] font-bold text-white tracking-tight">
                      Win<span className="text-[#5E6AD2]">Deck</span>
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.08] text-white/50">
                      v2.4.0
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-green-400">
                      Online
                    </span>
                  </div>
                </div>

                {/* Slides Viewport with Live Touch/Mouse Translate */}
                <div className="overflow-hidden touch-pan-y">
                  <div
                    className="flex"
                    style={{
                      transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
                      transition: isDragging
                        ? "none"
                        : "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {/* PAGE 1: App Launcher & Macros */}
                    <div className="w-full flex-shrink-0 px-0.5">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                        {/* Chrome */}
                        <button
                          onClick={() =>
                            handleTileClick("Launched Google Chrome")
                          }
                          className="group relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 active:scale-95 transition-all text-center min-w-0"
                        >
                          <Globe className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-1.5 group-hover:scale-110 transition-transform shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-semibold truncate w-full">
                            Chrome
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-white/40 truncate w-full">
                            Browser
                          </span>
                        </button>

                        {/* Spotify */}
                        <button
                          onClick={() => handleTileClick("Launched Spotify")}
                          className="group relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#1DB954]/10 border border-[#1DB954]/30 text-[#1DB954] hover:bg-[#1DB954]/20 active:scale-95 transition-all text-center min-w-0"
                        >
                          <Music className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-1.5 group-hover:scale-110 transition-transform shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-semibold truncate w-full">
                            Spotify
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-white/40 truncate w-full">
                            Music
                          </span>
                        </button>

                        {/* Explorer */}
                        <button
                          onClick={() =>
                            handleTileClick("Launched File Explorer")
                          }
                          className="group relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all text-center min-w-0"
                        >
                          <AppWindow className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-1.5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-semibold truncate w-full">
                            Explorer
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-white/40 truncate w-full">
                            Files
                          </span>
                        </button>

                        {/* VLC */}
                        <button
                          onClick={() => handleTileClick("Launched VLC Player")}
                          className="group relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all text-center min-w-0"
                        >
                          <Film className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-1.5 text-orange-400 group-hover:scale-110 transition-transform shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-semibold truncate w-full">
                            VLC
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-white/40 truncate w-full">
                            Player
                          </span>
                        </button>

                        {/* Screenshot */}
                        <button
                          onClick={() =>
                            handleTileClick("Captured Snipping Tool Screenshot")
                          }
                          className="group relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 active:scale-95 transition-all text-center min-w-0"
                        >
                          <Maximize2 className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-1.5 group-hover:scale-110 transition-transform shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-semibold truncate w-full">
                            Screenshot
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-white/40 truncate w-full">
                            Macro
                          </span>
                        </button>

                        {/* Clipboard Sync */}
                        <button
                          onClick={() =>
                            handleTileClick("Clipboard text synced to PC")
                          }
                          className="group relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all text-center min-w-0"
                        >
                          <Clipboard className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-1.5 text-violet-400 group-hover:scale-110 transition-transform shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-semibold truncate w-full">
                            Clipboard
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-white/40 truncate w-full">
                            Sync PC
                          </span>
                        </button>

                        {/* Send File */}
                        <button
                          onClick={() =>
                            handleTileClick(
                              "File sent to PC → Downloads/WinDeck/"
                            )
                          }
                          className="group relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all text-center min-w-0"
                        >
                          <Send className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-1.5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-semibold truncate w-full">
                            Send File
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-white/40 truncate w-full">
                            DropZone
                          </span>
                        </button>

                        {/* Show Desktop */}
                        <button
                          onClick={() =>
                            handleTileClick("Toggled Show Desktop (Win+D)")
                          }
                          className="group relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all text-center min-w-0"
                        >
                          <Monitor className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-1.5 text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-semibold truncate w-full">
                            Desktop
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-white/40 truncate w-full">
                            Win+D
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* PAGE 2: Media & System Controls */}
                    <div className="w-full flex-shrink-0 px-0.5">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                        {/* Play/Pause */}
                        <button
                          onClick={() =>
                            handleTileClick(
                              isPlaying ? "Media Paused" : "Media Playing",
                              () => setIsPlaying(!isPlaying)
                            )
                          }
                          className={`group relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-200 active:scale-95 text-center min-w-0 ${
                            isPlaying
                              ? "bg-[#1DB954]/15 border-[#1DB954]/40 text-[#1DB954] shadow-[0_0_20px_rgba(29,185,84,0.2)]"
                              : "bg-white/[0.04] border-white/[0.08] text-white/80 hover:bg-white/[0.08]"
                          }`}
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-1.5 shrink-0" />
                          ) : (
                            <Play className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-1.5 shrink-0" />
                          )}
                          <span className="text-[11px] sm:text-[12px] font-semibold truncate w-full">
                            {isPlaying ? "Pause" : "Play"}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-white/40 truncate w-full">
                            Media
                          </span>
                        </button>

                        {/* Next Track */}
                        <button
                          onClick={() => handleTileClick("Media: Next Track")}
                          className="group relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all text-center min-w-0"
                        >
                          <SkipForward className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-1.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-semibold truncate w-full">
                            Next
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-white/40 truncate w-full">
                            Skip Track
                          </span>
                        </button>

                        {/* Previous Track */}
                        <button
                          onClick={() => handleTileClick("Media: Previous Track")}
                          className="group relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all text-center min-w-0"
                        >
                          <SkipBack className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-1.5 text-blue-400 group-hover:scale-110 transition-transform shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-semibold truncate w-full">
                            Previous
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-white/40 truncate w-full">
                            Back Track
                          </span>
                        </button>

                        {/* Volume Up */}
                        <button
                          onClick={() =>
                            handleTileClick("Windows Volume +5%", () =>
                              setVolume((v) => Math.min(100, v + 5))
                            )
                          }
                          className="group relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all text-center min-w-0"
                        >
                          <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-1.5 text-[#5E6AD2] group-hover:scale-110 transition-transform shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-semibold truncate w-full">
                            Vol +5
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-white/40 truncate w-full">
                            {volume}%
                          </span>
                        </button>

                        {/* Volume Down */}
                        <button
                          onClick={() =>
                            handleTileClick("Windows Volume -5%", () =>
                              setVolume((v) => Math.max(0, v - 5))
                            )
                          }
                          className="group relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all text-center min-w-0"
                        >
                          <Volume1 className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-1.5 text-blue-400 group-hover:scale-110 transition-transform shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-semibold truncate w-full">
                            Vol -5
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-white/40 truncate w-full">
                            {volume}%
                          </span>
                        </button>

                        {/* Mute Toggle */}
                        <button
                          onClick={() =>
                            handleTileClick(
                              isMuted ? "Audio Unmuted" : "Audio Muted",
                              () => setIsMuted(!isMuted)
                            )
                          }
                          className={`group relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all active:scale-95 text-center min-w-0 ${
                            isMuted
                              ? "bg-red-500/20 border-red-500/40 text-red-400"
                              : "bg-white/[0.04] border-white/[0.08] text-white/80 hover:bg-white/[0.08]"
                          }`}
                        >
                          <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-1.5 shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-semibold truncate w-full">
                            {isMuted ? "Unmute" : "Mute"}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-white/40 truncate w-full">
                            Master
                          </span>
                        </button>

                        {/* Lock Screen */}
                        <button
                          onClick={() =>
                            handleTileClick("Locked Workstation (Win+L)")
                          }
                          className="group relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all text-center min-w-0"
                        >
                          <Lock className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-1.5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-semibold truncate w-full">
                            Lock PC
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-white/40 truncate w-full">
                            Win+L
                          </span>
                        </button>

                        {/* Shutdown */}
                        <button
                          onClick={() =>
                            handleTileClick("Shutdown initiated...")
                          }
                          className="group relative flex flex-col items-center justify-center p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 active:scale-95 transition-all text-center min-w-0"
                        >
                          <Power className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-1.5 group-hover:scale-110 transition-transform shrink-0" />
                          <span className="text-[11px] sm:text-[12px] font-semibold truncate w-full">
                            Power
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-white/40 truncate w-full">
                            Shutdown
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Android Navigation Pill & Page Dots */}
                <div className="mt-4 flex flex-col items-center gap-2.5">
                  {/* Page Indicator Dots */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Page 1: App Launcher"
                      onClick={() => switchTab("launcher")}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeTab === "launcher"
                          ? "w-6 bg-[#5E6AD2] shadow-[0_0_12px_rgba(94,106,210,0.6)]"
                          : "w-1.5 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                    <button
                      type="button"
                      aria-label="Page 2: Media & System Controls"
                      onClick={() => switchTab("controls")}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeTab === "controls"
                          ? "w-6 bg-[#5E6AD2] shadow-[0_0_12px_rgba(94,106,210,0.6)]"
                          : "w-1.5 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  </div>

                  {/* Android Home Gesture Indicator Bar */}
                  <div className="w-24 sm:w-32 h-1 bg-white/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Arrow Button (Desktop/Tablet) */}
          <button
            onClick={() => goToTab("next")}
            disabled={activeIndex === TABS.length - 1}
            aria-label="Next Page"
            className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all shrink-0 ${
              activeIndex === TABS.length - 1
                ? "opacity-20 cursor-not-allowed pointer-events-none"
                : "opacity-100 cursor-pointer"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Swipe Hint */}
        <p className="relative z-10 text-center text-[11px] sm:text-[12px] text-white/40 mt-4 sm:mt-6">
          👈 Swipe on screen or drag with mouse to flip pages 👉
        </p>
      </div>
    </div>
  );
}
