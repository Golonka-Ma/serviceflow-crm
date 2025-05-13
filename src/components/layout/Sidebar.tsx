"use client";

import React, { useEffect, memo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  HelpCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppContext } from "@/context/AppContext";
import { useSessionContext } from "@/components/auth/SessionProvider";
import LogoCollapsed from "../../../public/Logo.svg";
import LogoExpanded from "../../../public/Logo-text-gear-black.svg";
import { useSupabaseClient } from "@/context/SupabaseProvider";

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

// Memoize NavLink to avoid unnecessary re-renders
const NavLink = memo(({ item }: { item: NavItem }) => {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center rounded-lg p-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-base-content/70 hover:bg-base-200/80 hover:text-base-content dark:hover:bg-base-content/10"
      )}
    >
      <Icon className={cn("mr-3 h-5 w-5 flex-shrink-0")} />
      <span className="truncate">{item.name}</span>
    </Link>
  );
});

NavLink.displayName = "NavLink";

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { darkMode, setDarkMode, sidebarOpen, toggleSidebar } = useAppContext();
  const { user } = useSessionContext();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [signOutLoading, setSignOutLoading] = React.useState(false);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    // Only close if sidebar is open and we're on mobile
    if (
      sidebarOpen &&
      typeof window !== "undefined" &&
      window.innerWidth < 768
    ) {
      toggleSidebar();
    }
  }, [pathname]); // Only depend on pathname changes

  // Theme toggle function with localStorage persistence
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    // Save preference to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("theme-preference", newMode ? "dark" : "light");
    }
  };

  const handleLogout = async () => {
    setSignOutLoading(true);

    try {
      // Najpierw wyczyść lokalny stan
      toggleSidebar();

      const { error: signOutError } = await supabase.auth.signOut({
        scope: "global", // This clears all sessions, not just the current one
      });

      if (signOutError) {
        throw signOutError;
      }

      // Use a combination of Next.js router and window.location to ensure proper navigation
      router.push("/login");

      // Force a full page reload after a slight delay to ensure proper cookie cleanup
      setTimeout(() => {
        window.location.href = "/login";
      }, 300);
    } catch (error) {
      setSignOutLoading(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          "group/sidebar fixed inset-y-0 left-0 z-40 hidden w-16 flex-col border-r bg-white/90 dark:bg-[#181C20] text-base-content transition-all duration-300 ease-in-out hover:w-64 md:flex",
          "shadow-xl backdrop-blur-md border-neutral-200 dark:border-neutral-800 dark:text-gray-100",
          "hover:shadow-2xl hover:bg-white/95 dark:hover:bg-[#23272e]",
          "overflow-hidden",
          className
        )}
      >
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-neutral-200 dark:border-neutral-800 px-4 relative justify-center bg-gradient-to-r from-white/80 to-white/60 dark:from-[#181C20] dark:to-[#23272e]"
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
          <ul role="list" className="flex flex-1 flex-col gap-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink item={item} />
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-1 border-t border-base-300 pt-4 dark:border-base-content/10">
            <button
              onClick={toggleTheme}
              className="group flex w-full items-center rounded-lg p-2 text-sm font-medium text-base-content/70 transition-colors hover:bg-base-200/80 hover:text-base-content dark:hover:bg-base-content/10"
            >
              {darkMode ? (
                <Sun className="mr-3 h-5 w-5 flex-shrink-0" />
              ) : (
                <Moon className="mr-3 h-5 w-5 flex-shrink-0" />
              )}
              <span className="truncate">
                {darkMode ? "Tryb jasny" : "Tryb ciemny"}
              </span>
            </button>

            <Link
              href="/help"
              className="group flex w-full items-center rounded-lg p-2 text-sm font-medium text-base-content/70 transition-colors hover:bg-base-200/80 hover:text-base-content dark:hover:bg-base-content/10"
            >
              <HelpCircle className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="truncate">Pomoc</span>
            </Link>

            {user && (
              <div className="px-2 py-2">
                <div className="flex items-center gap-3 rounded-lg bg-base-200/50 p-2 dark:bg-base-300/50">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary/10">
                    {user?.user_metadata?.avatar_url ? (
                      <Image
                        src={user.user_metadata.avatar_url}
                        alt={
                          user.user_metadata.full_name || user.email || "User"
                        }
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
              </div>
            )}
          </div>
        </nav>
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

              <div className="flex flex-col gap-2">
                <Link href="/support">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 rounded-xl px-3 py-2 text-base-content/80 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary transition-colors"
                    aria-label="Pomoc"
                  >
                    <HelpCircle className="h-5 w-5" />
                    <span className="font-medium">Support</span>
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 rounded-xl px-3 py-2 text-base-content/80 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary transition-colors"
                    aria-label="Ustawienia"
                  >
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Settings</span>
                  </Button>
                </Link>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-base-content/70 hover:text-base-content"
                onClick={handleLogout}
                disabled={signOutLoading}
              >
                {signOutLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <LogOut className="h-5 w-5" />
                )}
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
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      {/* Mobile sidebar toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleSidebar}
        className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg md:hidden"
        aria-label="Toggle sidebar"
      >
        <Image src={LogoCollapsed} alt="Logo" width={24} height={24} />
      </Button>
    </>
  );
}
