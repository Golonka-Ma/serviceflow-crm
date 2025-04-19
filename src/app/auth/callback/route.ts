import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  // Pobieramy redirectTo z URL lub ustawiamy domyślną wartość
  const redirectTo = requestUrl.searchParams.get("redirectTo") || "/dashboard";

  // Sprawdzamy, czy URL jest bezpieczny
  const safeRedirectTo = redirectTo.startsWith("/") ? redirectTo : "/dashboard";

  // Inicjalizujemy cookieStore
  const cookieStore = cookies();

  // Tworzymy instancję klienta Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          cookieStore.set({
            name,
            value: "",
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );

  // WAŻNE: Obsługa fragmentu URL (hash) - taki format zwraca Google OAuth
  // Fragment URL nie jest wysyłany na serwer, więc musimy obsłużyć to po stronie klienta
  // Przekierujmy do specjalnej strony, która przechwyci fragment i obsłuży go

  if (!code) {
    // Przekierowujemy do strony auth-handler, która przechwyci i przetworzy fragmenty URL
    return NextResponse.redirect(new URL("/auth-handler", request.url));
  }

  // Jeśli mamy kod autoryzacji, przetwarzamy go normalnie
  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(error.message)}`,
          request.url
        )
      );
    }

    // Przekierowujemy na wskazaną stronę
    return NextResponse.redirect(new URL(safeRedirectTo, request.url));
  } catch (error: any) {
    console.error("Auth callback exception:", error);
    return NextResponse.redirect(
      new URL("/login?error=Authentication%20failed", request.url)
    );
  }
}
