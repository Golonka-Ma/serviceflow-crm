"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSessionContext } from "@/components/auth/SessionProvider";
import { useSupabaseClient } from "@/context/SupabaseProvider";
import { cn } from "@/lib/utils";
import { User, Settings, LogOut, ChevronDown, Loader2 } from "lucide-react";

export function UserDropdown() {
  const { user, loading } = useSessionContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const supabase = useSupabaseClient();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/login?logout=1";
    } catch (error) {
      console.error("Error signing out:", error);
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

  // If still loading, show a loading spinner
  if (loading) {
    return <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />;
  }

  // If no user is found after loading completes, show nothing
  if (!user) {
    return null;
  }

  const displayName =
    user.user_metadata?.full_name || user.user_metadata?.name || user.email;
  const avatarUrl =
    user.user_metadata?.avatar_url || user.user_metadata?.picture;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-full p-1 transition-colors hover:bg-base-200 dark:hover:bg-base-content/10"
      >
        <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary/10">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName || "User"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-primary">
              {displayName?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-base-content/70 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-base-100 p-1 shadow-lg ring-1 ring-base-content/10 focus:outline-none dark:bg-base-200">
          <div className="border-b border-base-200 px-3 py-2 dark:border-base-content/10">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs text-base-content/70">
              {user.email}
            </p>
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-base-200 dark:hover:bg-base-content/10"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4 text-base-content/70" />
              Mój Profil
            </Link>
            <Link
              href="/settings"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-base-200 dark:hover:bg-base-content/10"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4 text-base-content/70" />
              Ustawienia
            </Link>
          </div>

          <div className="border-t border-base-200 py-1 dark:border-base-content/10">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-base-200 dark:hover:bg-base-content/10"
            >
              <LogOut className="h-4 w-4 text-base-content/70" />
              Wyloguj się
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
