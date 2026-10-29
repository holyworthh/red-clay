import type { Metadata } from "next";
import { Newsreader, Geist, Geist_Mono } from "next/font/google";
import { BagProvider } from "@/components/commerce/BagProvider";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/navigation/Header";
import { CursorLabel } from "@/components/motion/CursorLabel";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { bootScript, prehideCss } from "@/lib/motion/plan";
import "./globals.css";

const editorial = Newsreader({ subsets: ["latin"], variable: "--font-editorial", display: "swap" });
const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Red Clay Coffee — Contemporary African Coffee House", template: "%s — Red Clay Coffee" },
  description: "House coffees and seasonal releases from Kenya, Burundi, and Ethiopia, with researched stories on place and coffee.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The boot script adds motion classes before hydration.
    <html lang="en" className={`${editorial.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <style dangerouslySetInnerHTML={{ __html: prehideCss }} />
      </head>
      <body>
        <div className="intro" aria-hidden="true">
          <div className="intro-inner">
            <span className="serif intro-word">Red Clay</span>
            <span className="intro-line" />
            <span className="mono intro-sub">Coffee, held by place</span>
          </div>
        </div>
        <BagProvider><Header /><CartDrawer />{children}<Footer /></BagProvider>
        <div className="curtain" aria-hidden="true"><span className="curtain-mask"><span className="serif curtain-label" /></span><span className="mono curtain-mark">Red Clay</span></div>
        <CursorLabel />
        <MotionRoot />
      </body>
    </html>
  );
}
