import type { Metadata } from "next";
import Script from "next/script";
import { StoreHydrator } from "@/components/store-hydrator";
import { ThemeSync } from "@/components/theme-sync";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Physics Universe",
  description: "Interactive AI-powered learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {`(() => {
            try {
              const stored = localStorage.getItem("ai-physics-settings-store");
              const theme = stored ? JSON.parse(stored)?.state?.settings?.theme : null;
              const resolved = theme === "light" || theme === "dark" ? theme : "dark";
              document.documentElement.classList.toggle("dark", resolved === "dark");
              document.documentElement.style.colorScheme = resolved;
            } catch {
              document.documentElement.classList.add("dark");
              document.documentElement.style.colorScheme = "dark";
            }
          })();`}
        </Script>
        <StoreHydrator />
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
