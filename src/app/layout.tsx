import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Sans_Arabic, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tamer Mistareehi — Generative AI Engineer & Designer",
  description:
    "بورتفوليو تامر مستريحي — مهندس ومصمم ذكاء اصطناعي توليدي: نماذج لغوية، توليد صور، وكلاء ذكاء اصطناعي وتصميم تجارب مستقبلية.",
  keywords: ["Generative AI", "LLM", "Stable Diffusion", "AI Engineer", "AI Designer", "تامر مستريحي"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${arabic.variable} ${mono.variable}`}>
      <body className="antialiased scanlines">{children}</body>
    </html>
  );
}
