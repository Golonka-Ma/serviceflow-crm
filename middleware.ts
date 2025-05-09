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
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");
  const isApiAuthRoute = request.nextUrl.pathname.startsWith("/api/auth"); // Example API auth route
  const isPublicAsset =
    request.nextUrl.pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp)$/) !== null;

  // Let API auth routes and public assets pass through
  if (isApiAuthRoute || isPublicAsset) {
    return response;
  }

  // Redirect to dashboard if user is logged in and tries to access auth routes
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect to login if user is not logged in and tries to access protected routes
  if (!user && !isAuthRoute) {
    // Allow access to root page if it's public
    if (request.nextUrl.pathname === "/") {
      return response;
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Refresh session for logged-in users on protected routes
  // await supabase.auth.getSession(); // Refreshes the session cookie

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to add other exclusions here (e.g., public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
