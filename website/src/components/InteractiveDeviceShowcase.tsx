"use client";

import { useState } from "react";
import {
  Volume2,
  VolumeX,
  Volume1,
  Play,
  Pause,
  SkipForward,
  Mic,
  MicOff,
  Video,
  Monitor,
  Code2,
  Folder,
  Radio,
  Sliders,
  Sparkles,
  Camera,
  Maximize2,
  CheckCircle2,
  Layers,
  Flame,
  Terminal,
} from "lucide-react";

export default function InteractiveDeviceShowcase() {
  const [activeTab, setActiveTab] = useState<"stream" | "dev" | "media">("stream");
  const [volume, setVolume] = useState(65);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [lastAction, setLastAction] = useState<string>("Ready — Tap any tile to test live");

  const handleTileClick = (name: string, callback?: () => void) => {
    setLastAction(`Executed: ${name} (0ms local latency)`);
    if (callback) callback();
  };

  return (
    <div id="features" className="w-full max-w-5xl mx-auto flex flex-col items-center gap-8 mt-12 px-4 scroll-mt-24">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
        <button
          onClick={() => setActiveTab("stream")}
          className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
            activeTab === "stream"
              ? "bg-[#5E6AD2] text-white shadow-[0_0_20px_rgba(94,106,210,0.5)]"
              : "text-white/50 hover:text-white"
          }`}
        >
          Stream & Create
        </button>
        <button
          onClick={() => setActiveTab("dev")}
          className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
            activeTab === "dev"
              ? "bg-[#5E6AD2] text-white shadow-[0_0_20px_rgba(94,106,210,0.5)]"
              : "text-white/50 hover:text-white"
          }`}
        >
          Dev & Workflows
        </button>
        <button
          onClick={() => setActiveTab("media")}
          className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
            activeTab === "media"
              ? "bg-[#5E6AD2] text-white shadow-[0_0_20px_rgba(94,106,210,0.5)]"
              : "text-white/50 hover:text-white"
          }`}
        >
          Windows Controls
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
              <span className="text-[14px] text-white font-mono font-medium">{lastAction}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[12px] text-white/60">
            {/* Live Volume Meter */}
            <div className="flex items-center gap-2">
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#5E6AD2]" />}
              <span>{isMuted ? "MUTED" : `${volume}%`}</span>
            </div>

            {/* OBS Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-white/20"}`} />
              <span>{isRecording ? "OBS REC" : "OBS IDLE"}</span>
            </div>

            {/* Ping */}
            <div className="hidden sm:flex items-center gap-1.5 text-white/40">
              <span className="text-emerald-400 font-bold">●</span>
              <span>1.2 ms Wi-Fi</span>
            </div>
          </div>
        </div>

        {/* Smartphone Hardware Frame */}
        <div className="relative z-10 max-w-3xl mx-auto rounded-[32px] sm:rounded-[40px] bg-gradient-to-b from-[#2a2a30] via-[#151518] to-[#0d0d10] p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)]">
          <div className="relative rounded-[24px] sm:rounded-[32px] bg-black p-4 sm:p-6 border border-white/[0.06] overflow-hidden">
            {/* Top Phone Header / Notch */}
            <div className="flex items-center justify-between mb-5 text-[11px] text-white/40 px-2 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5E6AD2]" />
                <span className="text-white/70 font-sans font-medium">WinDeck Mobile</span>
              </div>
              <div className="w-16 h-3 bg-white/10 rounded-full mx-auto" />
              <div className="flex items-center gap-2">
                <span>5G · 100%</span>
              </div>
            </div>

            {/* Grid of Interactive Buttons (3x4 or 2x4 on mobile) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activeTab === "stream" && (
                <>
                  {/* OBS Stream / Record */}
                  <button
                    onClick={() =>
                      handleTileClick(isRecording ? "OBS Stop Recording" : "OBS Start Recording", () =>
                        setIsRecording(!isRecording)
                      )
                    }
                    className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 active:scale-95 ${
                      isRecording
                        ? "bg-red-500/15 border-red-500/40 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                        : "bg-white/[0.04] border-white/[0.08] text-white/80 hover:bg-white/[0.08]"
                    }`}
                  >
                    <Radio className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-semibold">{isRecording ? "Recording" : "Start Rec"}</span>
                    <span className="text-[10px] text-white/40">OBS Studio</span>
                  </button>

                  {/* Discord Mute */}
                  <button
                    onClick={() =>
                      handleTileClick(isMicMuted ? "Discord Mic Unmuted" : "Discord Mic Muted", () =>
                        setIsMicMuted(!isMicMuted)
                      )
                    }
                    className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 active:scale-95 ${
                      isMicMuted
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                        : "bg-white/[0.04] border-white/[0.08] text-white/80 hover:bg-white/[0.08]"
                    }`}
                  >
                    {isMicMuted ? (
                      <MicOff className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                    ) : (
                      <Mic className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="text-[12px] font-semibold">{isMicMuted ? "Mic Muted" : "Mute Mic"}</span>
                    <span className="text-[10px] text-white/40">Discord</span>
                  </button>

                  {/* Switch Scene: Game */}
                  <button
                    onClick={() => handleTileClick("Switched to Scene: Gaming (OBS)")}
                    className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] hover:border-purple-500/30 active:scale-95 transition-all"
                  >
                    <Monitor className="w-6 h-6 mb-2 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-semibold">Scene: Game</span>
                    <span className="text-[10px] text-white/40">Full Screen</span>
                  </button>

                  {/* Switch Scene: Camera */}
                  <button
                    onClick={() => handleTileClick("Switched to Scene: Just Chatting")}
                    className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] hover:border-blue-500/30 active:scale-95 transition-all"
                  >
                    <Camera className="w-6 h-6 mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-semibold">Scene: Cam</span>
                    <span className="text-[10px] text-white/40">Webcam 1080p</span>
                  </button>

                  {/* Spotify Play/Pause */}
                  <button
                    onClick={() =>
                      handleTileClick(isPlaying ? "Spotify Paused" : "Spotify Playing", () => setIsPlaying(!isPlaying))
                    }
                    className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-[#1DB954]/10 border border-[#1DB954]/30 text-[#1DB954] hover:bg-[#1DB954]/15 active:scale-95 transition-all"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 mb-2" /> : <Play className="w-6 h-6 mb-2" />}
                    <span className="text-[12px] font-semibold">{isPlaying ? "Pause" : "Play"}</span>
                    <span className="text-[10px] text-white/40">Spotify</span>
                  </button>

                  {/* Soundboard Meme */}
                  <button
                    onClick={() => handleTileClick("Triggered Sound FX: Airhorn")}
                    className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                  >
                    <Flame className="w-6 h-6 mb-2 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-semibold">Airhorn FX</span>
                    <span className="text-[10px] text-white/40">Soundboard</span>
                  </button>

                  {/* Master Mute */}
                  <button
                    onClick={() =>
                      handleTileClick(isMuted ? "Windows Audio Unmuted" : "Windows Audio Muted", () =>
                        setIsMuted(!isMuted)
                      )
                    }
                    className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all active:scale-95 ${
                      isMuted
                        ? "bg-red-500/15 border-red-500/40 text-red-400"
                        : "bg-white/[0.04] border-white/[0.08] text-white/80 hover:bg-white/[0.08]"
                    }`}
                  >
                    <VolumeX className="w-6 h-6 mb-2" />
                    <span className="text-[12px] font-semibold">{isMuted ? "Unmute PC" : "Mute PC"}</span>
                    <span className="text-[10px] text-white/40">Audio Device</span>
                  </button>

                  {/* Screenshot */}
                  <button
                    onClick={() => handleTileClick("Captured Snipping Tool Screenshot")}
                    className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                  >
                    <Maximize2 className="w-6 h-6 mb-2 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-semibold">Screenshot</span>
                    <span className="text-[10px] text-white/40">Win+Shift+S</span>
                  </button>
                </>
              )}

              {activeTab === "dev" && (
                <>
                  {/* VS Code */}
                  <button
                    onClick={() => handleTileClick("Launched / Focused: VS Code")}
                    className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 active:scale-95 transition-all"
                  >
                    <Code2 className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-semibold">VS Code</span>
                    <span className="text-[10px] text-white/40">Focus Project</span>
                  </button>

                  {/* Terminal */}
                  <button
                    onClick={() => handleTileClick("Opened Windows Terminal (PowerShell)")}
                    className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                  >
                    <Terminal className="w-6 h-6 mb-2 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-semibold">Terminal</span>
                    <span className="text-[10px] text-white/40">PowerShell</span>
                  </button>

                  {/* Git Commit & Push Macro */}
                  <button
                    onClick={() => handleTileClick("Triggered Macro: git add . && git commit -m 'update'")}
                    className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 active:scale-95 transition-all"
                  >
                    <Layers className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-semibold">Git Push</span>
                    <span className="text-[10px] text-white/40">Quick Macro</span>
                  </button>

                  {/* Focus Browser */}
                  <button
                    onClick={() => handleTileClick("Focused Google Chrome / DevTools")}
                    className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                  >
                    <Monitor className="w-6 h-6 mb-2 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-semibold">Chrome</span>
                    <span className="text-[10px] text-white/40">localhost:3000</span>
                  </button>

                  {/* Lock Screen */}
                  <button
                    onClick={() => handleTileClick("Triggered Win+L (Lock Workstation)")}
                    className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                  >
                    <Folder className="w-6 h-6 mb-2 text-pink-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-semibold">Explorer</span>
                    <span className="text-[10px] text-white/40">c:/WINDECK</span>
                  </button>

                  {/* Docker restart */}
                  <button
                    onClick={() => handleTileClick("Executed: docker-compose restart")}
                    className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 active:scale-95 transition-all"
                  >
                    <Sliders className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-semibold">Docker</span>
                    <span className="text-[10px] text-white/40">Restart All</span>
                  </button>

                  {/* Discord Deafen */}
                  <button
                    onClick={() => handleTileClick("Discord Deafen Toggled")}
                    className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                  >
                    <MicOff className="w-6 h-6 mb-2 text-rose-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-semibold">Deafen</span>
                    <span className="text-[10px] text-white/40">Focus Mode</span>
                  </button>

                  {/* Clear Temp / Cache */}
                  <button
                    onClick={() => handleTileClick("Cleared node_modules .next cache")}
                    className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                  >
                    <Sparkles className="w-6 h-6 mb-2 text-violet-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-semibold">Clean Dev</span>
                    <span className="text-[10px] text-white/40">npm run clean</span>
                  </button>
                </>
              )}

              {activeTab === "media" && (
                <>
                  {/* Volume Up */}
                  <button
                    onClick={() =>
                      handleTileClick("Windows Volume +5%", () => setVolume((v) => Math.min(100, v + 5)))
                    }
                    className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                  >
                    <Volume2 className="w-6 h-6 mb-2 text-[#5E6AD2] group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-semibold">Volume +5</span>
                    <span className="text-[10px] text-white/40">Current: {volume}%</span>
                  </button>

                  {/* Volume Down */}
                  <button
                    onClick={() =>
                      handleTileClick("Windows Volume -5%", () => setVolume((v) => Math.max(0, v - 5)))
                    }
                    className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                  >
                    <Volume1 className="w-6 h-6 mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-semibold">Volume -5</span>
                    <span className="text-[10px] text-white/40">Current: {volume}%</span>
                  </button>

                  {/* Skip Song */}
                  <button
                    onClick={() => handleTileClick("Media Next Track")}
                    className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] active:scale-95 transition-all"
                  >
                    <SkipForward className="w-6 h-6 mb-2 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[12px] font-semibold">Next Song</span>
                    <span className="text-[10px] text-white/40">Media Key</span>
                  </button>

                  {/* Toggle Mute */}
                  <button
                    onClick={() =>
                      handleTileClick(isMuted ? "Unmuted" : "Muted", () => setIsMuted(!isMuted))
                    }
                    className={`group relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all active:scale-95 ${
                      isMuted ? "bg-red-500/20 border-red-500/40 text-red-400" : "bg-white/[0.04] border-white/[0.08]"
                    }`}
                  >
                    <VolumeX className="w-6 h-6 mb-2" />
                    <span className="text-[12px] font-semibold">{isMuted ? "Muted" : "Mute"}</span>
                    <span className="text-[10px] text-white/40">Master Out</span>
                  </button>
                </>
              )}
            </div>

            {/* Bottom Swipe Page Indicator */}
            <div className="mt-5 flex items-center justify-center gap-1.5">
              <span className={`h-1.5 rounded-full transition-all ${activeTab === "stream" ? "w-6 bg-[#5E6AD2]" : "w-1.5 bg-white/20"}`} />
              <span className={`h-1.5 rounded-full transition-all ${activeTab === "dev" ? "w-6 bg-[#5E6AD2]" : "w-1.5 bg-white/20"}`} />
              <span className={`h-1.5 rounded-full transition-all ${activeTab === "media" ? "w-6 bg-[#5E6AD2]" : "w-1.5 bg-white/20"}`} />
            </div>
          </div>
        </div>

        {/* Footer info tip */}
        <p className="relative z-10 text-center text-[12px] text-white/30 mt-6">
          Interactive Demo — Click buttons above to simulate live Windows PC actions over local Wi-Fi.
        </p>
      </div>
    </div>
  );
}
