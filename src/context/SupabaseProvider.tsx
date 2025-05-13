"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

// Define the shape of the context value
interface SupabaseContextType {
  supabase: SupabaseClient | null;
}

// Create the context with a default value
const SupabaseContext = createContext<SupabaseContextType>({ supabase: null });

// Create the provider component
export function SupabaseProvider({ children }: { children: ReactNode }) {
  // Create the Supabase client instance only once using useMemo
  const supabase = useMemo(() => {
    return createBrowserSupabaseClient();
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}

// Create a custom hook to use the Supabase context
export function useSupabaseClient() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabaseClient must be used within a SupabaseProvider");
  }
  if (!context.supabase) {
    // This should technically not happen if provider setup is correct
    throw new Error("Supabase client not initialized");
  }
  return context.supabase;
}
