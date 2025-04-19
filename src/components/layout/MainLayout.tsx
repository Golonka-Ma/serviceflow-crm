import { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className={`min-h-screen ${inter.className}`}>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
