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
  const { sidebarOpen, setSidebarOpen } = useAppContext();

  return (
    <aside className="w-64 bg-white shadow-sm">
      <nav className="mt-5 px-2">
        <div className="space-y-1">{/* Add navigation items here */}</div>
      </nav>
    </aside>
  );
}
