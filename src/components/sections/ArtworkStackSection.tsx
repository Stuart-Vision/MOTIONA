"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

import { RevealText } from "@/components/motion/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { stackArtworks } from "@/data/artworks";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Diagonal cascade.
 *
 * Each card lands one step down and to the right of the last, overlapping it by
 * roughly half — a staircase rather than a fan. All values are percentages of
 * the stage, so the run scales with the viewport; only the step sizes change
 * between breakpoints, because a narrow screen needs a steeper, tighter run.
 */
const CARD_ASPECT = 5 / 4; // height ÷ width

/*
 * `stepX` relative to `cardWidth` sets how much of each card the next one
 * covers; around 55–65% keeps the run reading as a deck without burying the
 * artwork. `originX + (count - 1) × stepX + cardWidth` must stay under 100 so
 * the last card lands inside the stage.
 */
const CASCADE = {
  base: { cardWidth: 40, stepX: 14, stepY: 12, originX: 2, originY: 2 },
  md: { cardWidth: 36, stepX: 15, stepY: 11, originX: 3, originY: 2 },
  lg: { cardWidth: 32, stepX: 14, stepY: 10, originX: 4, originY: 2 },
} as const;

type CascadeConfig = (typeof CASCADE)[keyof typeof CASCADE];

interface CascadeGeometry {
  cards: { x: number; y: number; rotate: number }[];
  /** CSS aspect-ratio for the stage, sized so the last card lands inside it. */
  aspect: string;
  origin: { x: number; y: number };
}

/**
 * Derives the stage height from the run rather than hard-coding it: the last
 * card's top plus its own height must stay within the stage, so
 * height ÷ width = (cardWidth × cardAspect) ÷ (100 − lastY).
 */
function buildCascade(config: CascadeConfig, count: number): CascadeGeometry {
  const cards = Array.from({ length: count }, (_, index) => ({
    x: config.originX + index * config.stepX,
    y: config.originY + index * config.stepY,
    rotate: -6 + index * 2.4,
  }));

  const lastY = config.originY + (count - 1) * config.stepY;
  const ratio = (config.cardWidth * CARD_ASPECT) / (100 - lastY);

  return {
    cards,
    aspect: `1 / ${ratio.toFixed(3)}`,
    origin: { x: config.originX, y: config.originY },
  };
}

export function ArtworkStackSection() {
  const ref = useRef<HTMLElement>(null);
  const breakpoint = useBreakpoint();
  const reduced = useReducedMotion();

  const config = CASCADE[breakpoint];
  const cascade = buildCascade(config, stackArtworks.length);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={ref}
      id="showcase"
      aria-labelledby="showcase-heading"
      className="relative overflow-hidden py-20 md:py-28 lg:py-32"
    >
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-8">
          {/* Statement */}
          <div>
            <SectionLabel>The platform</SectionLabel>
            <RevealText
              as="h2"
              id="showcase-heading"
              className="type-h2 mt-6"
              lines={[
                "Showcase, sell",
                [{ text: "&", accent: true }, "acquire", "art"],
                "on one platform.",
              ]}
            />
            <p className="type-lead mt-7 max-w-md">
              Publish a body of work, find the people already looking for it, and keep the whole
              archive under your own name.
            </p>
          </div>

          {/* The cascade runs at every size; only its step geometry changes. */}
          <div className="relative w-full" style={{ aspectRatio: cascade.aspect }}>
            {cascade.cards.map((card, index) => {
              const piece = stackArtworks[index];

              return (
                <CascadeCard
                  key={piece.id}
                  index={index}
                  total={cascade.cards.length}
                  progress={scrollYProgress}
                  still={reduced}
                  width={config.cardWidth}
                  origin={cascade.origin}
                  x={card.x}
                  y={card.y}
                  rotate={card.rotate}
                  src={piece.image}
                  alt={`${piece.title} by ${piece.artist}`}
                  title={piece.title}
                  artist={piece.artist}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

interface CascadeCardProps {
  index: number;
  total: number;
  progress: MotionValue<number>;
  still: boolean;
  width: number;
  origin: { x: number; y: number };
  x: number;
  y: number;
  rotate: number;
  src: string;
  alt: string;
  title: string;
  artist: string;
}

function CascadeCard({
  index,
  total,
  progress,
  still,
  width,
  origin,
  x,
  y,
  rotate,
  src,
  alt,
  title,
  artist,
}: CascadeCardProps) {
  // Each card opens slightly later than the one before, so the run unrolls
  // from the top-left corner rather than expanding all at once.
  const start = 0.14 + (index / total) * 0.2;
  const end = start + 0.3;

  const left = useTransform(progress, [start, end], [`${origin.x}%`, `${x}%`]);
  const top = useTransform(progress, [start, end], [`${origin.y}%`, `${y}%`]);
  const r = useTransform(progress, [start, end], [rotate * 2.4, rotate]);
  const opacity = useTransform(progress, [start, start + 0.1], [0, 1]);

  const style = still
    ? { left: `${x}%`, top: `${y}%`, rotate, opacity: 1 }
    : { left, top, rotate: r, opacity };

  return (
    <motion.figure style={{ ...style, zIndex: index, width: `${width}%` }} className="group absolute">
      <div className="relative aspect-4/5 overflow-hidden rounded-[1.25rem] bg-surface shadow-[0_26px_60px_-28px_rgba(17,17,17,0.45)] ring-1 ring-black/5">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 42vw, 30vw"
          className="object-cover transition-transform duration-900 ease-out-expo group-hover:scale-105"
        />
        <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <p className="text-sm font-medium leading-tight text-white">{title}</p>
          <p className="type-meta text-white/75">{artist}</p>
        </figcaption>
      </div>
    </motion.figure>
  );
}
