import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 border-b border-slate-200/80 pb-6 dark:border-white/[0.08] md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-400">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.035em] text-slate-950 dark:text-white sm:text-[34px]">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      {actions}
    </div>
  );
}
