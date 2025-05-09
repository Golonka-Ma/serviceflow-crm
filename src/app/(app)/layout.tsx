import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already handles authentication and redirects
  // We can safely render the DashboardLayout here
  return <DashboardLayout>{children}</DashboardLayout>;
}
