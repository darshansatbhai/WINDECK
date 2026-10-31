import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Download, Smartphone, ArrowRight, ShieldCheck, Zap, Laptop, Star, Play, Monitor, Wifi } from "lucide-react";

const sections = [
  {
    num: "01",
    title: "Pairing",
    desc: "Enter the 6-digit OTP from your PC and connect instantly over Wi-Fi.",
  },
  {
    num: "02",
    title: "Control",
    desc: "Tap tiles to adjust volume, launch apps, trigger macros, and more.",
  },
  {
    num: "03",
    title: "Command",
    desc: "Custom pages, media control, presentation tools — all from your phone.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col selection:bg-[#5E6AD2] selection:text-white overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1 relative">
        {/* ============ HERO SECTION ============ */}
        <section className="relative min-h-[100vh] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
          {/* Ambient gradients */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#5E6AD2]/20 blur-[140px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[160px] rounded-full" />
            <div className="absolute top-[25%] right-[15%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
          </div>

          {/* Grid background */}
          <div className="absolute inset-0 z-0 opacity-[0.04]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }} />

          <div className="relative z-10 flex flex-col items-center w-full max-w-6xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[11px] font-semibold text-emerald-400/90 tracking-widest uppercase mb-10 backdrop-blur-sm">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </div>
              <span>v2.4.0 — Stable Release</span>
            </div>

            {/* Headline */}
            <h1 className="text-[56px] sm:text-[96px] md:text-[110px] font-extrabold tracking-[-0.06em] leading-[1.02] mb-8 max-w-7xl">
              Your phone<span className="block"> is already</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5E6AD2] via-[#8B97E8] to-[#b6bdfa]">a powerful controller.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-[18px] sm:text-[22px] text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
              Turn your Android phone into a wireless Stream Deck for your Windows PC. Launch apps, control volume, trigger macros, manage OBS scenes — all over zero-latency local Wi-Fi. 100% free, no hardware needed.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a
                href="#download"
                className="flex items-center justify-center gap-3 h-14 px-10 rounded-full bg-[#5E6AD2] text-white text-[16px] font-semibold hover:bg-[#4f5bc4] transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_40px_rgba(94,106,210,0.4)]"
              >
                <Download className="w-5 h-5" />
                <span>Get WinDeck for Windows</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#download"
                className="flex items-center justify-center gap-3 h-14 px-10 rounded-full bg-white/5 border border-white/10 text-white text-[16px] font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                <Smartphone className="w-5 h-5" />
                <span>Get Android App</span>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 px-4 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[11px] text-gray-400 font-medium uppercase tracking-wider">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Cloud</span>
              </div>
              <span className="w-px h-5 bg-white/20 mx-3" />
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Zap className="w-4 h-4" />
                <span>Zero Latency</span>
              </div>
              <span className="w-px h-5 bg-white/20 mx-3" />
              <div className="flex items-center gap-1.5 text-purple-400">
                <Star className="w-4 h-4" />
                <span>Open Source</span>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
              <div className="w-1 h-9 bg-gradient-to-b from-white to-transparent rounded-full" />
              <div className="w-2.5 h-2.5 bg-white rounded-full mt-1" />
            </div>
          </div>
        </section>

        {/* ============ HOW IT WORKS ============ */}
        <section className="relative py-24 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-[32px] sm:text-[48px] font-extrabold tracking-tight mb-4">How it works</h2>
              <p className="text-gray-400 text-lg">Three steps to transform your phone into a controller</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {sections.map((s) => (
                <div key={s.num} className="group relative p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[#5E6AD2]/50 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-mono font-bold text-2xl text-[#5E6AD2]">{s.num}</span>
                    <span className="w-px h-6 bg-white/20" />
                    <span className="text-sm font-semibold uppercase tracking-wider text-white/50 group-hover:text-[#5E6AD2] transition-colors">{s.title}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ FEATURES GRID ============ */}
        <section className="relative py-24 px-6 bg-[#09090c]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-[32px] sm:text-[48px] font-extrabold tracking-tight mb-4">Everything you need</h2>
              <p className="text-gray-400 text-lg">Custom macros, app launching, media control, and presentation tools — all from your phone.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Volume Control", icon: <Monitor className="w-6 h-6" />, color: "text-blue-400", desc: "Adjust PC system volume or mute with one tap." },
                { title: "App Launcher", icon: <Laptop className="w-6 h-6" />, color: "text-purple-400", desc: "Launch any installed application from your phone." },
                { title: "Media Control", icon: <Play className="w-6 h-6" />, color: "text-emerald-400", desc: "Play, pause, skip tracks for Spotify, YouTube, and more." },
                { title: "Macros", icon: <Zap className="w-6 h-6" />, color: "text-pink-400", desc: "Trigger PowerShell commands and custom macros instantly." },
                { title: "Screenshots", icon: <Monitor className="w-6 h-6" />, color: "text-cyan-400", desc: "Capture your PC screen directly to your phone." },
                { title: "Screen Lock", icon: <ShieldCheck className="w-6 h-6" />, color: "text-red-400", desc: "Lock your Windows workstation remotely." },
                { title: "Local Wi-Fi", icon: <Wifi className="w-6 h-6" />, color: "text-green-400", desc: "Everything runs on your home network — no cloud." },
                { title: "Custom Pages", icon: <Star className="w-6 h-6" />, color: "text-amber-400", desc: "Create custom button layouts for different apps and workflows." },
              ].map((feature, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[feature.color] transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-sm font-bold mb-2">{feature.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ DOWNLOAD SECTION ============ */}
        <section id="download" className="relative py-24 px-6">
          <div className="relative z-10">
            <div className="absolute inset-0 z-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#5E6AD2]/20 blur-[160px] rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto text-center">
              <div className="flex flex-col items-center gap-4 px-4 py-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl mb-16">
                <div className="flex items-center gap-2 px-5 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[11px] font-semibold text-emerald-400 tracking-widest uppercase">
                  Official Release v2.4.0
                </div>
                <h2 className="text-[32px] sm:text-[48px] font-extrabold tracking-tight mb-4">Ready to upgrade your setup?</h2>
                <p className="text-gray-400 text-lg max-w-xl mx-auto">
                  Download WinDeck for Windows and Android. Completely free, forever.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Windows Card */}
                <div className="p-8 rounded-[1.5rem] border border-white/10 bg-white/5 backdrop-blur-lg hover:border-[#5E6AD2]/50 hover:bg-white/10 transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-6 group-hover:text-[#5E6AD2] transition-colors">
                    <Monitor className="w-6 h-6 text-[#5E6AD2] group-hover:text-white" />
                    <span className="text-xl font-bold">WinDeck Server</span>
                    <span className="ml-auto text-xs font-mono text-gray-500 bg-white/10 px-2 py-1 rounded">v2.4.0</span>
                  </div>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-bold mb-1">Windows 10 & 11</h3>
                      <p className="text-gray-400 text-sm">System tray support, auto-start, QR pairing</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#5E6AD2]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0 0l-8-8-4 4-6 -6" /></svg>
                    </div>
                  </div>
                  <a
                    href="https://github.com/darshansatbhai/WINDECK/releases/download/v2.4.0/WinDeck_Server_Setup.exe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 h-14 rounded-xl bg-[#5E6AD2] text-white text-lg font-semibold hover:bg-[#4f5bc4] transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_40px_rgba(94,106,210,0.5)] active:scale-[0.98]"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Installer (.exe)</span>
                  </a>
                  <p className="mt-4 text-xs text-gray-500">NSIS Installer · ~180 MB</p>
                </div>

                {/* Android Card */}
                <div className="p-8 rounded-[1.5rem] border border-white/10 bg-white/5 backdrop-blur-lg hover:border-[#5E6AD2]/50 hover:bg-white/10 transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-6 group-hover:text-[#5E6AD2] transition-colors">
                    <Smartphone className="w-6 h-6 text-[#5E6AD2] group-hover:text-white" />
                    <span className="text-xl font-bold">WinDeck Mobile</span>
                    <span className="ml-auto text-xs font-mono text-gray-500 bg-white/10 px-2 py-1 rounded">v2.4.0</span>
                  </div>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-bold mb-1">Android 8.0+</h3>
                      <p className="text-gray-400 text-sm">Universal APK for phones and tablets</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#5E6AD2]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0 0l-8-8-4 4-6 -6" /></svg>
                    </div>
                  </div>
                  <a
                    href="https://github.com/darshansatbhai/WINDECK/releases/download/v2.4.0/WinDeck_App.apk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 h-14 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-[1.02] shadow-lg active:scale-[0.98]"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download APK (.apk)</span>
                  </a>
                  <p className="mt-4 text-xs text-gray-500">Flutter Build · ~52 MB</p>
                </div>
              </div>

              <div className="mt-12 flex flex-col items-center gap-3">
                <a
                  href="https://github.com/darshansatbhai/WINDECK/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5E6AD2] text-sm font-medium hover:text-[#4f5bc4] transition-colors"
                >
                  View all releases <ArrowRight className="w-4 h-4 inline ml-1" />
                </a>
                <p className="text-xs text-gray-500">Already installed? Check the changelog for v2.4.0 updates.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ COMPARISON ============ */}
        <section className="relative py-24 px-6 bg-[#0a0a0f] border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 order-2 md:order-1">
                <h2 className="text-[32px] font-extrabold tracking-tight mb-4">Stop spending $250 on hardware</h2>
                <p className="text-gray-400 text-lg mb-8">
                  Elgato Stream Deck and similar hardware cost hundreds. WinDeck uses your existing phone — zero hardware cost, same power.
                </p>
                <ul className="space-y-3">
                  {[
                    "No expensive hardware to buy",
                    "No subscriptions or hidden fees",
                    "Customize unlimited buttons and pages",
                    "Works with your existing Android phone",
                    "Open source and community driven",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-lg">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/2 order-1 md:order-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-lg font-bold text-red-400">$249+</span>
                    </div>
                    <div className="text-sm text-gray-400">Stream Deck + hardware</div>
                  </div>
                  <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-lg font-bold text-emerald-400">$0</span>
                    </div>
                    <div className="text-sm text-gray-400">WinDeck + your phone</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
