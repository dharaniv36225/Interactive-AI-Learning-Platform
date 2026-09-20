"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogIn, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { useUserStore } from "@/stores/userStore";

function getInitials(username: string) {
  const initials = username
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "AU";
}

export default function LoginPage() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const storedUser = useUserStore((state) => state.user);
  const [username, setUsername] = useState(
    storedUser.username === "Explorer" ? "" : storedUser.username,
  );
  const [email, setEmail] = useState(storedUser.email);
  const [error, setError] = useState<string | null>(null);
  const avatarInitials = useMemo(() => getInitials(username), [username]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim();

    if (!normalizedUsername) {
      setError("Enter a username to continue.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    login({
      username: normalizedUsername,
      email: normalizedEmail,
      avatarInitials,
    });
    router.push("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f8fa] px-4 py-8 dark:bg-[#080b10]">
      <div className="pointer-events-none absolute inset-0 physics-grid opacity-50" />
      <div className="relative mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <BrandLogo />
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950 dark:hover:text-white"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back home
          </Link>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-white surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] md:grid-cols-[0.9fr_1.1fr]">
          <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white md:block dark:bg-gradient-to-br dark:from-[#121a25] dark:to-[#0b1017]">
            <div className="absolute -right-16 -top-16 size-52 rounded-full bg-cyan-400/15 blur-3xl" />
            <div className="relative">
              <span className="grid size-12 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <h1 className="mt-8 text-3xl font-bold tracking-[-0.04em]">
                Your learning universe, remembered.
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                This hackathon login stays entirely on your device. Lessons,
                quiz attempts, tutor activity, and XP persist in local storage.
              </p>
              <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs font-semibold text-cyan-300">
                  Local demo account
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  No password or backend is required. Use any valid email to
                  create your learner profile.
                </p>
              </div>
            </div>
          </section>

          <section className="p-7 sm:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
              Welcome aboard
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.035em] text-slate-950 dark:text-white">
              Create your local profile
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your progress will remain available in this browser.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/[0.08] dark:bg-white/[0.025]">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-violet-500 text-base font-bold text-slate-950">
                  {avatarInitials}
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-950 dark:text-white">
                    Avatar initials
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Generated from your username
                  </p>
                </div>
              </div>

              <label className="block">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Username
                </span>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="name"
                  maxLength={50}
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 dark:border-white/[0.09] dark:bg-white/[0.025] dark:text-white"
                  placeholder="Ada Lovelace"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 dark:border-white/[0.09] dark:bg-white/[0.025] dark:text-white"
                  placeholder="ada@example.com"
                />
              </label>

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/[0.07] dark:text-rose-300"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
              >
                <LogIn className="size-4" aria-hidden="true" />
                Login and open dashboard
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
