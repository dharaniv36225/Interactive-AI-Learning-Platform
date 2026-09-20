"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useSettingsStore } from "@/stores/settingsStore";

export function ThemeSync() {
  const theme = useSettingsStore((state) => state.settings.theme);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const removeStartListener = useSettingsStore.persist.onHydrate(() =>
      setIsHydrated(false),
    );
    const removeFinishListener = useSettingsStore.persist.onFinishHydration(() =>
      setIsHydrated(true),
    );

    setIsHydrated(useSettingsStore.persist.hasHydrated());

    return () => {
      removeStartListener();
      removeFinishListener();
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [isHydrated, theme]);

  return null;
}
