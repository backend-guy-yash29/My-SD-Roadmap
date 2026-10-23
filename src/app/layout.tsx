import type { Metadata } from "next";
import {
  Atkinson_Hyperlegible,
  Geist,
  IBM_Plex_Sans,
  Inter,
  JetBrains_Mono,
  Source_Serif_4,
} from "next/font/google";
import { Providers } from "@/components/providers";
import { APPEARANCE_SCRIPT, appearanceCss } from "@/lib/appearance";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-jetbrains" });
// Fonts users can pick in Settings. Not preloaded: a browser only downloads the one in use.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", preload: false });
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  preload: false,
});
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif", preload: false });
const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
  preload: false,
});
const fontVariables = [inter, mono, geist, plex, serif, atkinson].map((f) => f.variable).join(" ");
const APPEARANCE_CSS = appearanceCss();

export const metadata: Metadata = {
  title: { default: "My Roadmaps", template: "%s · My Roadmaps" },
  description: "Structured study roadmaps for system design, ML and AI, with progress tracking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: APPEARANCE_CSS }} />
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_SCRIPT }} />
      </head>
      <body className="min-h-screen font-sans text-sm leading-normal antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
