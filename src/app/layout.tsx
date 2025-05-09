import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { SupabaseProvider } from "@/context/SupabaseProvider";
import { LoadingProvider } from "@/context/LoadingContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ServiceFlowCRM",
  description: "Zarządzaj zleceniami bez chaosu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-base-100 text-base-content`}
      >
        <SupabaseProvider>
          <SessionProvider>
            <AppProvider>
              <LoadingProvider>
                {children}
                <Toaster position="top-right" />
              </LoadingProvider>
            </AppProvider>
          </SessionProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
