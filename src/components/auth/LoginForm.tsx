"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSupabaseClient } from "@/context/SupabaseProvider";
import Image from "next/image";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const loginSchema = z.object({
  email: z.string().email("Wprowadź poprawny adres email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const supabase = useSupabaseClient();

  // Pobieramy redirectTo z URL query params
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          throw new Error("Nieprawidłowy email lub hasło.");
        }
        throw signInError;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Wystąpił nieznany błąd. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Przekazujemy aktualny redirectTo do callbacku
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.error("Google Sign in error:", err);
      setError(
        err.message || "Nie udało się zalogować przez Google. Spróbuj ponownie."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-base-content">
          Witaj z powrotem! 👋
        </h2>
        <p className="text-base-content/60 mt-2">
          Zaloguj się, by kontynuować pracę
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow-lg mb-6 animate-shake">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className={`w-full px-4 py-2 pl-11 pr-4 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...register("email")}
            />
            <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          {errors.email && (
            <div className="text-sm text-red-500">{errors.email.message}</div>
          )}
        </div>

        <div className="space-y-2">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Hasło"
              className={`w-full px-4 py-2 pl-11 pr-12 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              {...register("password")}
            />
            <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <FiEyeOff className="w-5 h-5" />
              ) : (
                <FiEye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <div className="text-sm text-red-500">
              {errors.password.message}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            href="/reset-password"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Zapomniałeś hasła?
          </Link>
        </div>

        <button
          type="submit"
          className={`w-full px-4 py-2 text-white bg-primary hover:bg-primary-light rounded-lg transition-colors duration-200 flex items-center justify-center ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="mr-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
          ) : null}
          {isLoading ? "Logowanie..." : "Zaloguj się"}
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-4 text-gray-500">
              lub kontynuuj przez
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-background-light transition-colors duration-200 flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="mr-2">
              <svg
                className="animate-spin h-5 w-5 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
          ) : (
            <Image
              src="/google.svg"
              alt="Google"
              width={20}
              height={20}
              className="opacity-80"
            />
          )}
          {isLoading ? "Logowanie..." : "Google"}
        </button>

        <p className="text-center text-gray-500 text-sm mt-8">
          Nie masz jeszcze konta?{" "}
          <Link
            href="/register"
            className="text-primary hover:text-primary-light font-medium transition-colors"
          >
            Zarejestruj się za darmo
          </Link>
        </p>
      </form>
    </div>
  );
}
