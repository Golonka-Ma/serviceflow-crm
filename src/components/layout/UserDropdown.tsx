"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Settings, LogOut, User, ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSessionContext } from "@/components/auth/SessionProvider";
import { useSupabaseClient } from "@/context/SupabaseProvider";

export function UserDropdown() {
  const { user: sessionUser, loading: sessionLoading } = useSessionContext();
  const supabase = useSupabaseClient();
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const signOut = async () => {
    try {
      setSignOutLoading(true);
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setSignOutLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (sessionLoading) {
    return <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />;
  }

  if (!sessionUser) {
    return null;
  }

  const displayName =
    sessionUser.user_metadata?.full_name ||
    sessionUser.user_metadata?.name ||
    sessionUser.email;
  const avatarUrl =
    sessionUser.user_metadata?.avatar_url || sessionUser.user_metadata?.picture;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Avatar użytkownika"
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-base-300 text-base-content/60">
            <User className="h-4 w-4" />
          </div>
        )}
        <span className="hidden text-sm font-medium md:block">
          {displayName}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-base-content/60 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md border border-base-300 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-base-200">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
          >
            <div className="border-b border-base-300 px-4 py-3 dark:border-base-content/10">
              <p className="text-sm text-base-content/70">Zalogowano jako</p>
              <p className="truncate text-sm font-medium text-base-content">
                {sessionUser.email}
              </p>
            </div>
            <Link
              href="/settings"
              className="flex w-full items-center px-4 py-2 text-sm text-base-content/90 hover:bg-gray-100 dark:hover:bg-base-300"
              role="menuitem"
            >
              <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
              Ustawienia
            </Link>
            <button
              onClick={signOut}
              disabled={signOutLoading}
              className="flex w-full items-center px-4 py-2 text-sm text-error hover:bg-gray-100 dark:hover:bg-base-300"
              role="menuitem"
            >
              {signOutLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              Wyloguj
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
