import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md border border-border bg-white p-8">
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground">
          Smart Traffic
        </p>
        <h1 className="text-2xl font-semibold">Connexion</h1>
      </div>
      <LoginForm />
    </div>
  );
}
