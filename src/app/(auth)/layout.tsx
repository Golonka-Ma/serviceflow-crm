export const metadata = {
  title: "ServiceFlow CRM",
  description: "System zarządzania zleceniami dla freelancerów i małych firm",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-base-100 animate-fadeIn">
      {children}
    </div>
  );
}
