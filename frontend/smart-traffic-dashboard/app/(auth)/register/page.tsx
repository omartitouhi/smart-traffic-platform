import { RegisterForm } from "@/features/auth/register-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="mb-4 grid size-11 place-items-center border border-zinc-950 bg-zinc-950 text-sm font-semibold text-white">
          ST
        </div>
        <p className="text-xs font-semibold uppercase text-muted-foreground">
          Smart Traffic Platform
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-950">
          Creation de compte
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Configurez un acces operateur pour la plateforme.
        </p>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
