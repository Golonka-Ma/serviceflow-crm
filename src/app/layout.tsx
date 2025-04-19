import "./globals.css";
import React from "react";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "@/context/AppContext";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { LoadingProvider } from "@/context/LoadingContext";

// Layout Components
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ServiceFlow CRM",
  description: "CRM for service businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <SessionProvider>
          <AppProvider>
            <LoadingProvider>
              {children}
              <Toaster position="top-right" />
            </LoadingProvider>
          </AppProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
