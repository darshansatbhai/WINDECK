import Navbar from "@/components/Navbar";
import InteractiveDeviceShowcase from "@/components/InteractiveDeviceShowcase";
import PriceComparison from "@/components/PriceComparison";
import DualAppShowcase from "@/components/DualAppShowcase";
import VersionSpecs from "@/components/VersionSpecs";
import PersonaCards from "@/components/PersonaCards";
import HowItWorks from "@/components/HowItWorks";
import PrivacySection from "@/components/PrivacySection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import { Download, Sparkles, Star, ArrowRight, ShieldCheck, Zap, Laptop, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex flex-col selection:bg-[#5E6AD2] selection:text-white">
      {/* Sticky Glass Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden bg-black bg-grid-pattern">
          {/* Ambient Lighting Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] sm:w-[900px] h-[450px] rounded-full bg-[#5E6AD2] opacity-[0.09] blur-[150px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-600 opacity-[0.05] blur-[120px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center w-full max-w-5xl mx-auto">
            {/* Version Badge */}
            <a
              href="#download"
              className="group relative mb-8 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-[11px] font-medium text-white/80 tracking-widest uppercase shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:border-green-500/50 hover:text-white transition-all"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span>v2.4.0 — Windows (v2.4.0) & Android (v2.4.0+1)</span>
              <span className="text-green-300 text-[13px]">✦</span>
              <ArrowRight className="w-3.5 h-3.5 text-green-400 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Hero Main Headline */}
            <h1 className="text-[52px] sm:text-[76px] md:text-[96px] font-extrabold tracking-[-0.04em] leading-[1.02] max-w-4xl mb-6">
              The controller<br />
              <span className="bg-gradient-to-r from-[#5E6AD2] via-[#8B97E8] to-[#b6bdfa] bg-clip-text text-transparent">
                you already own.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-[17px] sm:text-[20px] text-white/50 max-w-xl leading-relaxed font-light mb-10">
              Your Android phone is already a controller. WinDeck just turns it on. Low latency. Zero hardware cost. Free, forever.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <a
                href="#windows-app"
                className="inline-flex items-center justify-center gap-2 h-[48px] px-8 rounded-full bg-[#5E6AD2] text-white text-[15px] font-semibold hover:bg-[#4f5bc4] transition-all glow-btn shadow-[0_0_32px_rgba(94,106,210,0.4)]"
              >
                <Download className="w-4 h-4" />
                <span>Get WinDeck for Windows</span>
              </a>

              <a
                href="#android-app"
                className="inline-flex items-center justify-center gap-2 h-[48px] px-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.18] text-white text-[15px] font-semibold hover:border-white/40 transition-all"
              >
                <Smartphone className="w-4 h-4 text-white/70" />
                <span>Get Android App</span>
              </a>
            </div>

            {/* Rating / Open Source Badge */}
            <div className="flex items-center gap-3 py-2 px-4 rounded-full border border-white/[0.08] bg-white/[0.02] text-[12px] text-white/50 mb-12">
              <div className="flex text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <span className="text-white/80 font-medium">100% Free & Open Source</span>
              <span>·</span>
              <span>No Elgato Hardware Needed</span>
            </div>

            {/* Interactive Live StreamDeck Simulator */}
            <InteractiveDeviceShowcase />
          </div>

          {/* Bottom Fade Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </section>

        {/* COMPARISON: $250 vs $0 */}
        <PriceComparison />

        {/* DUAL APP DOWNLOAD SECTION */}
        <DualAppShowcase />

        {/* VERSION SPECS & ARCHITECTURE */}
        <VersionSpecs />

        {/* PERSONA CARDS: Built for people who actually focus */}
        <PersonaCards />

        {/* HOW IT WORKS: 01, 02, 03 */}
        <HowItWorks />

        {/* PRIVACY SECTION: Nothing leaves your home */}
        <PrivacySection />

        {/* FAQ ACCORDION */}
        <FaqSection />

        {/* BOTTOM DOWNLOAD CTA BANNER */}
        <section className="relative bg-black py-32 px-6 border-t border-white/[0.06] overflow-hidden text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#5E6AD2] opacity-[0.1] blur-[130px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-[38px] sm:text-[52px] font-bold tracking-tight mb-4 leading-tight">
              Ready to upgrade your desk setup?
            </h2>
            <p className="text-[17px] text-white/50 mb-10 max-w-lg leading-relaxed">
              Ditch the expensive plastic hardware. Control your Windows PC directly from your phone in under 60 seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#download"
                className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#5E6AD2] hover:bg-[#4f5bc4] text-white text-[15px] font-semibold glow-btn transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download WinDeck Free</span>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.15] text-white text-[15px] font-semibold transition-all"
              >
                <span>Star on GitHub</span>
              </a>
            </div>

            <p className="mt-8 text-[12px] text-white/30">
              Compatible with Windows 10 & 11 · Android 8.0+ · Zero telemetry
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
