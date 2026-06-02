import { LoginForm } from "@/features/auth/login-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="mb-4 grid size-11 place-items-center border border-zinc-950 bg-zinc-950 text-sm font-semibold text-white">
          ST
        </div>
        <p className="text-xs font-semibold uppercase text-muted-foreground">
          Smart Traffic Platform
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-950">Connexion</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Accedez a votre espace d&apos;exploitation.
        </p>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
