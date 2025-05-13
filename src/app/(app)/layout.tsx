"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useSessionContext } from "@/components/auth/SessionProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useSessionContext();
  const router = useRouter();

  // We only need to check for the user once on initial load
  // If session is lost during navigation, middleware will handle the redirect
  useEffect(() => {
    if (!loading && !user) {
      window.location.replace("/login?logout=1");
    }
  }, [loading]); // Only depend on loading, not user

  // No need to block rendering since middleware already protects this route
  return <DashboardLayout>{children}</DashboardLayout>;
}
