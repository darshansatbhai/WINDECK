import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "WinDeck — The controller you already own | Free Stream Deck Alternative",
  description:
    "Turn your Android phone into a powerful wireless Windows PC controller. Launch apps, control volume, trigger macros & OBS scenes over zero-latency Wi-Fi. 100% Free & Open Source.",
  keywords: [
    "Stream Deck alternative",
    "free Stream Deck",
    "Android Windows controller",
    "WinDeck",
    "PC remote controller",
    "OBS deck",
    "macro pad",
  ],
  authors: [{ name: "WinDeck Team" }],
  openGraph: {
    title: "WinDeck — Your phone is already a controller",
    description: "Turn your Android phone into a powerful wireless Windows PC controller. Free, local, zero latency.",
    url: "https://windeck.app",
    siteName: "WinDeck",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/favicon.png",
    apple: "/logo.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "WinDeck — Your phone is already a controller",
    description: "Turn your Android phone into a powerful wireless Windows PC controller. Free, local, zero latency.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full dark antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-[#f5f5f7] selection:bg-[#5E6AD2] selection:text-white">
        {children}
      </body>
    </html>
  );
}
