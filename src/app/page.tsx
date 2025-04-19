import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to ServiceFlow CRM</h1>
      <div className="space-x-4">
        <Button variant="primary" asChild>
          <a href="/login">Login</a>
        </Button>
        <Button variant="secondary" asChild>
          <a href="/register">Register</a>
        </Button>
      </div>
    </div>
  );
}
