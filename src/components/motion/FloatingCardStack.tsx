"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

import { cn } from "@/lib/utils";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Artwork } from "@/types";

export interface FanCard {
  artwork: Artwork;
  /** Horizontal offset from centre, in percent of a card's own width. */
  offset: number;
  /** Vertical lift, in percent of a card's own height. Arc, so ends sit lower. */
  lift: number;
  rotate: number;
  /** Depth drives pointer response, idle drift and stacking order. */
  depth: number;
}

interface FloatingCardStackProps {
  cards: FanCard[];
  /** Card width as a percentage of the stage. */
  cardWidth?: number;
  className?: string;
}

/**
 * The hero artwork deck.
 *
 * Cards begin squared up in a single pile at the centre and fan outward into a
 * shallow arc, staying heavily overlapped — the deck reads as one object being
 * spread, not five separate tiles arriving.
 *
 * Three transform layers are stacked deliberately, because each has a different
 * lifetime: the outer element runs the one-off fan, the middle one follows the
 * pointer, and the inner one loops the idle drift. Keeping them separate means
 * none of them has to interrupt or recompute the others.
 */
export function FloatingCardStack({ cards, cardWidth = 17, className }: FloatingCardStackProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const interactive = isDesktop && !reduced;

  // Pointer position, normalised to -1..1 across the stage.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 20, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 20, mass: 0.6 });

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!interactive || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      // Fills the parent so the cards' `top-1/2` resolves against the stage,
      // not against a collapsed box.
      className={cn("relative size-full", className)}
    >
      {cards.map((card, index) => (
        <Card
          key={card.artwork.id}
          card={card}
          index={index}
          width={cardWidth}
          pointerX={smoothX}
          pointerY={smoothY}
          animate={!reduced}
          eager={index === 2}
        />
      ))}
    </div>
  );
}

interface CardProps {
  card: FanCard;
  index: number;
  width: number;
  pointerX: ReturnType<typeof useSpring>;
  pointerY: ReturnType<typeof useSpring>;
  animate: boolean;
  eager: boolean;
}

function Card({ card, index, width, pointerX, pointerY, animate, eager }: CardProps) {
  const { artwork, offset, lift, rotate, depth } = card;

  const translateX = useTransform(pointerX, [-1, 1], [-16 * depth, 16 * depth]);
  const translateY = useTransform(pointerY, [-1, 1], [-12 * depth, 12 * depth]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: `${width}%`, zIndex: Math.round(depth * 10) }}
      // The whole deck starts stacked and square; only then does it fan.
      initial={{ opacity: 0, x: "0%", y: "6%", rotate: 0, scale: 0.9 }}
      animate={{ opacity: 1, x: `${offset}%`, y: `${lift}%`, rotate, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 105,
        damping: 17,
        mass: 0.95,
        delay: 0.4 + index * 0.085,
      }}
    >
      <motion.div style={{ x: translateX, y: translateY }}>
        <motion.div
          animate={animate ? { y: [0, -8 * depth, 0] } : undefined}
          transition={{
            duration: 6 + index * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.35,
          }}
          className="relative overflow-hidden rounded-[1.1rem] bg-surface shadow-[0_20px_50px_-20px_rgba(17,17,17,0.4)] ring-1 ring-black/5 sm:rounded-[1.35rem]"
        >
          <div
            className={cn(
              "relative",
              artwork.orientation === "square" ? "aspect-square" : "aspect-3/4",
            )}
          >
            <Image
              src={artwork.image}
              alt={`${artwork.title} by ${artwork.artist}`}
              fill
              loading={eager ? "eager" : "lazy"}
              sizes="(max-width: 768px) 45vw, 20vw"
              className="object-cover"
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
