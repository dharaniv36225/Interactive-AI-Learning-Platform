"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  LabDefinition,
  Lesson,
  LoginInput,
  RecentActivity,
  User,
} from "@/types";

type CompletableLesson = Pick<
  Lesson,
  "id" | "title" | "durationMinutes" | "xpReward"
>;

const initialUser: User = {
  id: "demo-user",
  username: "Explorer",
  email: "",
  avatarInitials: "EX",
  role: "Learning Explorer",
  isAuthenticated: false,
  xp: 0,
  level: 1,
  learningStreak: 0,
  weeklyGoalMinutes: 300,
  weeklyStudyMinutes: 0,
  completedLessons: 0,
  completedLessonIds: [],
  completedLabIds: [],
  labActivities: [],
  tutorSessionCount: 0,
  lastActiveDate: "",
  joinedAt: "",
  recentActivity: [],
};

function getLevel(xp: number) {
  return Math.max(1, Math.floor(xp / 750) + 1);
}

function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getUpdatedStreak(user: User, timestamp: string) {
  const activityDate = new Date(timestamp);
  const today = getDateKey(activityDate);

  if (user.lastActiveDate === today) {
    return user.learningStreak;
  }

  const yesterday = new Date(activityDate);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  return user.lastActiveDate === getDateKey(yesterday) ? user.learningStreak + 1 : 1;
}

function withActivity(
  user: User,
  activity: RecentActivity,
  xpDelta = 0,
  studyMinutesDelta = 0,
): User {
  const xp = Math.max(0, user.xp + xpDelta);

  return {
    ...user,
    xp,
    level: getLevel(xp),
    learningStreak: getUpdatedStreak(user, activity.createdAt),
    lastActiveDate: getDateKey(new Date(activity.createdAt)),
    weeklyStudyMinutes: user.weeklyStudyMinutes + Math.max(0, studyMinutesDelta),
    recentActivity: [activity, ...user.recentActivity].slice(0, 20),
  };
}

type UserStore = {
  user: User;
  login: (input: LoginInput) => void;
  logout: () => void;
  addXp: (amount: number) => void;
  addStudyMinutes: (minutes: number) => void;
  completeLesson: (subjectName: string, lesson: CompletableLesson) => boolean;
  recordTutorQuestion: (question: string) => void;
  recordQuizActivity: (title: string, description: string, xp: number) => void;
  recordLabActivity: (
    lab: LabDefinition,
    subjectName: string,
  ) => { completed: boolean; xpEarned: number };
  setUsername: (username: string) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: initialUser,
      login: (input) =>
        set((state) => {
          const now = new Date().toISOString();
          const username = input.username.trim();
          const email = input.email.trim();
          const avatarInitials = input.avatarInitials.trim().toUpperCase().slice(0, 3);
          const joinedAt = state.user.joinedAt || now;
          const baseUser: User = {
            ...state.user,
            username,
            email,
            avatarInitials,
            isAuthenticated: true,
            joinedAt,
          };

          return {
            user: withActivity(baseUser, {
              id: `activity-login-${Date.now()}`,
              type: "account",
              title: "Signed in",
              description: `Welcome back, ${username}.`,
              xp: 0,
              createdAt: now,
            }),
          };
        }),
      logout: () =>
        set((state) => ({
          user: {
            ...state.user,
            isAuthenticated: false,
          },
        })),
      addXp: (amount) =>
        set((state) => {
          const xp = Math.max(0, state.user.xp + amount);
          return { user: { ...state.user, xp, level: getLevel(xp) } };
        }),
      addStudyMinutes: (minutes) =>
        set((state) => ({
          user: {
            ...state.user,
            weeklyStudyMinutes: state.user.weeklyStudyMinutes + Math.max(0, minutes),
          },
        })),
      completeLesson: (subjectName, lesson) => {
        const user = get().user;

        if (user.completedLessonIds.includes(lesson.id)) {
          return false;
        }

        const now = new Date().toISOString();
        const updatedUser = withActivity(
          {
            ...user,
            completedLessonIds: [...user.completedLessonIds, lesson.id],
            completedLessons: user.completedLessonIds.length + 1,
          },
          {
            id: `activity-lesson-${lesson.id}-${Date.now()}`,
            type: "lesson",
            title: lesson.title,
            description: `Completed ${subjectName}: ${lesson.title}.`,
            xp: lesson.xpReward,
            createdAt: now,
          },
          lesson.xpReward,
          lesson.durationMinutes,
        );

        set({ user: updatedUser });
        return true;
      },
      recordTutorQuestion: (question) =>
        set((state) => {
          const now = new Date().toISOString();
          const title = question.trim().replace(/\s+/g, " ").slice(0, 54);
          const user = {
            ...state.user,
            tutorSessionCount: state.user.tutorSessionCount + 1,
          };

          return {
            user: withActivity(
              user,
              {
                id: `activity-tutor-${Date.now()}`,
                type: "tutor",
                title: "Asked AI Tutor",
                description: title,
                xp: 10,
                createdAt: now,
              },
              10,
            ),
          };
        }),
      recordQuizActivity: (title, description, xp) =>
        set((state) => ({
          user: withActivity(
            state.user,
            {
              id: `activity-quiz-${Date.now()}`,
              type: "quiz",
              title,
              description,
              xp,
              createdAt: new Date().toISOString(),
            },
            xp,
          ),
        })),
      recordLabActivity: (lab, subjectName) => {
        const user = get().user;
        const completed = user.completedLabIds.includes(lab.id);
        const xpEarned = completed ? 0 : lab.xpReward;
        const now = new Date().toISOString();

        set({
          user: withActivity(
            {
              ...user,
              completedLabIds: completed
                ? user.completedLabIds
                : [...user.completedLabIds, lab.id],
              labActivities: [
                {
                  id: `lab-activity-${Date.now()}`,
                  labId: lab.id,
                  labTitle: lab.title,
                  subjectName,
                  xpEarned,
                  completedAt: now,
                },
                ...user.labActivities,
              ].slice(0, 50),
            },
            {
              id: `activity-lab-${Date.now()}`,
              type: "lab",
              title: lab.title,
              description: `Ran ${subjectName}: ${lab.title}.`,
              xp: xpEarned,
              createdAt: now,
            },
            xpEarned,
            5,
          ),
        });

        return { completed: !completed, xpEarned };
      },
      setUsername: (username) =>
        set((state) => ({
          user: {
            ...state.user,
            username: username.trim() || state.user.username,
          },
        })),
    }),
    {
      name: "ai-physics-user-store",
      skipHydration: true,
      version: 3,
      migrate: () => ({ user: initialUser }),
      merge: (persistedState, currentState) => {
        const stored = persistedState as Partial<UserStore>;

        return {
          ...currentState,
          ...stored,
          user: {
            ...currentState.user,
            ...stored.user,
          },
        };
      },
    },
  ),
);
