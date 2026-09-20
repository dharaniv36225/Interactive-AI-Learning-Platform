"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Atom,
  BrainCircuit,
  Check,
  FlaskConical,
  Gauge,
  LineChart,
  Orbit,
  Play,
  Sigma,
  Sparkles,
  Trophy,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Navbar } from "@/components/navbar";
import { useUserStore } from "@/stores/userStore";

const features = [
  {
    title: "A tutor that teaches your way",
    description: "Ask questions in plain language and get adaptive explanations, hints, and conceptual checks.",
    icon: BrainCircuit,
    accent: "cyan",
  },
  {
    title: "Build intuition in every lab",
    description: "Change variables across science, computing, finance, and agriculture, then observe systems in real time.",
    icon: FlaskConical,
    accent: "violet",
  },
  {
    title: "Practice with purpose",
    description: "Subject-wise quizzes turn every answer into feedback and keep practice aligned to your learning path.",
    icon: Trophy,
    accent: "amber",
  },
  {
    title: "See mastery take shape",
    description: "Track momentum, accuracy, topic mastery, study time, and the next action worth taking.",
    icon: LineChart,
    accent: "emerald",
  },
];

const topics = [
  { label: "Science", icon: Atom },
  { label: "Mathematics", icon: Sigma },
  { label: "AI & ML", icon: BrainCircuit },
  { label: "Robotics", icon: Orbit },
  { label: "Finance & Agriculture", icon: Sparkles },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

function PhysicsBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(34,211,238,0.13),transparent_29%),radial-gradient(circle_at_18%_48%,rgba(139,92,246,0.08),transparent_25%)] dark:bg-[radial-gradient(circle_at_72%_24%,rgba(34,211,238,0.13),transparent_26%),radial-gradient(circle_at_20%_48%,rgba(139,92,246,0.09),transparent_22%)]" />
      <div className="physics-grid absolute inset-0 opacity-70" />
      <div className="noise-overlay absolute inset-0 opacity-[0.025] dark:opacity-[0.04]" />
      <motion.div
        className="absolute right-[8%] top-[18%] size-[420px] rounded-full border border-cyan-500/15 sm:size-[540px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute right-[12%] top-[25%] h-[290px] w-[470px] rounded-[50%] border border-violet-500/15 sm:h-[350px] sm:w-[600px]"
        animate={{ rotate: -360 }}
        transition={{ duration: 58, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

function UniversePreview() {
  return (
    <motion.div
      className="relative mx-auto w-full max-w-[520px]"
      initial={{ opacity: 0, scale: 0.96, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.7 }}
    >
      <div className="absolute -inset-12 rounded-full bg-cyan-400/[0.08] blur-3xl" />
      <div className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/75 p-3 shadow-[0_28px_90px_rgba(15,23,42,0.16)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0d131c]/80 dark:shadow-[0_28px_100px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex gap-1.5">
            <span className="size-2 rounded-full bg-rose-400/70" />
            <span className="size-2 rounded-full bg-amber-400/70" />
            <span className="size-2 rounded-full bg-emerald-400/70" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Live simulation</span>
          <span className="size-5 rounded-md bg-slate-100 dark:bg-white/[0.06]" />
        </div>

        <div className="relative h-[330px] overflow-hidden rounded-[20px] bg-slate-950 sm:h-[390px]">
          <div className="physics-grid absolute inset-0 opacity-30" />
          <div className="absolute inset-x-5 top-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">Orbital mechanics</p>
              <p className="mt-1 text-xs text-slate-500">Earth-Moon system</p>
            </div>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-bold text-emerald-300">
              STABLE
            </span>
          </div>

          <div className="absolute left-1/2 top-[54%] size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/15 sm:size-48" />
          <div className="absolute left-1/2 top-[54%] h-24 w-64 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-violet-400/25 sm:h-28 sm:w-80" />
          <div className="absolute left-1/2 top-[54%] grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#67e8f9,#155e75_65%,#083344)] shadow-[0_0_55px_rgba(34,211,238,0.28)]">
            <Orbit className="size-8 text-cyan-100/80" aria-hidden="true" />
          </div>
          <motion.div
            className="absolute left-1/2 top-[54%] size-3 rounded-full bg-violet-200 shadow-[0_0_18px_rgba(196,181,253,0.9)]"
            animate={{
              x: [-150, 0, 150, 0, -150],
              y: [0, -54, 0, 54, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
            {[
              { label: "Velocity", value: "1.02 km/s" },
              { label: "Radius", value: "384,400 km" },
              { label: "Period", value: "27.3 days" },
            ].map((metric) => (
              <div key={metric.label} className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-2.5">
                <p className="text-[8px] uppercase tracking-wider text-slate-600">{metric.label}</p>
                <p className="mt-1 text-[10px] font-semibold text-slate-200 sm:text-xs">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        className="absolute -left-4 top-24 hidden w-36 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-xl backdrop-blur sm:block dark:border-white/10 dark:bg-[#111822]/90"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
            <Sigma className="size-3.5" />
          </span>
          <span className="text-[10px] font-semibold text-slate-500">Energy conserved</span>
        </div>
        <p className="mt-2 font-mono text-xs font-bold text-slate-900 dark:text-white">E = K + U</p>
      </motion.div>

      <motion.div
        className="absolute -right-3 bottom-20 hidden w-40 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-xl backdrop-blur sm:block dark:border-white/10 dark:bg-[#111822]/90"
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
            <Gauge className="size-3.5" />
          </span>
          <span className="text-[10px] font-semibold text-slate-500">Mastery update</span>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <span className="text-lg font-bold text-slate-950 dark:text-white">86%</span>
          <span className="text-[9px] font-bold text-emerald-500">+4.2%</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function LandingPage() {
  const isAuthenticated = useUserStore((state) => state.user.isAuthenticated);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#080b10]">
      <Navbar />
      <main>
        <section className="relative min-h-[calc(100vh-68px)] overflow-hidden">
          <PhysicsBackground />
          <div className="relative mx-auto grid min-h-[calc(100vh-68px)] max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
            <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-cyan-800 dark:border-cyan-400/20 dark:bg-cyan-400/[0.08] dark:text-cyan-300"
              >
                <Sparkles className="size-3" aria-hidden="true" />
                Learn anything, interactively
              </motion.div>
              <motion.h1
                variants={fadeUp}
                className="text-balance mt-6 max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.055em] text-slate-950 dark:text-white sm:text-6xl lg:text-[72px]"
              >
                Learn anything.
                <span className="block bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-500 bg-clip-text text-transparent">
                  Build it into understanding.
                </span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg sm:leading-8"
              >
                Learn Anything Through AI, Interactive Labs, Smart Lessons and Quizzes.
                One connected flow turns curiosity into measurable progress.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/subjects"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-cyan-400 dark:text-slate-950 dark:shadow-cyan-400/10 dark:hover:bg-cyan-300"
                >
                  Explore subjects
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/lab"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-5 text-sm font-semibold text-slate-800 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.07]"
                >
                  <Play className="size-3.5 fill-current" aria-hidden="true" />
                  Explore a simulation
                </Link>
              </motion.div>
              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {["No credit card", "Personalized path", "Learn at your pace"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500">
                    <span className="grid size-4 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400">
                      <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />
                    </span>
                    {item}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            <UniversePreview />
          </div>
        </section>

        <section className="border-y border-slate-200/80 bg-white py-8 dark:border-white/[0.07] dark:bg-[#0a0e14]">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Explore the full curriculum</p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {topics.map((topic) => {
                const Icon = topic.icon;

                return (
                  <span
                    key={topic.label}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400"
                  >
                    <Icon className="size-3.5 text-slate-400 dark:text-slate-600" aria-hidden="true" />
                    {topic.label}
                  </span>
                );
              })}
            </div>
          </div>
        </section>

        <section id="features" className="bg-white py-24 dark:bg-[#0a0e14] sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-400">
                A complete learning system
              </p>
              <h2 className="text-balance mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl">
                From “I don&apos;t get it” to deep understanding.
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-400">
                Every tool shares context, so your next explanation, experiment, and challenge meets you exactly where
                you are.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const accentClasses = {
                  cyan: "bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300",
                  violet: "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
                  amber: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
                  emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
                }[feature.accent];

                return (
                  <motion.article
                    key={feature.title}
                    className="group relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-slate-50 p-7 transition-colors hover:bg-white dark:border-white/[0.08] dark:bg-white/[0.025] dark:hover:bg-white/[0.04] sm:p-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <span className={`grid size-11 place-items-center rounded-xl ${accentClasses}`}>
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-[10px] text-slate-300 dark:text-slate-700">0{index + 1}</span>
                    </div>
                    <h3 className="mt-8 text-xl font-bold tracking-[-0.025em] text-slate-950 dark:text-white">{feature.title}</h3>
                    <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">{feature.description}</p>
                    <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      See how it works
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-slate-950 py-24 text-white dark:bg-[#070a0e]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.16),transparent_40%)]" />
          <div className="physics-grid absolute inset-0 opacity-30" />
          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <h2 className="text-balance mt-6 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              The universe is complicated.
              <span className="block text-slate-400">Learning it shouldn&apos;t be.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400">
              Start with one question. Leave with a clearer model, measurable progress, and a reason to stay curious.
            </p>
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              Enter the Learning Universe
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-10 dark:border-white/[0.07] dark:bg-[#080b10]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <BrandLogo />
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
            <Link href="/tutor" className="transition hover:text-slate-950 dark:hover:text-white">
              AI Tutor
            </Link>
            <Link href="/lab" className="transition hover:text-slate-950 dark:hover:text-white">
              Simulations
            </Link>
            <Link href="/quiz" className="transition hover:text-slate-950 dark:hover:text-white">
              Quiz Arena
            </Link>
            <span>© 2026 Interactive AI Learning Universe</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
