import type { Metadata } from "next";
import "./globals.css";
import { MainLayoutClient } from "@/components/layout/MainLayoutClient";

export const metadata: Metadata = {
  title: "SimGizi - Sistem Informasi Gizi Anak & Deteksi Dini Stunting",
  description: "Aplikasi posyandu digital deteksi gizi buruk & stunting balita standar WHO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen bg-background font-sans">
        <MainLayoutClient>{children}</MainLayoutClient>
      </body>
    </html>
  );
}
