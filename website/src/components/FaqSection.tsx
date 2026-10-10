"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    q: "Is WinDeck completely free?",
    a: "Yes, WinDeck is 100% free and open-source. There are no subscriptions, no locked 'pro' tiers, and no ads. All core features — macros, audio control, OBS triggers, and unlimited pages — are free forever.",
  },
  {
    q: "What devices and operating systems are supported?",
    a: "The Windows desktop application runs on Windows 10 and Windows 11 (64-bit). The mobile application runs on Android 8.0 and newer (virtually any modern smartphone or tablet).",
  },
  {
    q: "Does it work without active internet?",
    a: "Yes! WinDeck connects directly over your local Wi-Fi router. As long as your PC and phone are on the same local network, WinDeck works even if your home internet is completely offline.",
  },
  {
    q: "What is the response latency compared to a hardware Stream Deck?",
    a: "Because WinDeck uses low-overhead WebSockets directly over your local 5GHz / 2.4GHz Wi-Fi, round-trip latency is typically under 2 to 5 milliseconds — practically indistinguishable from a wired USB controller.",
  },
  {
    q: "What can I control on my Windows PC?",
    a: "You can control Windows master audio, individual app volumes, media playback (Spotify, YouTube, VLC), launch games and apps, trigger OBS Studio scenes and recording, mute your Discord mic, run keyboard macros, and execute PowerShell scripts.",
  },
  {
    q: "Can I customize the buttons with my own icons and colors?",
    a: "Yes! WinDeck supports custom SVG and PNG icons, custom background colors, active state glows, and vibration haptic strength.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-[#080808] py-36 px-6 border-t border-white/[0.04]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5E6AD2] mb-3">
            Got questions?
          </p>
          <h2 className="text-[38px] sm:text-[48px] font-bold tracking-[-0.03em] leading-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden transition-colors hover:border-white/[0.12]"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-[16px] sm:text-[17px] font-semibold text-white/90">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-white/40 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#5E6AD2]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-[14px] sm:text-[15px] text-white/45 leading-relaxed border-t border-white/[0.04] animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
