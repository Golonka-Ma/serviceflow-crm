"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Briefcase,
  Settings,
  Sun,
  Moon,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppContext } from "@/context/AppContext";
import { useSessionContext } from "@/components/auth/SessionProvider";
import LogoCollapsed from "../../../public/Logo.svg";
import LogoExpanded from "../../../public/Logo-text-gear-black.svg";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navigation: NavItem[] = [
  { name: "Pulpit", href: "/dashboard", icon: Home },
  { name: "Klienci", href: "/clients", icon: Users },
  { name: "Zlecenia", href: "/jobs", icon: Briefcase },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { darkMode, setDarkMode, sidebarOpen, toggleSidebar } = useAppContext();
  const { user } = useSessionContext();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    // Only close if sidebar is open and we're on mobile
    if (sidebarOpen && window.innerWidth < 768) {
      toggleSidebar();
    }
  }, [pathname]); // Remove sidebarOpen and toggleSidebar from dependencies

  // Theme toggle function with localStorage persistence
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    // Save preference to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("theme-preference", newMode ? "dark" : "light");
    }
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive =
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href));
    return (
      <Link
        href={item.href}
        className={cn(
          "group/navitem relative flex h-12 items-center gap-x-3 overflow-hidden rounded-md px-3 text-sm font-medium leading-6",
          "text-base-content/70 hover:bg-base-200/80 hover:text-base-content dark:hover:bg-base-300/80",
          isActive && "bg-primary/10 text-primary dark:bg-primary/20"
        )}
      >
        {isActive && (
          <span className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-full"></span>
        )}
        <item.icon
          className={cn(
            "h-6 w-6 shrink-0",
            isActive
              ? "text-primary"
              : "text-base-content/50 group-hover/navitem:text-base-content"
          )}
          aria-hidden="true"
        />
        <span className="min-w-0 whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/sidebar:opacity-100">
          {item.name}
        </span>
      </Link>
    );
  };

  const ThemeSwitcherVertical = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={cn(
        "flex flex-col items-center p-1 rounded-full bg-base-300/80 dark:bg-base-content/10",
        mobile ? "w-auto" : "w-10"
      )}
    >
      <button
        onClick={() => !darkMode && toggleTheme()}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition-colors mb-1",
          !darkMode
            ? "bg-white text-yellow-500 shadow-sm"
            : "bg-transparent text-base-content/60 hover:text-base-content/90"
        )}
        aria-label="Przełącz na jasny motyw"
        aria-pressed={!darkMode}
      >
        <Sun className="h-5 w-5" />
      </button>
      <button
        onClick={() => darkMode && toggleTheme()}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
          darkMode
            ? "bg-primary/20 text-primary shadow-sm dark:bg-primary/30"
            : "bg-transparent text-base-content/60 hover:text-base-content/90"
        )}
        aria-label="Przełącz na ciemny motyw"
        aria-pressed={darkMode}
      >
        <Moon className="h-5 w-5" />
      </button>
    </div>
  );

  return (
    <>
      <div
        className={cn(
          "group/sidebar fixed inset-y-0 left-0 z-40 hidden w-16 flex-col border-r border-base-300 bg-base-100 text-base-content transition-all duration-300 ease-in-out hover:w-64 dark:border-base-content/10 dark:bg-base-200 md:flex",
          "overflow-hidden",
          className
        )}
      >
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-base-300 px-4 dark:border-base-content/10",
            "relative justify-center"
          )}
        >
          <Link
            href="/dashboard"
            className="block h-10 w-10 group-hover/sidebar:hidden"
          >
            <Image src={LogoCollapsed} alt="Logo" width={40} height={40} />
          </Link>
          <Link
            href="/dashboard"
            className="absolute left-0 top-0 flex h-16 w-64 items-center justify-start px-4 opacity-0 transition-opacity duration-200 group-hover/sidebar:opacity-100"
          >
            <Image
              src={LogoExpanded}
              alt="Prismify Logo"
              width={140}
              height={40}
              className="dark:invert"
            />
          </Link>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto px-2 py-4">
          <ul role="list" className="flex flex-1 flex-col gap-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink item={item} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto border-t border-base-300 p-2 dark:border-base-content/10">
          <div className="flex items-center justify-center p-2">
            <ThemeSwitcherVertical />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-[100] w-64 md:hidden bg-base-100 dark:bg-base-100",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "transition-transform duration-300 ease-in-out"
        )}
        style={{
          backgroundColor: "var(--b1, #ffffff)",
          color: "var(--bc, #1f2937)",
        }}
      >
        <div className="flex h-full w-full flex-col border-r border-base-300 dark:border-base-content/10">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-base-300 px-4 dark:border-base-content/10">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src={LogoExpanded}
                alt="Prismify Logo"
                width={140}
                height={40}
                className="dark:invert"
              />
            </Link>
            <Button
              variant="ghost"
              onClick={toggleSidebar}
              className="h-10 w-10 p-0"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Zamknij menu</span>
            </Button>
          </div>

          <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={toggleSidebar}
                      className={cn(
                        "relative flex items-center gap-x-3 rounded-md p-3 text-sm font-medium",
                        isActive
                          ? "bg-primary/10 text-primary dark:bg-primary/20"
                          : "text-base-content/80 hover:bg-base-200/80 hover:text-base-content"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-full"></span>
                      )}
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          isActive ? "text-primary" : "text-base-content/60"
                        )}
                      />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto border-t border-base-300 p-4 dark:border-base-content/10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-base-200/50 dark:bg-base-300/50">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-primary/10">
                  {user?.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata.full_name || user.email || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-primary">
                      {user?.user_metadata?.full_name?.[0]?.toUpperCase() ||
                        user?.email?.[0]?.toUpperCase() ||
                        "U"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-base-content">
                    {user?.user_metadata?.full_name || "Użytkownik"}
                  </p>
                  <p className="truncate text-xs text-base-content/70">
                    {user?.email || "brak@email.com"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/70">
                  Wygląd aplikacji
                </span>
                <ThemeSwitcherVertical mobile={true} />
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-base-content/70 hover:text-base-content"
                onClick={() => {
                  // TODO: Implement logout
                  console.log("Logout clicked");
                }}
              >
                <LogOut className="h-5 w-5" />
                <span>Wyloguj się</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-[99] bg-black/50 transition-opacity md:hidden",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => {
          console.log("Overlay clicked");
          toggleSidebar();
        }}
        aria-hidden="true"
      />
    </>
  );
}
