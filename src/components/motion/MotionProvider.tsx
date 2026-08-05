"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * `reducedMotion="user"` makes Framer Motion drop transform and layout
 * animations for visitors who ask the OS to reduce motion, while still allowing
 * opacity changes — so content arrives without sliding, rotating or parallaxing.
 *
 * The CSS block in `globals.css` covers the marquees and hover transitions,
 * which are pure CSS and never pass through Framer.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
