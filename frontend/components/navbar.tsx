"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Search, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { BrandLogo } from "@/components/brand-logo";
import { primaryNavigation, workspaceNavigation } from "@/lib/navigation";
import { useUserStore } from "@/stores/userStore";

type NavbarProps = {
  variant?: "marketing" | "workspace";
};

function isCurrentPath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar({ variant = "marketing" }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore(
    useShallow((state) => ({
      avatarInitials: state.user.avatarInitials,
      username: state.user.username,
      level: state.user.level,
      isAuthenticated: state.user.isAuthenticated,
    })),
  );
  const logout = useUserStore((state) => state.logout);
  const [isOpen, setIsOpen] = useState(false);
  const isWorkspace = variant === "workspace";
  const navigation = isWorkspace ? workspaceNavigation : primaryNavigation;

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        isWorkspace
          ? "border-slate-200/80 bg-white/90 dark:border-white/[0.08] dark:bg-[#080b10]/90"
          : "border-transparent bg-white/75 dark:bg-[#080b10]/70"
      }`}
    >
      <div
        className={`mx-auto flex h-[68px] items-center justify-between px-4 sm:px-6 ${
          isWorkspace ? "max-w-[1600px] lg:px-8" : "max-w-7xl lg:px-8"
        }`}
      >
        <BrandLogo />

        {!isWorkspace && (
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {primaryNavigation.slice(1).map((item) => {
              const isActive = isCurrentPath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-950 dark:bg-white/[0.08] dark:text-white"
                      : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="hidden items-center gap-2 md:flex">
          {isWorkspace ? (
            <>
              <button
                type="button"
                className="hidden h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-500 transition hover:bg-slate-100 xl:flex dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-400 dark:hover:bg-white/[0.07]"
                aria-label="Search learning workspace"
              >
                <Search className="size-3.5" aria-hidden="true" />
                Search
                <kbd className="ml-8 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] dark:border-white/10 dark:bg-white/[0.06]">
                  Ctrl K
                </kbd>
              </button>
              <button
                type="button"
                className="relative grid size-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                aria-label="Notifications"
              >
                <Bell className="size-[18px]" aria-hidden="true" />
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-cyan-400 ring-2 ring-white dark:ring-[#080b10]" />
              </button>
              <Link
                href="/profile"
                className="ml-1 flex items-center gap-2 rounded-lg p-1.5 pr-2 transition hover:bg-slate-100 dark:hover:bg-white/[0.06]"
              >
                <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-300 to-cyan-500 text-xs font-bold text-slate-950">
                  {user.avatarInitials}
                </span>
                <span className="hidden text-left xl:block">
                  <span className="block text-xs font-semibold text-slate-900 dark:text-slate-100">{user.username}</span>
                  <span className="mt-0.5 block text-[10px] text-slate-500 dark:text-slate-500">Level {user.level}</span>
                </span>
              </Link>
              {user.isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="grid size-9 place-items-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-400/10 dark:hover:text-rose-300"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut className="size-[17px]" aria-hidden="true" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-cyan-700 dark:text-cyan-300"
                >
                  Login
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href={user.isAuthenticated ? "/dashboard" : "/login"}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-100"
              >
                Enter universe
                <Sparkles className="size-3.5" aria-hidden="true" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-700 md:hidden dark:border-white/10 dark:text-slate-200"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      {isOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white px-4 pb-5 pt-3 md:hidden dark:border-white/[0.08] dark:bg-[#0a0e14]"
        >
          <nav className="grid gap-1" aria-label="Mobile navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isCurrentPath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 ${
                    isActive
                      ? "bg-cyan-50 text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-200"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <Icon className="size-[18px]" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-500">{item.description}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
          {!isWorkspace && (
            <Link
              href={user.isAuthenticated ? "/dashboard" : "/login"}
              onClick={() => setIsOpen(false)}
              className="mt-3 flex h-11 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white dark:bg-cyan-400 dark:text-slate-950"
            >
              Enter universe
            </Link>
          )}
          {isWorkspace ? (
            user.isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                  router.push("/");
                }}
                className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-rose-200 text-sm font-semibold text-rose-600 dark:border-rose-400/20 dark:text-rose-300"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="mt-3 flex h-11 items-center justify-center rounded-xl bg-cyan-400 text-sm font-semibold text-slate-950"
              >
                Login
              </Link>
            )
          ) : null}
        </div>
      )}
    </header>
  );
}
