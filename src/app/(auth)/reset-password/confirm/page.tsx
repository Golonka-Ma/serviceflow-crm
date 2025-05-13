import ConfirmPasswordResetForm from "@/components/auth/ConfirmPasswordResetForm";
import Image from "next/image";
import { Suspense } from "react";

const geometricPatternUrl = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

export default function ConfirmResetPasswordPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Sekcja Brandingowa - Gradient i Wzór na Pseudo-elemencie */}
      <div className="hidden lg:flex flex-col items-center justify-center p-12 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary">
        {/* Pseudo-element ::before dla wzoru tła */}
        <div
          className="absolute inset-0 before:absolute before:inset-0 before:opacity-10"
          style={{
            backgroundImage: geometricPatternUrl,
            backgroundSize: "60px 60px",
          }}
        ></div>

        {/* Reszta zawartości sekcji brandingowej */}
        <div className="relative z-10 max-w-xl mx-auto text-center">
          <Image
            src="/Logo-text-white.svg"
            alt="ServiceFlowCRM Logo"
            width={350}
            height={95}
            className="mb-3 mx-auto"
            priority
          />
          <h1 className="text-5xl font-bold mb-6 text-white leading-tight">
            Ustaw nowe hasło
          </h1>
          <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-lg mx-auto">
            Wybierz silne hasło, aby zabezpieczyć swoje konto. Pamiętaj, że
            hasło powinno zawierać co najmniej 8 znaków, w tym wielkie i małe
            litery oraz cyfry.
          </p>

          {/* Sekcja Social Proof */}
          <div className="mt-16 grid grid-cols-3 gap-8 text-white/90">
            <div>
              <div className="text-3xl font-bold mb-2">2,000+</div>
              <div className="text-sm">Aktywnych użytkowników</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-sm">Zadowolonych klientów</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-sm">Wsparcie techniczne</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sekcja Formularza */}
      <div className="flex flex-col items-center justify-center min-h-screen p-6 sm:p-12 bg-base-100">
        <div className="w-full max-w-[400px] mx-auto">
          {/* Logo Mobilne */}
          <div className="lg:hidden flex justify-center mb-2">
            <Image
              src="/Logo-text-gear-black.svg"
              alt="ServiceFlowCRM Logo"
              width={350}
              height={75}
              priority
            />
          </div>

          <Suspense
            fallback={<div className="text-center my-8">Ładowanie...</div>}
          >
            <ConfirmPasswordResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
