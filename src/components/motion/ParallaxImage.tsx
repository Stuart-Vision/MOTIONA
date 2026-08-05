"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { cn } from "@/lib/utils";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  /** Travel distance in percent of the container height. */
  strength?: number;
  sizes?: string;
  priority?: boolean;
  /** Adds a gentle scale-down as the element leaves the viewport. */
  scaleOut?: boolean;
}

/**
 * Scroll-linked image drift.
 *
 * The inner image is intentionally taller than its frame so it can travel
 * without ever exposing an edge — the movement never changes layout, only
 * transform, so it cannot shift the page.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  imageClassName,
  strength = 12,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  scaleOut = false,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Mobile gets a softer effect; reduced-motion gets none at all.
  const travel = reduced ? 0 : isDesktop ? strength : strength * 0.45;

  const y = useTransform(scrollYProgress, [0, 1], [`-${travel}%`, `${travel}%`]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], scaleOut ? [1.06, 1, 1.06] : [1, 1, 1]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y, scale }} className="absolute inset-0 h-[128%] top-[-14%]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imageClassName)}
        />
      </motion.div>
    </div>
  );
}
