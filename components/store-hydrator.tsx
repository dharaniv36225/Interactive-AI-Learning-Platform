"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import { useUserStore } from "@/stores/userStore";

export function StoreHydrator() {
  useEffect(() => {
    void Promise.all([
      useUserStore.persist.rehydrate(),
      useSettingsStore.persist.rehydrate(),
    ]);
  }, []);

  return null;
}
