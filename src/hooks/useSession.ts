"use client";

import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useSupabaseClient } from "@/context/SupabaseProvider";
import { useRouter } from "next/navigation";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    // Get session once at initialization
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        if (session) {
          setSession(session);
          setUser(session.user);
        } else {
          setSession(null);
          setUser(null);
        }
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase, router]);

  return { session, user, loading };
}
