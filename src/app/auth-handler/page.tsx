"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthHandler() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Pobieramy hash z URL (fragmenty z #)
        const hash = window.location.hash;

        if (hash && hash.length > 0) {
          // Parsujemy hash do obiektu
          const hashParams = new URLSearchParams(hash.substring(1));

          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");
          const expiresIn = hashParams.get("expires_in");
          const tokenType = hashParams.get("token_type");

          if (accessToken) {
            // Ustawiamy sesję z tokenami
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || undefined,
            });

            if (error) throw error;

            // Pobieramy redirectTo z parametrów URL lub ustawiamy domyślnie na '/dashboard'
            const redirectTo = searchParams.get("redirectTo") || "/dashboard";

            // Przekierowujemy do docelowej strony
            router.push(redirectTo);
            return;
          }
        }

        // Jeśli nie mamy tokenów w URL, przekierowujemy z powrotem do logowania
        setError("Brak danych uwierzytelniających");
        setTimeout(() => {
          router.push("/login?error=No%20authentication%20data");
        }, 2000);
      } catch (err: any) {
        console.error("Auth handler error:", err);
        setError(err.message || "Wystąpił błąd podczas logowania");
        setTimeout(() => {
          router.push("/login?error=Authentication%20failed");
        }, 2000);
      }
    };

    handleAuth();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        {error ? (
          <div className="text-red-500">Błąd: {error}</div>
        ) : (
          <>
            <div className="mb-4 animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full mx-auto"></div>
            <h1 className="text-xl font-semibold">
              Przetwarzanie logowania...
            </h1>
            <p className="text-gray-500 mt-2">
              Proszę czekać, jesteś przekierowywany...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
