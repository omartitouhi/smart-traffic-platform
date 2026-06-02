import { PageShell } from "@/components/layout/page-shell";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md bg-white p-8">
      <PageShell
        title="Login"
        description="Authentication module entry point."
      />
    </div>
  );
}
