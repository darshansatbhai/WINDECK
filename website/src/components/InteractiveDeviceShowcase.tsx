"use client";

import { useState, useRef, useCallback } from "react";
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
    const threshold = 45;

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
      className="w-full max-w-5xl mx-auto flex flex-col items-center gap-8 mt-12 px-4 scroll-mt-24 select-none"
    >
      {/* Category Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
        <button
          onClick={() => switchTab("launcher")}
          className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all ${
            activeTab === "launcher"
              ? "bg-[#5E6AD2] text-white shadow-[0_0_20px_rgba(94,106,210,0.5)]"
              : "text-white/50 hover:text-white"
          }`}
        >
          App Launcher & Macros
        </button>
        <button
          onClick={() => switchTab("controls")}
          className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all ${
            activeTab === "controls"
              ? "bg-[#5E6AD2] text-white shadow-[0_0_20px_rgba(94,106,210,0.5)]"
              : "text-white/50 hover:text-white"
          }`}
        >
          Media & System Controls
        </button>
      </div>

      {/* Main Interactive Container */}
      <div className="relative w-full rounded-[36px] border border-white/[0.1] bg-gradient-to-b from-[#141418] to-[#0a0a0c] p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#5E6AD2] opacity-[0.12] blur-[100px] pointer-events-none rounded-full" />

        {/* Live Windows PC Response Banner */}
        <div className="relative z-10 mb-8 rounded-2xl border border-white/[0.08] bg-black/50 p-4 sm:p-5 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-ping" />
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-green-400">
                Connected PC — Windows 11 (DESKTOP-WINDECK)
              </span>
              <span className="text-[14px] text-white font-mono font-medium">
                {lastAction}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[12px] text-white/60">
            {/* Live Volume Meter */}
            <div className="flex items-center gap-2">
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#5E6AD2]" />
              )}
              <span>{isMuted ? "MUTED" : `${volume}%`}</span>
            </div>

            {/* Media Status */}
            <div className="hidden sm:flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-white/20"}`}
              />
              <span>{isPlaying ? "♪ Playing" : "⏸ Paused"}</span>
            </div>

            {/* Ping */}
            <div className="hidden sm:flex items-center gap-1.5 text-white/40">
              <span className="text-emerald-400 font-bold">●</span>
              <span>1.2 ms Wi-Fi</span>
            </div>
          </div>
        </div>

        {/* Smartphone Hardware Frame Area with Lateral Slide Arrows */}
        <div className="relative z-10 max-w-3xl mx-auto flex items-center justify-center gap-3">
          {/* Left Arrow Button */}
          <button
            onClick={() => goToTab("prev")}
            disabled={activeIndex === 0}
            aria-label="Previous Page"
            className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all ${
              activeIndex === 0 ? "opacity-20 cursor-not-allowed pointer-events-none" : "opacity-100 cursor-pointer"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Smartphone Hardware Frame */}
          <div
            className="flex-1 max-w-2xl rounded-[32px] sm:rounded-[40px] bg-gradient-to-b from-[#2a2a30] via-[#151518] to-[#0d0d10] p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] cursor-grab active:cursor-grabbing"
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
            <div className="relative rounded-[24px] sm:rounded-[32px] bg-black p-4 sm:p-6 border border-white/[0.06] overflow-hidden">
              {/* Top Phone Header / Notch */}
              <div className="flex items-center justify-between mb-5 text-[11px] text-white/40 px-2 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#5E6AD2]" />
                  <span className="text-white/70 font-sans font-medium">
                    WinDeck Mobile
                  </span>
                </div>
                <div className="w-16 h-3 bg-white/10 rounded-full mx-auto" />
                <div className="flex items-center gap-2">
                  <span>5G · 100%</span>
                </div>
              </div>

              {/* Slide Content with Live Touch/Mouse Translate */}
              <div className="overflow-hidden touch-pan-y">
                <div
                  className="flex"
                  style={{
                    transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
                    transition: isDragging ? "none" : "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  {/* Page 1: App Launcher & Macros */}
                  <div className="w-full flex-shrink-0 px-0.5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* Launch Chrome */}
                      <button
                        onClick={() => handleTileClick("Launched Google Chrome")}
                        className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 active:scale-95 transition-all"
                      >
                        <Globe className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[12px] font-semibold">Chrome</span>
                        <span className="text-[10px] text-white/40">Web Browser</span>
                      </button>

                      {/* Launch Spotify */}
                      <button
                        onClick={() => handleTileClick("Launched Spotify")}
                        className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-[#1DB954]/10 border border-[#1DB954]/30 text-[#1DB954] hover:bg-[#1DB954]/15 active:scale-95 transition-all"
                      >
                        <Music className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[12px] font-semibold">Spotify</span>
                        <span className="text-[10px] text-white/40">Music App</span>
                      </button>

                      {/* Launch File Explorer */}
                      <button
                        onClick={() => handleTileClick("Launched File Explorer")}
                        className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                      >
                        <AppWindow className="w-6 h-6 mb-2 text-amber-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[12px] font-semibold">Explorer</span>
                        <span className="text-[10px] text-white/40">File Manager</span>
                      </button>

                      {/* Launch VLC */}
                      <button
                        onClick={() => handleTileClick("Launched VLC Player")}
                        className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                      >
                        <Film className="w-6 h-6 mb-2 text-orange-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[12px] font-semibold">VLC</span>
                        <span className="text-[10px] text-white/40">Media Player</span>
                      </button>

                      {/* Custom Macro: Screenshot */}
                      <button
                        onClick={() => handleTileClick("Screenshot captured (Snipping Tool)")}
                        className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 active:scale-95 transition-all"
                      >
                        <Maximize2 className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[12px] font-semibold">Screenshot</span>
                        <span className="text-[10px] text-white/40">Custom Macro</span>
                      </button>

                      {/* Clipboard Sync */}
                      <button
                        onClick={() => handleTileClick("Clipboard synced to PC")}
                        className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                      >
                        <Clipboard className="w-6 h-6 mb-2 text-violet-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[12px] font-semibold">Clipboard</span>
                        <span className="text-[10px] text-white/40">Sync Text</span>
                      </button>

                      {/* File Transfer */}
                      <button
                        onClick={() => handleTileClick("File sent to PC → Downloads/WinDeck/")}
                        className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                      >
                        <Send className="w-6 h-6 mb-2 text-cyan-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[12px] font-semibold">Send File</span>
                        <span className="text-[10px] text-white/40">Phone → PC</span>
                      </button>

                      {/* Show Desktop */}
                      <button
                        onClick={() => handleTileClick("Toggled Show Desktop (Win+D)")}
                        className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                      >
                        <Monitor className="w-6 h-6 mb-2 text-indigo-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[12px] font-semibold">Desktop</span>
                        <span className="text-[10px] text-white/40">Show/Hide</span>
                      </button>
                    </div>
                  </div>

                  {/* Page 2: Media & System Controls */}
                  <div className="w-full flex-shrink-0 px-0.5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {/* Media Play/Pause */}
                      <button
                        onClick={() =>
                          handleTileClick(
                            isPlaying ? "Media Paused" : "Media Playing",
                            () => setIsPlaying(!isPlaying)
                          )
                        }
                        className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 active:scale-95 ${
                          isPlaying
                            ? "bg-[#1DB954]/15 border-[#1DB954]/40 text-[#1DB954] shadow-[0_0_20px_rgba(29,185,84,0.2)]"
                            : "bg-white/[0.04] border-white/[0.08] text-white/80 hover:bg-white/[0.08]"
                        }`}
                      >
                        {isPlaying ? <Pause className="w-6 h-6 mb-2" /> : <Play className="w-6 h-6 mb-2" />}
                        <span className="text-[12px] font-semibold">{isPlaying ? "Pause" : "Play"}</span>
                        <span className="text-[10px] text-white/40">Media Key</span>
                      </button>

                      {/* Next Track */}
                      <button
                        onClick={() => handleTileClick("Media: Next Track")}
                        className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                      >
                        <SkipForward className="w-6 h-6 mb-2 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[12px] font-semibold">Next Song</span>
                        <span className="text-[10px] text-white/40">Skip Forward</span>
                      </button>

                      {/* Previous Track */}
                      <button
                        onClick={() => handleTileClick("Media: Previous Track")}
                        className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                      >
                        <SkipBack className="w-6 h-6 mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[12px] font-semibold">Prev Song</span>
                        <span className="text-[10px] text-white/40">Skip Back</span>
                      </button>

                      {/* Volume Up */}
                      <button
                        onClick={() =>
                          handleTileClick("Windows Volume +5%", () =>
                            setVolume((v) => Math.min(100, v + 5))
                          )
                        }
                        className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                      >
                        <Volume2 className="w-6 h-6 mb-2 text-[#5E6AD2] group-hover:scale-110 transition-transform" />
                        <span className="text-[12px] font-semibold">Vol +5</span>
                        <span className="text-[10px] text-white/40">{volume}%</span>
                      </button>

                      {/* Volume Down */}
                      <button
                        onClick={() =>
                          handleTileClick("Windows Volume -5%", () =>
                            setVolume((v) => Math.max(0, v - 5))
                          )
                        }
                        className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                      >
                        <Volume1 className="w-6 h-6 mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[12px] font-semibold">Vol -5</span>
                        <span className="text-[10px] text-white/40">{volume}%</span>
                      </button>

                      {/* Mute Toggle */}
                      <button
                        onClick={() =>
                          handleTileClick(isMuted ? "Unmuted" : "Muted", () =>
                            setIsMuted(!isMuted)
                          )
                        }
                        className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all active:scale-95 ${
                          isMuted
                            ? "bg-red-500/20 border-red-500/40 text-red-400"
                            : "bg-white/[0.04] border-white/[0.08] text-white/80 hover:bg-white/[0.08]"
                        }`}
                      >
                        <VolumeX className="w-6 h-6 mb-2" />
                        <span className="text-[12px] font-semibold">{isMuted ? "Unmute" : "Mute"}</span>
                        <span className="text-[10px] text-white/40">Master Out</span>
                      </button>

                      {/* Lock Screen */}
                      <button
                        onClick={() => handleTileClick("Locked Workstation (Win+L)")}
                        className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                      >
                        <Lock className="w-6 h-6 mb-2 text-amber-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[12px] font-semibold">Lock PC</span>
                        <span className="text-[10px] text-white/40">Win + L</span>
                      </button>

                      {/* Shutdown */}
                      <button
                        onClick={() => handleTileClick("Shutdown initiated...")}
                        className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 active:scale-95 transition-all"
                      >
                        <Power className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[12px] font-semibold">Shutdown</span>
                        <span className="text-[10px] text-white/40">Power Off</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Swipe Page Indicator Dots */}
              <div className="mt-5 flex items-center justify-center gap-2">
                <button
                  type="button"
                  aria-label="Page 1: App Launcher"
                  onClick={() => switchTab("launcher")}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeTab === "launcher"
                      ? "w-7 bg-[#5E6AD2] shadow-[0_0_12px_rgba(94,106,210,0.6)]"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
                <button
                  type="button"
                  aria-label="Page 2: Media & System Controls"
                  onClick={() => switchTab("controls")}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeTab === "controls"
                      ? "w-7 bg-[#5E6AD2] shadow-[0_0_12px_rgba(94,106,210,0.6)]"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              </div>

              {/* Interactive swipe/drag hint */}
              <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-white/40">
                <span>👈</span>
                <span>Slide or drag with touch / mouse to flip pages</span>
                <span>👉</span>
              </div>
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => goToTab("next")}
            disabled={activeIndex === TABS.length - 1}
            aria-label="Next Page"
            className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all ${
              activeIndex === TABS.length - 1
                ? "opacity-20 cursor-not-allowed pointer-events-none"
                : "opacity-100 cursor-pointer"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer info tip */}
        <p className="relative z-10 text-center text-[12px] text-white/30 mt-6">
          Interactive Live Demo — Swipe left/right or click tiles to simulate real WinDeck PC actions over zero-latency Wi-Fi.
        </p>
      </div>
    </div>
  );
}
