"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Add logic here to persist/retrieve darkMode preference if needed

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
