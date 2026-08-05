"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
  /** How far the element may be pulled toward the pointer, in pixels. */
  radius?: number;
  type?: "button" | "submit";
}

/**
 * Pulls gently toward the pointer while hovered, then springs back.
 *
 * Pointer tracking is skipped on touch and coarse-pointer devices, where there
 * is no hover to respond to, and when reduced motion is requested.
 */
export function MagneticButton({
  children,
  className,
  href,
  onClick,
  ariaLabel,
  radius = 10,
  type = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const active = isDesktop && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (event: React.MouseEvent) => {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    x.set((offsetX / (rect.width / 2)) * radius);
    y.set((offsetY / (rect.height / 2)) * radius);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const shared = {
    ref: ref as never,
    className: cn("inline-flex items-center justify-center", className),
    style: { x: springX, y: springY },
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <motion.a href={href} onClick={onClick} {...shared}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} {...shared}>
      {children}
    </motion.button>
  );
}
