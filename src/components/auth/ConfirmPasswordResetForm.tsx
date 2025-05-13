"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@/context/SupabaseProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import Link from "next/link";

const confirmSchema = z
  .object({
    password: z
      .string()
      .min(8, "Hasło musi mieć minimum 8 znaków")
      .regex(/[A-Z]/, "Hasło musi zawierać co najmniej jedną wielką literę")
      .regex(/[a-z]/, "Hasło musi zawierać co najmniej jedną małą literę")
      .regex(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });

type ConfirmFormValues = z.infer<typeof confirmSchema>;

export default function ConfirmPasswordResetForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabaseClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmFormValues>({
    resolver: zodResolver(confirmSchema),
  });

  const onSubmit = async (data: ConfirmFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      // Redirect to login page
      router.push("/login?reset=success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-dark">Ustaw nowe hasło</h2>
        <p className="text-gray-500 mt-2">
          Wprowadź nowe hasło dla swojego konta
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
          <input
            {...register("password")}
            type="password"
            placeholder="Nowe hasło"
            className={`w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Potwierdź nowe hasło"
            className={`w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-4 py-2 text-white bg-primary hover:bg-primary-light rounded-lg transition-colors duration-200 flex items-center justify-center ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
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
          {isLoading ? "Zmienianie hasła..." : "Zmień hasło"}
        </button>

        <p className="text-center text-gray-500 text-sm mt-8">
          Wróć do{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary-light font-medium"
          >
            strony logowania
          </Link>
        </p>
      </form>
    </div>
  );
}
