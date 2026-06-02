import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800 hover:border-zinc-800",
  secondary:
    "border-border bg-white text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50",
  ghost:
    "border-transparent bg-transparent text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950",
  danger:
    "border-red-200 bg-white text-red-700 hover:border-red-300 hover:bg-red-50",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
};

type BaseButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  isLoading?: boolean;
  className?: string;
};

type ButtonProps = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonLinkProps = BaseButtonProps & {
  href: string;
};

function content(icon: ReactNode, children: ReactNode, isLoading?: boolean) {
  return (
    <>
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        icon
      )}
      {children}
    </>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  isLoading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center gap-2 border font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-200 disabled:text-zinc-500",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
    >
      {content(icon, children, isLoading)}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  size = "md",
  icon,
  isLoading,
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 border font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
    >
      {content(icon, children, isLoading)}
    </Link>
  );
}
