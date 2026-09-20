"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { useUserStore } from "@/stores/userStore";

type EnterUniverseLinkProps = Omit<ComponentProps<typeof Link>, "href">;

export function getUniverseEntryHref(isAuthenticated: boolean) {
  return isAuthenticated ? "/dashboard" : "/login";
}

export function EnterUniverseLink({
  children,
  ...props
}: EnterUniverseLinkProps) {
  const isAuthenticated = useUserStore((state) => state.user.isAuthenticated);

  return (
    <Link href={getUniverseEntryHref(isAuthenticated)} {...props}>
      {children}
    </Link>
  );
}
