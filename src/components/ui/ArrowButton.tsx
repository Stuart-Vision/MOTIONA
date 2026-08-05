import { ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const icons = {
  right: ArrowRight,
  left: ArrowLeft,
  up: ArrowUp,
  "up-right": ArrowUpRight,
} as const;

interface ArrowButtonProps extends ComponentPropsWithoutRef<"button"> {
  direction?: keyof typeof icons;
  /** Required: the control has no text, so it needs its own name. */
  label: string;
  tone?: "light" | "dark" | "accent";
  size?: "sm" | "md" | "lg";
}

const tones = {
  light: "border-ink/15 text-ink hover:bg-ink hover:text-paper hover:border-ink",
  dark: "border-white/25 text-white hover:bg-white hover:text-ink hover:border-white",
  accent: "border-transparent bg-ember text-white hover:bg-ink",
};

const sizes = {
  sm: "size-9",
  md: "size-11",
  lg: "size-14",
};

export function ArrowButton({
  direction = "right",
  label,
  tone = "light",
  size = "md",
  className,
  ...rest
}: ArrowButtonProps) {
  const Icon = icons[direction];

  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "group inline-flex shrink-0 items-center justify-center rounded-full border transition-colors duration-300 disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-current",
        tones[tone],
        sizes[size],
        className,
      )}
      {...rest}
    >
      <Icon
        aria-hidden
        className={cn(
          "size-4 transition-transform duration-300 ease-out-expo group-disabled:translate-x-0 group-disabled:rotate-0",
          // Rotating a back-arrow would point it somewhere meaningless, so
          // horizontal controls nudge along their axis instead.
          direction === "up-right" ? "group-hover:rotate-45" : "",
          direction === "right" ? "group-hover:translate-x-0.5" : "",
          direction === "left" ? "group-hover:-translate-x-0.5" : "",
          direction === "up" ? "group-hover:-translate-y-0.5" : "",
        )}
        strokeWidth={1.75}
      />
    </button>
  );
}
