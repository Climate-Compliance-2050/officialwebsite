import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost-dark";
  arrow?: boolean;
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] sm:px-7 sm:py-3.5 sm:text-base";

const variants = {
  primary:
    "btn-sheen bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/25",
  secondary:
    "border border-navy-900/15 bg-white text-navy-900 hover:border-blue-600 hover:text-blue-600",
  "ghost-dark":
    "border border-white/25 text-white hover:border-green-400 hover:text-green-400",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  arrow = false,
  className = "",
}: ButtonLinkProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      {arrow && <ArrowRight className="h-4 w-4" aria-hidden />}
    </Link>
  );
}
