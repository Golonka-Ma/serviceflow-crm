"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/AppContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarOpen, toggleSidebar } = useAppContext();

  return (
    <div className="flex min-h-screen flex-col bg-base-200/50 dark:bg-base-300">
      {/* Header - Full width */}
      <Header />

      {/* Main content wrapper */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Sidebar - hover behavior managed internally, marked as peer */}
        <Sidebar className="peer/sidebar" />

        {/* Main content - padding adjusts based on sidebar hover */}
        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 transition-all duration-300 sm:p-6 lg:p-8",
            "md:ml-16 peer-hover/sidebar:md:ml-64"
          )}
        >
          {children}
        </main>

        {/* Mobile overlay - added touch-action-none to prevent scroll while open */}
        <div
          className={cn(
            "fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden",
            sidebarOpen
              ? "opacity-100 touch-none"
              : "pointer-events-none opacity-0"
          )}
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
