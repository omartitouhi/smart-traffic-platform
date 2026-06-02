import { RegisterForm } from "@/features/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-2xl border border-border bg-white p-8">
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground">
          Smart Traffic
        </p>
        <h1 className="text-2xl font-semibold">Creation de compte</h1>
      </div>
      <RegisterForm />
    </div>
  );
}
