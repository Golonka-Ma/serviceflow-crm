import RegisterForm from "@/components/auth/RegisterForm";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-base-100">
      {/* Sekcja Brandingowa (lewa strona na dużych ekranach) */}
      <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-primary to-secondary text-primary-content relative overflow-hidden">
        <Image
          src="/logo-white.svg"
          alt="ServiceFlowCRM Logo"
          width={150}
          height={40}
          className="mb-8"
        />
        <h1 className="text-4xl font-bold mb-4 text-center">
          Dołącz do społeczności ServiceFlow
        </h1>
        <p className="text-lg opacity-90 text-center max-w-md">
          Dołącz do tysięcy profesjonalistów, którzy już usprawniają swoją pracę
          z ServiceFlow CRM.
        </p>
      </div>

      {/* Sekcja Formularza Rejestracji */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="lg:hidden mb-8">
          <Image
            src="/logo-color.svg"
            alt="ServiceFlowCRM Logo"
            width={120}
            height={30}
          />
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
