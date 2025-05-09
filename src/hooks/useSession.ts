"use client";

import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useSupabaseClient } from "@/context/SupabaseProvider";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();

  useEffect(() => {
    let isMounted = true;

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (isMounted) {
        if (user) {
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (isMounted) {
              setSession(session);
              setUser(user);
              setLoading(false);
            }
          });
        } else {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (isMounted) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setSession(session);
        setUser(user);
        setLoading(false);
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase]);

  return { session, user, loading };
}
