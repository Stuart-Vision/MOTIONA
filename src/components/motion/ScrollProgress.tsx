"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin reading-progress rule pinned under the header. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-ember"
    />
  );
}
