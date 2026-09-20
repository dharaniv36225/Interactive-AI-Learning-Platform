import {
  BarChart3,
  BookMarked,
  BookOpenText,
  Code2,
  FlaskConical,
  GraduationCap,
  Home,
  LibraryBig,
  Settings,
  Trophy,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const primaryNavigation: NavigationItem[] = [
  { href: "/", label: "Home", description: "Product overview", icon: Home },
  { href: "/university", label: "B.Tech University", description: "Four-year curriculum", icon: GraduationCap },
  { href: "/subjects", label: "Subjects", description: "Explore every field", icon: LibraryBig },
  { href: "/tutor", label: "AI Tutor", description: "Learn with guidance", icon: BookOpenText },
  { href: "/lab", label: "Labs", description: "Interactive simulations", icon: FlaskConical },
  { href: "/quiz", label: "Quiz", description: "Test your mastery", icon: Trophy },
];

export const workspaceNavigation: NavigationItem[] = [
  { href: "/dashboard", label: "Dashboard", description: "Progress and insights", icon: BarChart3 },
  { href: "/university", label: "B.Tech University", description: "Year and semester paths", icon: GraduationCap },
  { href: "/subjects", label: "Subjects", description: "Explore every field", icon: LibraryBig },
  { href: "/lessons", label: "Lessons", description: "Browse every subject", icon: BookMarked },
  { href: "/lab", label: "Interactive Labs", description: "Multi-subject simulations", icon: FlaskConical },
  { href: "/coding-practice", label: "Coding Practice", description: "Problems and AI review", icon: Code2 },
  { href: "/quiz", label: "Quiz Arena", description: "Test your mastery", icon: Trophy },
  { href: "/tutor", label: "AI Tutor", description: "Learn with guidance", icon: BookOpenText },
  { href: "/profile", label: "Profile", description: "Identity and awards", icon: UserRound },
  { href: "/settings", label: "Settings", description: "App preferences", icon: Settings },
];
