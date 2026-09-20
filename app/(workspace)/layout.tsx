"use client";

import type { ReactNode } from "react";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

type WorkspaceLayoutProps = {
  children: ReactNode;
};

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-[#080b10]">
      <Navbar variant="workspace" />
      <div className="mx-auto flex w-full max-w-[1600px]">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 xl:px-10 xl:py-9">
          {children}
        </main>
      </div>
    </div>
  );
}
