"use client";

import Link from "next/link";
import { LogIn, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { useUserStore } from "@/stores/userStore";

type AuthGateProps = {
  children: React.ReactNode;
  title: string;
  description: string;
};

export function AuthGate({ children, title, description }: AuthGateProps) {
  const isAuthenticated = useUserStore(
    (state) => state.user.isAuthenticated,
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const removeStartListener = useUserStore.persist.onHydrate(() =>
      setIsHydrated(false),
    );
    const removeFinishListener = useUserStore.persist.onFinishHydration(() =>
      setIsHydrated(true),
    );

    setIsHydrated(useUserStore.persist.hasHydrated());

    return () => {
      removeStartListener();
      removeFinishListener();
    };
  }, []);

  if (!isHydrated) {
    return (
      <div
        className="h-64 animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-[#0e131b]"
        aria-label="Loading account"
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="mx-auto flex min-h-[560px] max-w-2xl items-center justify-center">
        <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-8 text-center surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] sm:p-12">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-2xl font-bold tracking-[-0.035em] text-slate-950 dark:text-white">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            {description}
          </p>
          <Link
            href="/login"
            className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
          >
            <LogIn className="size-4" aria-hidden="true" />
            Continue to login
          </Link>
        </div>
      </section>
    );
  }

  return children;
}
