import Link from "next/link";
import { Atom } from "lucide-react";

type BrandLogoProps = {
  compact?: boolean;
  inverse?: boolean;
};

export function BrandLogo({ compact = false, inverse = false }: BrandLogoProps) {
  return (
    <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="Interactive AI Learning Universe home">
      <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-cyan-500 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.22)]">
        <span className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
        <Atom className="relative size-5 transition-transform duration-500 group-hover:rotate-90" aria-hidden="true" />
      </span>
      {!compact && (
        <span className="min-w-0 leading-none">
          <span
            className={`block truncate text-[15px] font-bold tracking-[-0.02em] ${
              inverse ? "text-white" : "text-slate-950 dark:text-white"
            }`}
          >
            Interactive AI
          </span>
          <span
            className={`mt-1 block truncate text-[10px] font-semibold uppercase tracking-[0.22em] ${
              inverse ? "text-slate-400" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            Learning Universe
          </span>
        </span>
      )}
    </Link>
  );
}
