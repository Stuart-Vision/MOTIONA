"use client";

import { useMediaQuery } from "./useMediaQuery";

export type Breakpoint = "base" | "md" | "lg";

/**
 * Coarse breakpoint for layouts whose geometry is computed in JavaScript rather
 * than expressed in CSS — the artwork fan and the diagonal cascade both need
 * numeric offsets, which media queries cannot supply.
 *
 * Returns `"base"` on the server and on the first client render, so markup
 * matches during hydration. Both consumers animate in on a delay, so the
 * correct configuration is in place well before anything is visible.
 */
export function useBreakpoint(): Breakpoint {
  const isMd = useMediaQuery("(min-width: 768px)");
  const isLg = useMediaQuery("(min-width: 1024px)");

  if (isLg) return "lg";
  if (isMd) return "md";
  return "base";
}

/** Picks the value for the active breakpoint from a per-breakpoint record. */
export function forBreakpoint<T>(breakpoint: Breakpoint, values: Record<Breakpoint, T>): T {
  return values[breakpoint];
}
