"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/client";
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

      const redirectTo = searchParams.get("redirectTo") || "/dashboard";
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
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Google Sign in error:", err);
      setError(
        err.message || "Nie udało się zalogować przez Google. Spróbuj ponownie."
      );
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
        <div className="alert alert-error shadow-lg mb-6 animate-shake">
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
        <div className="form-control">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className={`input input-bordered w-full pl-11 pr-4 bg-base-100 ${
                errors.email ? "input-error" : ""
              }`}
              {...register("email")}
            />
            <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
          </div>
          {errors.email && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.email.message}
              </span>
            </label>
          )}
        </div>

        <div className="form-control">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Hasło"
              className={`input input-bordered w-full pl-11 pr-12 bg-base-100 ${
                errors.password ? "input-error" : ""
              }`}
              {...register("password")}
            />
            <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
            >
              {showPassword ? (
                <FiEyeOff className="w-5 h-5" />
              ) : (
                <FiEye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.password.message}
              </span>
            </label>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:text-primary-focus transition-colors"
          >
            Zapomniałeś hasła?
          </Link>
        </div>

        <button
          type="submit"
          className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Logowanie..." : "Zaloguj się"}
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-base-300"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-base-100 px-4 text-base-content/60">
              lub kontynuuj przez
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="btn btn-outline w-full hover:bg-base-200 gap-2 normal-case font-normal"
        >
          <Image
            src="/google.svg"
            alt="Google"
            width={20}
            height={20}
            className="opacity-80"
          />
          Google
        </button>

        <p className="text-center text-base-content/60 text-sm mt-8">
          Nie masz jeszcze konta?{" "}
          <Link
            href="/register"
            className="text-primary hover:text-primary-focus font-medium transition-colors"
          >
            Zarejestruj się za darmo
          </Link>
        </p>
      </form>
    </div>
  );
}
