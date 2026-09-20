"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect } from "react";
import {
  Award,
  BookOpenCheck,
  BrainCircuit,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Code2,
  Flame,
  Gauge,
  GitBranch,
  History,
  FlaskConical,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { AuthGate } from "@/components/auth-gate";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { btechBranches } from "@/lib/btech-branches";
import { formatNumber } from "@/lib/format";
import { subjectsMeta } from "@/lib/subjects-meta";
import { useQuizStore } from "@/stores/quizStore";
import { useUserStore } from "@/stores/userStore";
import type { ActivityType } from "@/types";

const activityIcons: Record<ActivityType, typeof Sparkles> = {
  lesson: BookOpenCheck,
  quiz: Trophy,
  tutor: BrainCircuit,
  lab: Sparkles,
  account: CheckCircle2,
};

const SubjectProgressChart = dynamic(
  () =>
    import("@/components/subject-progress-chart").then(
      (module) => module.SubjectProgressChart,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 animate-pulse rounded-xl bg-slate-100 dark:bg-white/[0.04]" />
    ),
  },
);

function formatActivityTime(timestamp: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export default function DashboardPage() {
  useEffect(() => {
    void useQuizStore.persist.rehydrate();
  }, []);

  const {
    username,
    xp,
    level,
    learningStreak,
    weeklyGoalMinutes,
    weeklyStudyMinutes,
    completedLessons,
    completedLessonIds,
    recentActivity,
    tutorSessionCount,
    labActivityCount,
  } = useUserStore(
    useShallow((state) => ({
      username: state.user.username,
      xp: state.user.xp,
      level: state.user.level,
      learningStreak: state.user.learningStreak,
      weeklyGoalMinutes: state.user.weeklyGoalMinutes,
      weeklyStudyMinutes: state.user.weeklyStudyMinutes,
      completedLessons: state.user.completedLessons,
      completedLessonIds: state.user.completedLessonIds,
      recentActivity: state.user.recentActivity,
      tutorSessionCount: state.user.tutorSessionCount,
      labActivityCount: state.user.labActivities.length,
    })),
  );
  const attempts = useQuizStore((state) => state.attempts);
  const quizTotals = attempts.reduce(
    (totals, attempt) => ({
      score: totals.score + attempt.score,
      questions: totals.questions + attempt.totalQuestions,
    }),
    { score: 0, questions: 0 },
  );
  const quizAccuracy =
    quizTotals.questions === 0
      ? 0
      : Math.round((quizTotals.score / quizTotals.questions) * 100);
  const levelFloor = (level - 1) * 750;
  const levelProgress = Math.min(
    100,
    Math.round(((xp - levelFloor) / 750) * 100),
  );
  const weeklyGoalProgress = Math.min(
    100,
    Math.round(
      (weeklyStudyMinutes / Math.max(weeklyGoalMinutes, 1)) * 100,
    ),
  );
  const subjectProgress = subjectsMeta.map((subject) => {
    const completed = subject.lessonIds.filter((lessonId) =>
      completedLessonIds.includes(lessonId),
    ).length;

    return {
      subject:
        subject.name.length > 12
          ? subject.name
              .split(" ")
              .map((word) => word[0])
              .join("")
          : subject.name,
      progress: Math.round((completed / subject.lessonCount) * 100),
    };
  });
  const totalLessons = subjectsMeta.reduce(
    (total, subject) => total + subject.lessonCount,
    0,
  );
  const subjectMastery = Math.min(
    100,
    Math.round((completedLessonIds.length / Math.max(totalLessons, 1)) * 100),
  );
  const labProgress = Math.min(100, Math.round((labActivityCount / 24) * 100));
  const learningIq = Math.min(
    160,
    80 + level * 4 + Math.round(quizAccuracy / 3) + Math.round(subjectMastery / 4),
  );
  const careerReadiness = Math.round(
    (subjectMastery + quizAccuracy + labProgress + weeklyGoalProgress) / 4,
  );
  const codingRank =
    xp >= 7500
      ? "Expert"
      : xp >= 3750
        ? "Advanced"
        : xp >= 1500
          ? "Builder"
          : "Starter";
  const activitySignal =
    completedLessons + labActivityCount + attempts.length + tutorSessionCount;
  const branchProgress = btechBranches.slice(0, 6).map((branch, index) => ({
    ...branch,
    progress: Math.min(
      100,
      Math.round((activitySignal / Math.max(6 + index * 2, 1)) * 100),
    ),
  }));
  const recommendations = [
    quizAccuracy < 60
      ? "Review explanations after every quiz attempt before starting a new topic."
      : "Increase difficulty by mixing medium and hard quiz questions.",
    labActivityCount < 3
      ? "Run one animated lab today and write down which input changed the output most."
      : "Use AI Tutor to compare two completed labs and extract common formulas.",
    weeklyGoalProgress < 50
      ? "Choose one 30-minute lesson block to protect your weekly goal."
      : "Move into a capstone-style coding or lab challenge.",
  ];
  const achievements = [
    { label: "First lab", unlocked: labActivityCount > 0 },
    { label: "Quiz finisher", unlocked: attempts.length > 0 },
    { label: "AI explorer", unlocked: tutorSessionCount > 0 },
    { label: "Weekly builder", unlocked: weeklyGoalProgress >= 50 },
  ];

  return (
    <AuthGate
      title="Your dashboard is ready after login"
      description="Create a local learner profile to keep your lessons, quizzes, tutor sessions, XP, and streak in one place."
    >
      <div className="space-y-7">
        <PageHeader
          eyebrow="Command center"
          title={`Welcome back, ${username.split(" ")[0]}`}
          description="Everything below is calculated from your saved activity in this browser."
          actions={
            <Link
              href="/tutor"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
            >
              <BrainCircuit className="size-4" aria-hidden="true" />
              Ask AI Tutor
            </Link>
          }
        />

        <section
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
          aria-label="Learning analytics"
        >
          <StatCard
            label="Learning IQ"
            value={String(learningIq)}
            detail={`${formatNumber(xp)} XP signal`}
            icon={Sparkles}
            tone="cyan"
          />
          <StatCard
            label="Subject mastery"
            value={`${subjectMastery}%`}
            detail={`${completedLessons} completed lessons`}
            icon={BookOpenCheck}
            tone="violet"
          />
          <StatCard
            label="Coding rank"
            value={codingRank}
            detail={`${levelProgress}% to level ${level + 1}`}
            icon={Code2}
            tone="emerald"
          />
          <StatCard
            label="Quiz accuracy"
            value={`${quizAccuracy}%`}
            detail={`${attempts.length} completed attempts`}
            icon={Gauge}
            tone="amber"
          />
          <StatCard
            label="AI Tutor usage"
            value={String(tutorSessionCount)}
            detail="saved tutor sessions"
            icon={BrainCircuit}
            tone="cyan"
          />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
            <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
              <Flame className="size-[18px]" aria-hidden="true" />
            </span>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Learning streak
            </p>
            <p className="mt-2 text-2xl font-bold tracking-[-0.035em]">
              {learningStreak} days
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
            <span className="grid size-10 place-items-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
              <TrendingUp className="size-[18px]" aria-hidden="true" />
            </span>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Weekly growth
            </p>
            <p className="mt-2 text-2xl font-bold tracking-[-0.035em]">
              {weeklyGoalProgress}%
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
            <span className="grid size-10 place-items-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
              <FlaskConical className="size-[18px]" aria-hidden="true" />
            </span>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Lab progress
            </p>
            <p className="mt-2 text-2xl font-bold tracking-[-0.035em]">
              {labProgress}%
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
            <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
              <Award className="size-[18px]" aria-hidden="true" />
            </span>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Career readiness
            </p>
            <p className="mt-2 text-2xl font-bold tracking-[-0.035em]">
              {careerReadiness}%
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-950 dark:text-white">
                Subject progress
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Completed lessons across the full curriculum
              </p>
            </div>
            <Link
              href="/subjects"
              className="text-xs font-bold text-cyan-700 dark:text-cyan-400"
            >
              Explore subjects
            </Link>
          </div>
          <div className="mt-5">
            <SubjectProgressChart data={subjectProgress} />
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-950 dark:text-white">
                  Branch progress
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Activity-based readiness signals across major B.Tech tracks
                </p>
              </div>
              <GitBranch className="size-5 text-cyan-500" aria-hidden="true" />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {branchProgress.map((branch) => (
                <div
                  key={branch.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/[0.08] dark:bg-white/[0.025]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-950 dark:text-white">
                        {branch.shortName}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        {branch.careerTracks[0]}
                      </p>
                    </div>
                    <span className="text-sm font-black text-cyan-700 dark:text-cyan-300">
                      {branch.progress}%
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/[0.08]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
                      style={{ width: `${branch.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <div className="space-y-5">
            <article className="rounded-2xl border border-violet-200 bg-violet-50/70 p-5 dark:border-violet-400/20 dark:bg-violet-400/[0.06]">
              <div className="flex items-center gap-3">
                <Lightbulb className="size-5 text-violet-700 dark:text-violet-300" aria-hidden="true" />
                <h2 className="text-sm font-bold text-violet-950 dark:text-violet-100">
                  AI recommendations
                </h2>
              </div>
              <div className="mt-4 space-y-3">
                {recommendations.map((recommendation) => (
                  <p key={recommendation} className="rounded-xl bg-white px-3 py-2 text-xs leading-5 text-slate-600 dark:bg-white/[0.07] dark:text-slate-200">
                    {recommendation}
                  </p>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-400/20 dark:bg-amber-400/[0.06]">
              <div className="flex items-center gap-3">
                <CalendarCheck className="size-5 text-amber-700 dark:text-amber-300" aria-hidden="true" />
                <h2 className="text-sm font-bold text-amber-950 dark:text-amber-100">
                  Daily challenge
                </h2>
              </div>
              <p className="mt-3 text-xs leading-6 text-amber-900 dark:text-amber-100">
                Run one lab, answer five lesson-linked questions, and ask AI Tutor to explain the toughest mistake.
              </p>
            </article>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b] sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-950 dark:text-white">
                  Recent activity
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Your latest saved learning events
                </p>
              </div>
              <History className="size-5 text-slate-400" aria-hidden="true" />
            </div>

            {recentActivity.length > 0 ? (
              <div className="mt-5 divide-y divide-slate-100 dark:divide-white/[0.06]">
                {recentActivity.slice(0, 8).map((activity) => {
                  const Icon = activityIcons[activity.type];

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <p className="truncate text-xs font-bold text-slate-950 dark:text-white">
                            {activity.title}
                          </p>
                          <time
                            dateTime={activity.createdAt}
                            className="shrink-0 text-[9px] text-slate-400"
                          >
                            {formatActivityTime(activity.createdAt)}
                          </time>
                        </div>
                        <p className="mt-1 truncate text-[11px] text-slate-500">
                          {activity.description}
                        </p>
                      </div>
                      {activity.xp > 0 ? (
                        <span className="shrink-0 text-[10px] font-bold text-cyan-700 dark:text-cyan-400">
                          +{activity.xp} XP
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-white/[0.12]">
                <p className="text-xs font-semibold text-slate-500">
                  Complete a lesson, quiz, or tutor question to begin your
                  activity timeline.
                </p>
              </div>
            )}
          </article>

          <div className="space-y-5">
            <article className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
              <h2 className="text-sm font-bold text-slate-950 dark:text-white">
                Achievements
              </h2>
              <div className="mt-4 grid gap-2">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.label}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold ${
                      achievement.unlocked
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                        : "bg-slate-50 text-slate-400 dark:bg-white/[0.04]"
                    }`}
                  >
                    {achievement.label}
                    <span>{achievement.unlocked ? "Unlocked" : "Locked"}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200/80 bg-white p-5 surface-shadow dark:border-white/[0.08] dark:bg-[#0e131b]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-950 dark:text-white">
                    Weekly study goal
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Minutes recorded by lessons and labs
                  </p>
                </div>
                <Clock3 className="size-5 text-cyan-500" aria-hidden="true" />
              </div>
              <p className="mt-6 text-2xl font-bold tracking-[-0.035em]">
                {weeklyStudyMinutes}
                <span className="ml-1 text-xs font-medium text-slate-400">
                  / {weeklyGoalMinutes} min
                </span>
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.07]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
                  style={{ width: `${weeklyGoalProgress}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] text-slate-400">
                {weeklyGoalProgress}% complete
              </p>
            </article>

            <article className="rounded-2xl bg-slate-950 p-5 text-white dark:bg-gradient-to-br dark:from-[#121a25] dark:to-[#0b1017]">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                Continue learning
              </p>
              <h2 className="mt-4 text-xl font-bold tracking-[-0.025em]">
                Choose your next lesson
              </h2>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Browse twelve subjects and add the next completed lesson to your
                real progress totals.
              </p>
              <Link
                href="/lessons"
                className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-xl bg-white text-xs font-bold text-slate-950 transition hover:bg-cyan-100"
              >
                Open lessons
              </Link>
            </article>
          </div>
        </section>
      </div>
    </AuthGate>
  );
}
