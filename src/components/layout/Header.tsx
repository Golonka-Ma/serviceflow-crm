"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";
import { Menu, Search } from "lucide-react";
import { UserDropdown } from "@/components/layout/UserDropdown";
import { Input } from "@/components/ui/Input";
// Placeholder for a potential useAuth hook
// import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { toggleSidebar, darkMode, setDarkMode, sidebarOpen } = useAppContext();
  // const { user } = useSessionContext(); // Use this to show user info
  // const { signOut } = useAuth(); // Use this for logout functionality

  // Placeholder logout function
  const handleLogout = async () => {
    // await signOut();
    console.log("Logout clicked"); // Replace with actual logout
  };

  // Placeholder user data
  const user = { email: "user@example.com" }; // Replace with actual user data

  return (
    <header className="sticky top-0 z-30 w-full border-b border-base-300 bg-base-100/80 backdrop-blur dark:border-base-content/10 dark:bg-base-200/80">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side: Mobile Menu Toggle and Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden h-10 w-10 p-0"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Center: Search Bar */}
        <div className="flex flex-1 justify-center px-4 lg:px-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/50" />
            <Input placeholder="Search..." className="pl-9 pr-4 py-2 w-full" />
          </div>
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-3 sm:gap-4">
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
