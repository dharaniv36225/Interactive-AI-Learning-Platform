"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/stores/settingsStore";

export function ThemeSync() {
  const theme = useSettingsStore((state) => state.settings.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return null;
}
