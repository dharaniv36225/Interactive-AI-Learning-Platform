import type { Metadata } from "next";
import type { ReactNode } from "react";

import { StoreHydrator } from "@/components/store-hydrator";
import { ThemeSync } from "@/components/theme-sync";

import "./globals.css";

export const metadata: Metadata = {
  title: "Interactive AI Learning Universe",
  description:
    "Learn anything through AI, interactive labs, smart lessons, and quizzes.",
};

const themeScript = `
(() => {
  try {
    const raw = localStorage.getItem("ai-physics-settings-store");
    const theme = raw
      ? JSON.parse(raw)?.state?.settings?.theme
      : "dark";
    const isDark = theme !== "light";
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  } catch {
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
  }
})();
`;

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <StoreHydrator />
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
