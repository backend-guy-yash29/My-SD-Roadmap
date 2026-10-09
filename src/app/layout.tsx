import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "My Roadmaps", template: "%s · My Roadmaps" },
  description: "Structured study roadmaps for system design, ML and AI, with progress tracking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <Providers>
          <Header />
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
