"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Default to light mode
  const [mounted, setMounted] = useState(false);

  // Initialize dark mode from localStorage & system preferences
  useEffect(() => {
    // Only execute once the component is mounted to avoid hydration mismatch
    setMounted(true);

    // First check localStorage for saved preference
    const savedTheme = localStorage.getItem("theme-preference");

    if (savedTheme === "dark") {
      setDarkMode(true);
    } else if (savedTheme === "light") {
      setDarkMode(false);
    } else {
      // If no saved preference, check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply theme attribute to HTML element
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    if (darkMode) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.setAttribute("data-theme", "mytheme"); // Używamy 'mytheme' dla trybu jasnego
    }
    // Usunięcie zarządzania klasą 'dark', bo DaisyUI robi to przez data-theme
  }, [darkMode, mounted]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, [sidebarOpen]);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
