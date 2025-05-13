import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            // Ważne: modyfikuj ciasteczka na request, jeśli Supabase ma je odczytać w tej samej operacji
            name,
            value,
            ...options,
          });
          response.cookies.set({
            // Ustaw ciasteczko w odpowiedzi wysyłanej do przeglądarki
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            // Jak wyżej
            name,
            value: "",
            ...options,
          });
          response.cookies.delete({
            name,
            path: options.path,
            domain: options.domain,
          });
        },
      },
    }
  );

  let user = null;
  try {
    const { data: supabaseData, error: supabaseAuthError } =
      await supabase.auth.getUser();

    if (!supabaseAuthError && supabaseData?.user) {
      user = supabaseData.user;
    }
  } catch (e) {
    // Catching errors silently - user remains null
  }

  // Definicja tras
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ["/", "/cennik", "/kontakt"]; // Dodaj WSZYSTKIE swoje publiczne trasy
  const authRoutes = ["/login", "/register", "/reset-password"]; // Trasy związane z logowaniem/rejestracją
  const apiAuthRoutePrefix = "/api/auth"; // Np. /api/auth/callback, /api/auth/signout

  // Sprawdzenie, czy bieżąca ścieżka jest publiczna
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Sprawdzenie, czy bieżąca ścieżka jest trasą uwierzytelniania (logowanie, rejestracja)
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Sprawdzenie, czy to trasa API związana z auth lub zasób statyczny
  const isApiAuthRoute = pathname.startsWith(apiAuthRoutePrefix);
  const isSupabaseCallback = pathname === "/auth/callback";
  const isStaticAsset =
    pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$/i) !== null ||
    pathname.startsWith("/_next/");

  // 1. Zawsze zezwalaj na dostęp do zasobów statycznych i tras API do autoryzacji
  if (isStaticAsset || isApiAuthRoute || isSupabaseCallback) {
    return response;
  }

  // 2. Jeśli użytkownik jest zalogowany
  if (user) {
    // Jeśli próbuje wejść na stronę logowania/rejestracji, przekieruj go na dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Dla wszystkich innych tras - pozwól przejść
    return response;
  }

  // 3. Jeśli użytkownik NIE jest zalogowany
  if (!user) {
    // Explicitly handle the case when user is trying to access /login
    if (pathname === "/login") {
      return response;
    }

    // Jeśli próbuje wejść na trasę, która NIE JEST publiczna ANI NIE JEST trasą logowania/rejestracji -> przekieruj do logowania
    if (!isPublicRoute && !isAuthRoute) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Dla tras publicznych i tras logowania/rejestracji - pozwól przejść
    return response;
  }

  // Domyślnie, jeśli żaden warunek nie został spełniony
  return response;
}

export const config = {
  // matcher: ["/dashboard"],
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Możesz dodać inne wykluczenia, np. folder /public, jeśli nie jest obsługiwany inaczej
     * np. "/((?!_next/static|_next/image|favicon.ico|fonts/|images/).*)",
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
