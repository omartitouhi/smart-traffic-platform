"use client";

import Link from "next/link";
import { Car, ChevronRight, LayoutDashboard, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/auth-provider";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vehicles", label: "Vehicles", icon: Car },
];

type MainNavigationProps = {
  variant?: "sidebar" | "topbar";
};

export function MainNavigation({ variant = "topbar" }: MainNavigationProps) {
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const isSidebar = variant === "sidebar";

  return (
    <div
      className={
        isSidebar
          ? "flex h-[calc(100dvh-7rem)] flex-col justify-between"
          : "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      }
    >
      <nav aria-label="Main navigation" className={isSidebar ? "flex flex-col gap-1" : "flex flex-wrap gap-2"}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group inline-flex h-10 items-center gap-2 border px-3 text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 ${
                isActive
                  ? "border-zinc-950 bg-zinc-950 text-white shadow-sm"
                  : "border-transparent text-zinc-700 hover:border-border hover:bg-zinc-50 hover:text-zinc-950"
              } ${isSidebar ? "w-full justify-between" : ""}`}
            >
              <span className="inline-flex items-center gap-2">
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </span>
              {isSidebar ? (
                <ChevronRight
                  className={`size-4 transition-transform group-hover:translate-x-0.5 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden="true"
                />
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div
        className={
          isSidebar
            ? "space-y-3 border-t border-border pt-4"
            : "flex items-center gap-3 sm:border-l sm:border-border sm:pl-4"
        }
      >
        {user ? (
          <div className={isSidebar ? "" : "hidden md:block"}>
            <p className="text-sm font-medium text-zinc-950">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{user.role}</p>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => void logout()}
          className={`inline-flex h-10 items-center justify-center gap-2 border border-border px-3 text-sm font-medium text-zinc-700 transition-all duration-200 hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 ${
            isSidebar ? "w-full" : ""
          }`}
        >
          <LogOut className="size-4" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  );
}
