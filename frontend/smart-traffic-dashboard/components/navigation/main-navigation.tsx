import Link from "next/link";
import { Car, LayoutDashboard, LogIn, UserPlus } from "lucide-react";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vehicles", label: "Vehicles", icon: Car },
  { href: "/login", label: "Login", icon: LogIn },
  { href: "/register", label: "Register", icon: UserPlus },
];

export function MainNavigation() {
  return (
    <nav aria-label="Main navigation" className="flex items-center gap-2">
      {navigationItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex h-10 items-center gap-2 border border-transparent px-3 text-sm font-medium text-zinc-700 transition-colors hover:border-border hover:bg-muted hover:text-zinc-950"
          >
            <Icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
