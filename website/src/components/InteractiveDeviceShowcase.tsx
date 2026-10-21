"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
  ShieldCheck,
  Zap,
  Layers,
  Radio,
  Sliders,
} from "lucide-react";

const TABS = ["launcher", "controls"] as const;
type Tab = (typeof TABS)[number];

export default function InteractiveDeviceShowcase() {
  const [activeTab, setActiveTab] = useState<Tab>("launcher");
  const [volume, setVolume] = useState(65);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isScreenOff, setIsScreenOff] = useState(false);
  const [showVolumeHud, setShowVolumeHud] = useState(false);
  const [lastAction, setLastAction] = useState<string>(
    "Ready — Tap any tile to test live"
  );

  // Volume HUD auto-hide timer
  const volumeTimer = useRef<NodeJS.Timeout | null>(null);

  // Real-time drag / swipe tracking
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const hasMovedPastThreshold = useRef(false);

  const activeIndex = TABS.indexOf(activeTab);

  const triggerVolumeHud = useCallback((newVol: number) => {
    setVolume(newVol);
    setShowVolumeHud(true);
    if (volumeTimer.current) clearTimeout(volumeTimer.current);
    volumeTimer.current = setTimeout(() => {
      setShowVolumeHud(false);
    }, 1800);
  }, []);

  const handleTileClick = (name: string, callback?: () => void) => {
    if (isScreenOff) return;
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

  // Hardware button interactions
  const handlePhysicalVolUp = () => {
    if (isScreenOff) return;
    const nextVol = Math.min(100, volume + 5);
    triggerVolumeHud(nextVol);
    setLastAction(`Hardware Key: PC Volume +5% (${nextVol}%)`);
  };

  const handlePhysicalVolDown = () => {
    if (isScreenOff) return;
    const nextVol = Math.max(0, volume - 5);
    triggerVolumeHud(nextVol);
    setLastAction(`Hardware Key: PC Volume -5% (${nextVol}%)`);
  };

  const handlePhysicalPower = () => {
    setIsScreenOff((prev) => {
      const nextState = !prev;
      setLastAction(
        nextState
          ? "Hardware Key: Phone Display Off / Sleep"
          : "Hardware Key: Phone Display On / Awake"
      );
      return nextState;
    });
  };

  // Unified drag start
  const handleStart = (clientX: number) => {
    if (isScreenOff) return;
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

    // Resistance at edges
    if (
      (activeIndex === 0 && diff > 0) ||
      (activeIndex === TABS.length - 1 && diff < 0)
    ) {
      setDragOffset(diff * 0.25);
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
      setDragOffset(0);
      setIsDragging(false);
    }

    dragStartX.current = null;
  };

  useEffect(() => {
    return () => {
      if (volumeTimer.current) clearTimeout(volumeTimer.current);
    };
  }, []);

  return (
    <div
      id="features"
      className="w-full max-w-6xl mx-auto flex flex-col items-center gap-6 sm:gap-8 mt-8 sm:mt-12 px-3 sm:px-6 scroll-mt-24 select-none"
    >
      {/* Category Tabs Header */}
      <div className="flex items-center gap-1.5 p-1 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md max-w-full overflow-x-auto shadow-lg">
        <button
          onClick={() => switchTab("launcher")}
          className={`px-4 sm:px-6 py-2 rounded-full text-[12px] sm:text-[13px] font-medium transition-all whitespace-nowrap ${
            activeTab === "launcher"
              ? "bg-[#5E6AD2] text-white shadow-[0_0_20px_rgba(94,106,210,0.5)]"
              : "text-white/50 hover:text-white"
          }`}
        >
          <span className="sm:hidden">App Launcher</span>
          <span className="hidden sm:inline">Page 1: App Launcher &amp; Macros</span>
        </button>
        <button
          onClick={() => switchTab("controls")}
          className={`px-4 sm:px-6 py-2 rounded-full text-[12px] sm:text-[13px] font-medium transition-all whitespace-nowrap ${
            activeTab === "controls"
              ? "bg-[#5E6AD2] text-white shadow-[0_0_20px_rgba(94,106,210,0.5)]"
              : "text-white/50 hover:text-white"
          }`}
        >
          <span className="sm:hidden">Controls &amp; Media</span>
          <span className="hidden sm:inline">Page 2: Media &amp; Controls</span>
        </button>
      </div>

      {/* Main Glass Stage Container */}
      <div className="relative w-full rounded-[28px] sm:rounded-[36px] border border-white/[0.1] bg-gradient-to-b from-[#141418] via-[#0d0d10] to-[#070709] p-4 sm:p-8 md:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden">
        {/* Glow ambient background lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] bg-[#5E6AD2] opacity-[0.14] blur-[120px] pointer-events-none rounded-full" />

        {/* Live Windows PC Response Banner */}
        <div className="relative z-10 mb-6 sm:mb-8 rounded-2xl border border-white/[0.08] bg-black/60 p-3.5 sm:p-5 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-xl">
          <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-green-400 truncate">
                CONNECTED PC — WINDOWS 11 (DESKTOP-WINDECK)
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

        {/* 3-Column Desktop Stage Layout (Left Features + Hero Phone + Right Features) */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full">
          {/* Left Feature Card (Desktop Only) */}
          <div className="hidden lg:flex flex-col gap-4 w-72 shrink-0">
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-[#5E6AD2]/15 flex items-center justify-center mb-3 text-[#8B97E8]">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-[14px] font-bold text-white mb-1">
                Zero Hardware Cost
              </h4>
              <p className="text-[12px] text-white/50 leading-relaxed">
                Save $150–$250. Turn any Android phone into an OLED Stream Deck with zero extra hardware.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-green-500/15 flex items-center justify-center mb-3 text-green-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-[14px] font-bold text-white mb-1">
                100% Local &amp; Private
              </h4>
              <p className="text-[12px] text-white/50 leading-relaxed">
                Zero cloud servers, zero accounts. Direct AES-256 encrypted socket communication over home Wi-Fi.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 text-purple-300 text-[11px] leading-relaxed">
              💡 <strong>Try the buttons:</strong> Click the phone&apos;s physical volume and power keys on the sides to see real-time hardware HUD responses!
            </div>
          </div>

          {/* CENTER: THE REALISTIC ANDROID FLAGSHIP PHONE (PORTRAIT 9:19.5) */}
          <div className="relative flex items-center justify-center">
            {/* Left Chevron for Desktop */}
            <button
              onClick={() => goToTab("prev")}
              disabled={activeIndex === 0}
              aria-label="Previous Page"
              className={`hidden md:flex absolute -left-14 items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all z-20 ${
                activeIndex === 0
                  ? "opacity-20 cursor-not-allowed pointer-events-none"
                  : "opacity-100 cursor-pointer"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* REALISTIC ANDROID PHONE FRAME */}
            <div className="relative w-[305px] xs:w-[325px] sm:w-[345px] shrink-0">
              {/* Physical Left Volume Keys (Clickable!) */}
              <button
                type="button"
                onClick={handlePhysicalVolUp}
                title="Click for Volume Up"
                aria-label="Volume Up"
                className="absolute -left-[9px] top-28 w-[6px] h-12 bg-[#33353e] hover:bg-[#5E6AD2] active:scale-x-75 rounded-l-md border-y border-l border-white/20 transition-all z-20 shadow-md cursor-pointer"
              />
              <button
                type="button"
                onClick={handlePhysicalVolDown}
                title="Click for Volume Down"
                aria-label="Volume Down"
                className="absolute -left-[9px] top-44 w-[6px] h-12 bg-[#33353e] hover:bg-[#5E6AD2] active:scale-x-75 rounded-l-md border-y border-l border-white/20 transition-all z-20 shadow-md cursor-pointer"
              />

              {/* Physical Right Power Key (Clickable!) */}
              <button
                type="button"
                onClick={handlePhysicalPower}
                title="Click for Power / Screen Lock"
                aria-label="Power Button"
                className="absolute -right-[9px] top-32 w-[6px] h-14 bg-[#33353e] hover:bg-red-400 active:scale-x-75 rounded-r-md border-y border-r border-white/20 transition-all z-20 shadow-md cursor-pointer"
              />

              {/* Outer Phone Bezel (Titanium Rim + Multi-layer Shadow like MoneyMate) */}
              <div
                className="relative w-full rounded-[44px] sm:rounded-[48px] bg-[#1a1b22] p-2 sm:p-2.5 shadow-[0_0_0_2px_#3f414d,0_0_0_5px_#14151a,0_30px_70px_rgba(0,0,0,0.95)] cursor-grab active:cursor-grabbing"
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
                {/* Screen Display Container */}
                <div className="relative rounded-[36px] sm:rounded-[40px] bg-black p-3.5 sm:p-4 border border-white/[0.08] overflow-hidden min-h-[570px] sm:min-h-[590px] flex flex-col justify-between">
                  {/* Screen Glare Reflection Gradient */}
                  <div className="absolute -top-32 -left-32 w-80 h-80 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent rotate-45 pointer-events-none z-20" />

                  {/* Android Centered Punch-Hole Camera */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#050507] ring-2 ring-[#22232a] flex items-center justify-center z-30 shadow-inner pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0b1226] ring-1 ring-blue-500/30" />
                  </div>

                  {/* Dynamic Hardware Volume HUD */}
                  {showVolumeHud && (
                    <div className="absolute top-10 left-3 right-3 z-40 flex items-center justify-between bg-black/90 backdrop-blur-xl border border-white/20 px-3.5 py-2 rounded-2xl text-white text-[11px] font-mono shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-in fade-in duration-150">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-[#5E6AD2]" />
                        <span className="font-sans font-semibold">Volume</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#5E6AD2] rounded-full transition-all duration-150"
                            style={{ width: `${volume}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-white/70">{volume}%</span>
                      </div>
                    </div>
                  )}

                  {/* Screen Locked / Sleep Overlay */}
                  {isScreenOff && (
                    <div
                      onClick={() => setIsScreenOff(false)}
                      className="absolute inset-0 bg-black/98 z-50 flex flex-col items-center justify-center text-center p-6 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 border border-white/10">
                        <Lock className="w-5 h-5 text-white/40" />
                      </div>
                      <span className="text-white font-semibold text-sm">
                        Screen Locked
                      </span>
                      <span className="text-white/40 text-[11px] mt-1">
                        Tap anywhere or click side Power key to wake
                      </span>
                    </div>
                  )}

                  {/* TOP: Android Status Bar */}
                  <div>
                    <div className="relative z-20 flex items-center justify-between mb-3 text-[10px] text-white/50 px-1 font-mono">
                      <span className="font-semibold text-white/80">9:41</span>
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

                    {/* WinDeck In-App Header */}
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/[0.08] px-1">
                      <div className="flex items-center gap-2">
                        <div className="relative w-5 h-5 rounded-md overflow-hidden bg-black border border-white/20 shrink-0">
                          <Image
                            src="/logo.png"
                            alt="WinDeck"
                            fill
                            sizes="20px"
                            className="object-contain"
                          />
                        </div>
                        <span className="text-[13px] font-bold text-white tracking-tight">
                          Win<span className="text-[#5E6AD2]">Deck</span>
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.08] text-white/50 border border-white/5">
                          v2.4.0
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-green-400">
                          ONLINE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* MIDDLE: 2-COLUMN × 4-ROW TILE GRID (REAL FLUTTER LAYOUT) */}
                  <div className="overflow-hidden touch-pan-y my-auto py-1">
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
                        <div className="grid grid-cols-2 gap-2.5">
                          {/* Chrome */}
                          <button
                            onClick={() =>
                              handleTileClick("Launched Google Chrome")
                            }
                            className="group relative flex flex-col items-center justify-center h-20 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 active:scale-95 transition-all text-center"
                          >
                            <Globe className="w-6 h-6 mb-1.5 group-hover:scale-110 transition-transform" />
                            <span className="text-[12px] font-semibold text-white">
                              Chrome
                            </span>
                            <span className="text-[10px] text-white/40">
                              Browser
                            </span>
                          </button>

                          {/* Spotify */}
                          <button
                            onClick={() => handleTileClick("Launched Spotify")}
                            className="group relative flex flex-col items-center justify-center h-20 rounded-2xl bg-[#1DB954]/10 border border-[#1DB954]/30 text-[#1DB954] hover:bg-[#1DB954]/20 active:scale-95 transition-all text-center"
                          >
                            <Music className="w-6 h-6 mb-1.5 group-hover:scale-110 transition-transform" />
                            <span className="text-[12px] font-semibold text-white">
                              Spotify
                            </span>
                            <span className="text-[10px] text-white/40">
                              Music App
                            </span>
                          </button>

                          {/* Explorer */}
                          <button
                            onClick={() =>
                              handleTileClick("Launched File Explorer")
                            }
                            className="group relative flex flex-col items-center justify-center h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08] active:scale-95 transition-all text-center"
                          >
                            <AppWindow className="w-6 h-6 mb-1.5 text-amber-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[12px] font-semibold">
                              Explorer
                            </span>
                            <span className="text-[10px] text-white/40">
                              Files
                            </span>
                          </button>

                          {/* VLC */}
                          <button
                            onClick={() =>
                              handleTileClick("Launched VLC Media Player")
                            }
                            className="group relative flex flex-col items-center justify-center h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08] active:scale-95 transition-all text-center"
                          >
                            <Film className="w-6 h-6 mb-1.5 text-orange-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[12px] font-semibold">
                              VLC Player
                            </span>
                            <span className="text-[10px] text-white/40">
                              Videos
                            </span>
                          </button>

                          {/* Screenshot */}
                          <button
                            onClick={() =>
                              handleTileClick("Triggered Snipping Tool Screenshot")
                            }
                            className="group relative flex flex-col items-center justify-center h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 active:scale-95 transition-all text-center"
                          >
                            <Maximize2 className="w-6 h-6 mb-1.5 group-hover:scale-110 transition-transform" />
                            <span className="text-[12px] font-semibold text-white">
                              Screenshot
                            </span>
                            <span className="text-[10px] text-white/40">
                              Quick Macro
                            </span>
                          </button>

                          {/* Clipboard Sync */}
                          <button
                            onClick={() =>
                              handleTileClick("Clipboard text synced to PC")
                            }
                            className="group relative flex flex-col items-center justify-center h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08] active:scale-95 transition-all text-center"
                          >
                            <Clipboard className="w-6 h-6 mb-1.5 text-violet-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[12px] font-semibold">
                              Clipboard
                            </span>
                            <span className="text-[10px] text-white/40">
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
                            className="group relative flex flex-col items-center justify-center h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08] active:scale-95 transition-all text-center"
                          >
                            <Send className="w-6 h-6 mb-1.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[12px] font-semibold">
                              Send File
                            </span>
                            <span className="text-[10px] text-white/40">
                              DropZone
                            </span>
                          </button>

                          {/* Show Desktop */}
                          <button
                            onClick={() =>
                              handleTileClick("Toggled Show Desktop (Win+D)")
                            }
                            className="group relative flex flex-col items-center justify-center h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08] active:scale-95 transition-all text-center"
                          >
                            <Monitor className="w-6 h-6 mb-1.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[12px] font-semibold">
                              Desktop
                            </span>
                            <span className="text-[10px] text-white/40">
                              Win + D
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* PAGE 2: Media & System Controls */}
                      <div className="w-full flex-shrink-0 px-0.5">
                        <div className="grid grid-cols-2 gap-2.5">
                          {/* Play/Pause */}
                          <button
                            onClick={() =>
                              handleTileClick(
                                isPlaying ? "Media Paused" : "Media Playing",
                                () => setIsPlaying(!isPlaying)
                              )
                            }
                            className={`group relative flex flex-col items-center justify-center h-20 rounded-2xl border transition-all duration-200 active:scale-95 text-center ${
                              isPlaying
                                ? "bg-[#1DB954]/15 border-[#1DB954]/40 text-[#1DB954] shadow-[0_0_20px_rgba(29,185,84,0.25)]"
                                : "bg-white/[0.04] border-white/[0.08] text-white"
                            }`}
                          >
                            {isPlaying ? (
                              <Pause className="w-6 h-6 mb-1.5" />
                            ) : (
                              <Play className="w-6 h-6 mb-1.5" />
                            )}
                            <span className="text-[12px] font-semibold">
                              {isPlaying ? "Pause" : "Play"}
                            </span>
                            <span className="text-[10px] text-white/40">
                              Media
                            </span>
                          </button>

                          {/* Next Track */}
                          <button
                            onClick={() =>
                              handleTileClick("Media Session: Next Track")
                            }
                            className="group relative flex flex-col items-center justify-center h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08] active:scale-95 transition-all text-center"
                          >
                            <SkipForward className="w-6 h-6 mb-1.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[12px] font-semibold">
                              Next Track
                            </span>
                            <span className="text-[10px] text-white/40">
                              Skip Song
                            </span>
                          </button>

                          {/* Previous Track */}
                          <button
                            onClick={() =>
                              handleTileClick("Media Session: Previous Track")
                            }
                            className="group relative flex flex-col items-center justify-center h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08] active:scale-95 transition-all text-center"
                          >
                            <SkipBack className="w-6 h-6 mb-1.5 text-blue-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[12px] font-semibold">
                              Prev Track
                            </span>
                            <span className="text-[10px] text-white/40">
                              Rewind
                            </span>
                          </button>

                          {/* Volume Up */}
                          <button
                            onClick={() =>
                              handleTileClick("Windows Volume +5%", () =>
                                triggerVolumeHud(Math.min(100, volume + 5))
                              )
                            }
                            className="group relative flex flex-col items-center justify-center h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08] active:scale-95 transition-all text-center"
                          >
                            <Volume2 className="w-6 h-6 mb-1.5 text-[#5E6AD2] group-hover:scale-110 transition-transform" />
                            <span className="text-[12px] font-semibold">
                              Volume +5
                            </span>
                            <span className="text-[10px] text-white/40">
                              {volume}%
                            </span>
                          </button>

                          {/* Volume Down */}
                          <button
                            onClick={() =>
                              handleTileClick("Windows Volume -5%", () =>
                                triggerVolumeHud(Math.max(0, volume - 5))
                              )
                            }
                            className="group relative flex flex-col items-center justify-center h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08] active:scale-95 transition-all text-center"
                          >
                            <Volume1 className="w-6 h-6 mb-1.5 text-blue-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[12px] font-semibold">
                              Volume -5
                            </span>
                            <span className="text-[10px] text-white/40">
                              {volume}%
                            </span>
                          </button>

                          {/* Mute Toggle */}
                          <button
                            onClick={() =>
                              handleTileClick(
                                isMuted ? "PC Audio Unmuted" : "PC Audio Muted",
                                () => setIsMuted(!isMuted)
                              )
                            }
                            className={`group relative flex flex-col items-center justify-center h-20 rounded-2xl border transition-all active:scale-95 text-center ${
                              isMuted
                                ? "bg-red-500/20 border-red-500/40 text-red-400"
                                : "bg-white/[0.04] border-white/[0.08] text-white hover:bg-white/[0.08]"
                            }`}
                          >
                            <VolumeX className="w-6 h-6 mb-1.5" />
                            <span className="text-[12px] font-semibold">
                              {isMuted ? "Unmute" : "Mute"}
                            </span>
                            <span className="text-[10px] text-white/40">
                              Master Out
                            </span>
                          </button>

                          {/* Lock Screen */}
                          <button
                            onClick={() =>
                              handleTileClick("Locked Workstation (Win+L)")
                            }
                            className="group relative flex flex-col items-center justify-center h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08] active:scale-95 transition-all text-center"
                          >
                            <Lock className="w-6 h-6 mb-1.5 text-amber-400 group-hover:scale-110 transition-transform" />
                            <span className="text-[12px] font-semibold">
                              Lock PC
                            </span>
                            <span className="text-[10px] text-white/40">
                              Win + L
                            </span>
                          </button>

                          {/* Shutdown */}
                          <button
                            onClick={() =>
                              handleTileClick("Shutdown PC initiated...")
                            }
                            className="group relative flex flex-col items-center justify-center h-20 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 active:scale-95 transition-all text-center"
                          >
                            <Power className="w-6 h-6 mb-1.5 group-hover:scale-110 transition-transform" />
                            <span className="text-[12px] font-semibold">
                              Power Off
                            </span>
                            <span className="text-[10px] text-white/40">
                              Shutdown
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM: Android Navigation & Indicators */}
                  <div className="pt-2">
                    <div className="flex items-center justify-center gap-2 mb-2.5">
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

                    {/* Android Gesture Home Bar */}
                    <div className="w-28 h-1 bg-white/35 rounded-full mx-auto" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Chevron for Desktop */}
            <button
              onClick={() => goToTab("next")}
              disabled={activeIndex === TABS.length - 1}
              aria-label="Next Page"
              className={`hidden md:flex absolute -right-14 items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all z-20 ${
                activeIndex === TABS.length - 1
                  ? "opacity-20 cursor-not-allowed pointer-events-none"
                  : "opacity-100 cursor-pointer"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Feature Card (Desktop Only) */}
          <div className="hidden lg:flex flex-col gap-4 w-72 shrink-0">
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center mb-3 text-blue-400">
                <Sliders className="w-4 h-4" />
              </div>
              <h4 className="text-[14px] font-bold text-white mb-1">
                Custom Macro Tiles
              </h4>
              <p className="text-[12px] text-white/50 leading-relaxed">
                Launch apps, trigger PowerShell scripts, switch OBS scenes, or execute multi-step macros with one tap.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center mb-3 text-amber-400">
                <Radio className="w-4 h-4" />
              </div>
              <h4 className="text-[14px] font-bold text-white mb-1">
                Live Windows Media API
              </h4>
              <p className="text-[12px] text-white/50 leading-relaxed">
                Seamless integration with Spotify, VLC, and Windows Media Session. Full playback and volume sync.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 text-blue-300 text-[11px] leading-relaxed">
              👆 <strong>Swipe or Drag:</strong> Slide left/right on the phone screen with touch or mouse to switch pages instantly.
            </div>
          </div>
        </div>

        {/* Footer Swipe Hint */}
        <p className="relative z-10 text-center text-[11px] sm:text-[12px] text-white/40 mt-6 sm:mt-8">
          👈 Swipe on screen or drag with mouse to switch pages · Click side keys for hardware control 👉
        </p>
      </div>
    </div>
  );
}
