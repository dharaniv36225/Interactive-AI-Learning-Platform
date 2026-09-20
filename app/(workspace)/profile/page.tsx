"use client";

import { useRouter } from "next/navigation";
import {
  Award,
  BookOpenText,
  CalendarDays,
  Flame,
  FlaskConical,
  LockKeyhole,
  LogOut,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { AuthGate } from "@/components/auth-gate";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { formatNumber } from "@/lib/format";
import { useQuizStore } from "@/stores/quizStore";
import { useUserStore } from "@/stores/userStore";
import type { Achievement, AchievementTier } from "@/types";

const tierStyles: Record<AchievementTier, string> = {
  bronze:
    "bg-orange-50 text-orange-700 dark:bg-orange-400/10 dark:text-orange-300",
  silver:
    "bg-slate-100 text-slate-600 dark:bg-slate-400/10 dark:text-slate-300",
  gold: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  platinum:
    "bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300",
};

function formatMemberSince(timestamp: string) {
  if (!timestamp) {
    return "Today";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(new Date(timestamp));
}

function formatQuizDate(timestamp: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp));
}

export default function ProfilePage() {
  useEffect(() => {
    void useQuizStore.persist.rehydrate();
  }, []);

  const router = useRouter();
  const user = useUserStore(useShallow((state) => state.user));
  const logout = useUserStore((state) => state.logout);
  const attempts = useQuizStore((state) => state.attempts);
  const levelFloor = (user.level - 1) * 750;
  const levelProgress = Math.min(
    100,
    Math.round(((user.xp - levelFloor) / 750) * 100),
  );
  const nextLevelXp = user.level * 750;
  const hasPerfectQuiz = attempts.some(
    (attempt) => attempt.score === attempt.totalQuestions,
  );
  const achievements: Achievement[] = [
    {
      id: "first-lesson",
      title: "First Step",
      description: "Complete your first lesson.",
      tier: "bronze",
      progress: Math.min(100, user.completedLessons * 100),
      unlocked: user.completedLessons >= 1,
    },
    {
      id: "quiz-starter",
      title: "Quiz Starter",
      description: "Complete your first quiz attempt.",
      tier: "bronze",
      progress: Math.min(100, attempts.length * 100),
      unlocked: attempts.length >= 1,
    },
    {
      id: "perfect-score",
      title: "Perfect Recall",
      description: "Earn a perfect score in any quiz.",
      tier: "gold",
      progress: hasPerfectQuiz ? 100 : 0,
      unlocked: hasPerfectQuiz,
    },
    {
      id: "curious-mind",
      title: "Curious Mind",
      description: "Ask the AI Tutor five questions.",
      tier: "silver",
      progress: Math.min(100, (user.tutorSessionCount / 5) * 100),
      unlocked: user.tutorSessionCount >= 5,
    },
    {
      id: "week-streak",
      title: "Seven Day Spark",
      description: "Reach a seven-day learning streak.",
      tier: "gold",
      progress: Math.min(100, (user.learningStreak / 7) * 100),
      unlocked: user.learningStreak >= 7,
    },
    {
      id: "lesson-scholar",
      title: "Lesson Scholar",
      description: "Complete ten lessons.",
      tier: "platinum",
      progress: Math.min(100, (user.completedLessons / 10) * 100),
      unlocked: user.completedLessons >= 10,
    },
    {
      id: "lab-explorer",
      title: "Lab Explorer",
      description: "Complete five different interactive labs.",
      tier: "silver",
      progress: Math.min(100, (user.completedLabIds.length / 5) * 100),
      unlocked: user.completedLabIds.length >= 5,
    },
  ];

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <AuthGate
      title="Login to view your profile"
      description="Your local profile combines identity, XP, lessons, quiz history, and achievements from this browser."
    >
      <div className="space-y-7">
        <PageHeader
          eyebrow="Explorer profile"
          title="Your learning identity"
          description="Progress, milestones, and achievements calculated from your saved work."
          actions={
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-400/20 dark:text-rose-300 dark:hover:bg-rose-400/10"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Logout
            </button>
          }
        />

        <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] sm:p-8">
          <div className="absolute right-0 top-0 h-full w-2/5 bg-[radial-gradient(circle_at_80%_25%,rgba(34,211,238,0.12),transparent_50%)]" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative">
              <span className="grid size-24 place-items-center rounded-[24px] bg-gradient-to-br from-cyan-300 via-cyan-400 to-violet-500 text-2xl font-bold text-slate-950 shadow-[0_16px_40px_rgba(34,211,238,0.18)]">
                {user.avatarInitials}
              </span>
              <span className="absolute -bottom-2 -right-2 grid size-8 place-items-center rounded-xl border-4 border-white bg-slate-950 text-[10px] font-bold text-white dark:border-[#0e131b] dark:bg-white dark:text-slate-950">
                {user.level}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-[-0.035em] text-slate-950 dark:text-white">
                    {user.username}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-cyan-700 dark:text-cyan-400">
                    {user.role}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">{user.email}</p>
                </div>
                <div className="inline-flex items-center gap-2 text-xs text-slate-500">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  Member since {formatMemberSince(user.joinedAt)}
                </div>
              </div>
              <div className="mt-6 max-w-xl">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    Level {user.level} progress
                  </span>
                  <span className="font-bold text-slate-950 dark:text-white">
                    {formatNumber(user.xp)} / {formatNumber(nextLevelXp)} XP
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.07]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Lifetime XP"
            value={formatNumber(user.xp)}
            detail="from saved activities"
            icon={Sparkles}
            tone="cyan"
          />
          <StatCard
            label="Current level"
            value={String(user.level)}
            detail={`${levelProgress}% to next level`}
            icon={Zap}
            tone="violet"
          />
          <StatCard
            label="Learning streak"
            value={`${user.learningStreak} days`}
            detail="based on activity dates"
            icon={Flame}
            tone="amber"
          />
          <StatCard
            label="Learning activity"
            value={String(user.completedLessons)}
            detail={`${user.completedLabIds.length} labs · ${attempts.length} quizzes`}
            icon={BookOpenText}
            tone="emerald"
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-950 dark:text-white">
                  Lesson history
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Latest completed smart lessons
                </p>
              </div>
              <BookOpenText
                className="size-5 text-cyan-500"
                aria-hidden="true"
              />
            </div>
            {user.recentActivity.some(
              (activity) => activity.type === "lesson",
            ) ? (
              <div className="mt-5 grid gap-3">
                {user.recentActivity
                  .filter((activity) => activity.type === "lesson")
                  .slice(0, 6)
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/[0.07] dark:bg-white/[0.025]"
                    >
                      <p className="text-xs font-bold text-slate-950 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        {activity.description} · +{activity.xp} XP
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="mt-6 rounded-xl border border-dashed border-slate-300 p-7 text-center text-xs text-slate-500 dark:border-white/[0.12]">
                Completed lessons will appear here.
              </p>
            )}
          </article>

          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-950 dark:text-white">
                  Lab history
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Latest saved experiments
                </p>
              </div>
              <FlaskConical
                className="size-5 text-violet-500"
                aria-hidden="true"
              />
            </div>
            {user.labActivities.length > 0 ? (
              <div className="mt-5 grid gap-3">
                {user.labActivities.slice(0, 6).map((activity) => (
                  <div
                    key={activity.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/[0.07] dark:bg-white/[0.025]"
                  >
                    <p className="text-xs font-bold text-slate-950 dark:text-white">
                      {activity.labTitle}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      {activity.subjectName} · +{activity.xpEarned} XP ·{" "}
                      {formatQuizDate(activity.completedAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-xl border border-dashed border-slate-300 p-7 text-center text-xs text-slate-500 dark:border-white/[0.12]">
                Run an interactive lab to begin your lab history.
              </p>
            )}
          </article>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-950 dark:text-white">
                Achievements
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Milestones unlocked by real progress
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {achievements.filter((item) => item.unlocked).length}/
              {achievements.length} unlocked
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {achievements.map((achievement, index) => {
              const Icon = achievement.unlocked
                ? [Award, Trophy, Flame][index % 3]
                : LockKeyhole;

              return (
                <article
                  key={achievement.id}
                  className={`relative rounded-2xl border p-5 ${
                    achievement.unlocked
                      ? "border-slate-200 bg-slate-50 dark:border-white/[0.07] dark:bg-white/[0.025]"
                      : "border-dashed border-slate-200 bg-slate-50/60 dark:border-white/[0.07] dark:bg-transparent"
                  }`}
                >
                  <span
                    className={`grid size-10 place-items-center rounded-xl ${
                      achievement.unlocked
                        ? tierStyles[achievement.tier]
                        : "bg-slate-100 text-slate-400 dark:bg-white/[0.05] dark:text-slate-600"
                    }`}
                  >
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-sm font-bold text-slate-950 dark:text-white">
                    {achievement.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {achievement.description}
                  </p>
                  <div className="mt-4">
                    <div className="h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/[0.07]">
                      <div
                        className="h-full rounded-full bg-cyan-500"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      {achievement.unlocked
                        ? `${achievement.tier} unlocked`
                        : `${Math.round(achievement.progress)}% complete`}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] sm:p-6">
          <div>
            <h2 className="text-sm font-bold text-slate-950 dark:text-white">
              Quiz history
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Your latest completed attempts
            </p>
          </div>
          {attempts.length > 0 ? (
            <div className="mt-5 grid gap-3">
              {attempts.slice(0, 8).map((attempt) => (
                <article
                  key={attempt.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/[0.07] dark:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-950 dark:text-white">
                      {attempt.subject}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      {attempt.lesson} · {formatQuizDate(attempt.completedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="capitalize text-slate-500">
                      {attempt.difficulty}
                    </span>
                    <span className="font-bold text-cyan-700 dark:text-cyan-400">
                      {attempt.score}/{attempt.totalQuestions}
                    </span>
                    <span className="font-bold">
                      {Math.round(
                        (attempt.score / attempt.totalQuestions) * 100,
                      )}
                      %
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-white/[0.12]">
              <Trophy
                className="mx-auto size-5 text-slate-400"
                aria-hidden="true"
              />
              <p className="mt-3 text-xs font-semibold text-slate-500">
                Quiz attempts will appear here after completion.
              </p>
            </div>
          )}
        </section>
      </div>
    </AuthGate>
  );
}
