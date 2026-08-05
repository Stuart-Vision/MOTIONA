"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const EASE = [0.16, 1, 0.3, 1] as const;

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

export type MotionTag = "div" | "section" | "article" | "li" | "ul" | "p" | "span";

/**
 * Renders one of a fixed set of motion elements.
 *
 * A switch is used rather than an indexed lookup so the element type is
 * statically known at every call site — no component is constructed at render
 * time, which would reset the subtree's state on each pass.
 */
function renderMotionTag(as: MotionTag, props: HTMLMotionProps<"div">) {
  switch (as) {
    case "section":
      return <motion.section {...(props as HTMLMotionProps<"section">)} />;
    case "article":
      return <motion.article {...(props as HTMLMotionProps<"article">)} />;
    case "li":
      return <motion.li {...(props as HTMLMotionProps<"li">)} />;
    case "ul":
      return <motion.ul {...(props as HTMLMotionProps<"ul">)} />;
    case "p":
      return <motion.p {...(props as HTMLMotionProps<"p">)} />;
    case "span":
      return <motion.span {...(props as HTMLMotionProps<"span">)} />;
    default:
      return <motion.div {...props} />;
  }
}

interface FadeUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: MotionTag;
  /** Set when the parent is a StaggerContainer — the parent owns the trigger. */
  nested?: boolean;
}

/**
 * Reveals its children with a short upward drift the first time they enter view.
 * Reduced motion is handled globally by the CSS override in `globals.css`, so
 * no branch is needed here.
 */
export function FadeUp({ children, className, delay = 0, as = "div", nested = false }: FadeUpProps) {
  const trigger: HTMLMotionProps<"div"> = nested
    ? {}
    : {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, margin: "-12% 0px -12% 0px" },
      };

  return renderMotionTag(as, {
    className: cn(className),
    variants: fadeUpVariants,
    transition: { duration: 0.75, ease: EASE, delay },
    children,
    ...trigger,
  });
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: MotionTag;
}

/** Runs its `FadeUp` children in sequence rather than all at once. */
export function StaggerContainer({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  as = "div",
}: StaggerContainerProps) {
  return renderMotionTag(as, {
    className: cn(className),
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-10% 0px -10% 0px" },
    variants: {
      hidden: {},
      visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
    },
    children,
  });
}
