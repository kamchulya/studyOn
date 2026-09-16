import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyOn — AI-контент для тренеров и коучей",
  description:
    "Соберите цифрового аватара один раз и получайте видео, фото, карусели и посты для соцсетей без съёмок и монтажа.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
