"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BellRing,
  Settings,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Klienci", icon: Users },
  { href: "/jobs", label: "Zlecenia", icon: Briefcase },
  { href: "/reminders", label: "Przypomnienia", icon: BellRing },
  { href: "/settings", label: "Ustawienia", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppContext();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Close button for mobile */}
      <button
        onClick={toggleSidebar}
        className="absolute right-4 top-4 text-gray-500 lg:hidden"
        aria-label="Close sidebar"
      >
        <X size={24} />
      </button>

      {/* Navigation */}
      <nav className="mt-16 lg:mt-5 px-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
              >
                <Icon
                  size={20}
                  className={`mr-3 ${
                    isActive ? "text-indigo-600" : "text-gray-400"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
