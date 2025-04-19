"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";
import { useSessionContext } from "@/components/auth/SessionProvider";
import { Button } from "@/components/ui/Button"; // Assuming Button component exists
import { Menu, Sun, Moon, User, LogOut } from "lucide-react";
// Placeholder for a potential useAuth hook
// import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { toggleSidebar, darkMode, setDarkMode } = useAppContext();
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
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left side: Mobile menu button and Breadcrumbs */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 mr-4 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
          {/* Breadcrumbs placeholder */}
          <div className="hidden md:block text-sm text-gray-500">
            Dashboard / Overview
          </div>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-gray-500 hover:text-gray-700"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Dropdown Placeholder - Replace with actual dropdown */}
          {user ? (
            <div className="relative">
              <Button variant="ghost" className="flex items-center">
                <User size={20} className="mr-2" />
                {user.email}
              </Button>
              {/* Basic placeholder for dropdown content */}
              {/* <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden"> */}
              {/*   <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Logout</button> */}
              {/* </div> */}
            </div>
          ) : (
            <Button>Login</Button> // Or Link to login
          )}
        </div>
      </div>
    </header>
  );
}
