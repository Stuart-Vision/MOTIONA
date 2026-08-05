"use client";

import { useMediaQuery } from "./useMediaQuery";

/**
 * True when the visitor has asked the OS to reduce motion.
 *
 * Framer Motion ships its own `useReducedMotion`, but it returns `null` before
 * hydration. A plain boolean is easier to branch on inside render, and it keeps
 * the first paint identical on server and client.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
