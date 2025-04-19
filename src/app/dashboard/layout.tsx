import React from "react";

// This layout might be simplified or removed if the RootLayout is sufficient
// It primarily ensures children are placed within the main content area defined by RootLayout
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // Pass children directly through
}
