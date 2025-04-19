"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession } from "@/hooks/useSession"; // Assuming useSession hook exists
import { User, Session } from "@supabase/supabase-js";

interface SessionContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
  loading: true, // Start with loading true
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const sessionData = useSession();

  return (
    <SessionContext.Provider value={sessionData}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }
  return context;
}
