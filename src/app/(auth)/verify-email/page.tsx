"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token");
        const type = searchParams.get("type");

        if (!token || type !== "signup") {
          throw new Error("Nieprawidłowy link weryfikacyjny");
        }

        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "signup",
        });

        if (error) throw error;

        setTimeout(() => {
          router.push("/login?verified=true");
        }, 3000);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-base-100">
      {/* Sekcja Brandingowa */}
      <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-primary to-secondary text-primary-content relative overflow-hidden">
        <Image
          src="/logo-white.svg"
          alt="ServiceFlowCRM Logo"
          width={150}
          height={40}
          className="mb-8"
        />
        <h1 className="text-4xl font-bold mb-4 text-center">
          Weryfikacja adresu email
        </h1>
        <p className="text-lg opacity-90 text-center max-w-md">
          Trwa weryfikacja Twojego adresu email...
        </p>
      </div>

      {/* Sekcja Statusu */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="lg:hidden mb-8">
          <Image
            src="/logo-color.svg"
            alt="ServiceFlowCRM Logo"
            width={120}
            height={30}
          />
        </div>
        <div className="card bg-base-200 w-full max-w-md">
          <div className="card-body">
            {isVerifying ? (
              <div className="text-center">
                <div className="loading loading-spinner loading-lg mb-4"></div>
                <p className="text-lg">Weryfikacja adresu email...</p>
              </div>
            ) : error ? (
              <div className="alert alert-error">
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
                <span>{error}</span>
              </div>
            ) : (
              <div className="alert alert-success">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Adres email został zweryfikowany! Za chwilę zostaniesz
                  przekierowany do strony logowania.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
