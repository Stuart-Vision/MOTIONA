import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "solid" | "accent" | "outline" | "ghost" | "lime";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background-color,color,border-color,transform] duration-300 ease-out-expo active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-paper hover:bg-carbon",
  accent: "bg-ember text-white hover:bg-coral",
  outline: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink hover:bg-ink/5",
  lime: "bg-lime text-ink hover:bg-ink hover:text-lime",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-[15px]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & ComponentPropsWithoutRef<"button">;
type LinkButtonProps = CommonProps & ComponentPropsWithoutRef<"a"> & { href: string };

export function Button({ variant = "solid", size = "md", className, children, ...rest }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "solid",
  size = "md",
  className,
  children,
  href,
  ...rest
}: LinkButtonProps) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}
