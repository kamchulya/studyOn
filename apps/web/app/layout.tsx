import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const displayFont = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StudyOn — AI-контент для тренеров и коучей",
  description:
    "Соберите цифрового аватара один раз и получайте видео, фото, карусели и посты для соцсетей без съёмок и монтажа.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={displayFont.variable}>
      <body>{children}</body>
    </html>
  );
}
