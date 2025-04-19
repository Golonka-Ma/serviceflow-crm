// src/app/(auth)/login/page.tsx
import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Branding Section - Modern Gradient Background */}
      <div className="hidden lg:flex flex-col items-center justify-center p-12 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary">
        {/* Modern Geometric Pattern Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
            opacity: 0.1,
          }}
        />

        <div className="relative z-10 max-w-xl mx-auto text-center">
          <Image
            src="/logo-white.svg"
            alt="ServiceFlowCRM Logo"
            width={180}
            height={45}
            className="mb-12 mx-auto"
            priority
          />
          <h1 className="text-5xl font-bold mb-6 text-white leading-tight">
            Zarządzaj zleceniami <br />
            bez chaosu
          </h1>
          <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-lg mx-auto">
            ServiceFlowCRM pomaga freelancerom i małym firmom usługowym
            usprawnić przepływ pracy i komunikację z klientami.
          </p>

          {/* Social Proof Section */}
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

          {/* Testimonial */}
          <div className="mt-16">
            <div className="relative">
              <svg
                className="absolute -top-4 -left-4 h-8 w-8 text-white/20"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <blockquote className="relative bg-white/10 rounded-xl p-6 text-white">
                <p className="text-lg font-medium leading-relaxed mb-4">
                  "Od kiedy używam ServiceFlow, moja produktywność wzrosła o
                  40%. Teraz mogę skupić się na tym, co naprawdę ważne - rozwoju
                  mojego biznesu."
                </p>
                <footer className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-focus flex items-center justify-center text-white font-semibold">
                      MK
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Marek Kowalski</div>
                    <div className="text-sm opacity-70">
                      Właściciel, Studio Design Pro
                    </div>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form Section - Clean & Modern */}
      <div className="flex flex-col items-center justify-center min-h-screen p-6 sm:p-12 bg-base-100">
        <div className="w-full max-w-[400px] mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-12">
            <Image
              src="/logo-color.svg"
              alt="ServiceFlowCRM Logo"
              width={160}
              height={40}
              priority
            />
          </div>

          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
