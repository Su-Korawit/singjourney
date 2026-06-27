import type { Metadata } from "next";
import { Chonburi, Mitr, Sarabun } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const chonburi = Chonburi({
  subsets: ["thai", "latin"],
  weight: "400",
  variable: "--font-display",
});

const mitr = Mitr({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-head",
});

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Sing Journey",
  description: "ผู้ช่วยวางแผนเที่ยวสิงห์บุรีด้วย AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${chonburi.variable} ${mitr.variable} ${sarabun.variable} font-body`}
      >
        <nav className="flex gap-4 border-b p-4 text-sm">
          <a href="/">หน้าแรก</a>
          <a href="/plan">วางแผน</a>
          <a href="/map">Roadmap</a>
          <a href="/watts-up">Watt&apos;s Up!</a>
        </nav>
        {children}
        <Script
          type="module"
          src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
