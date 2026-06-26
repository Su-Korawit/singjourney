import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
