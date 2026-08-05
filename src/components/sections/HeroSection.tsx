"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

import { EASE } from "@/components/motion/FadeUp";
import { FloatingCardStack, type FanCard } from "@/components/motion/FloatingCardStack";
import { RevealText } from "@/components/motion/RevealText";
import { LinkButton } from "@/components/ui/Button";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/utils";
import { heroArtworks } from "@/data/artworks";

/**
 * Fan geometry per breakpoint.
 *
 * `spread` is the outer card's offset as a percentage of a card's own width, so
 * the overlap between neighbours holds at every size. `cardWidth` is a
 * percentage of the stage. Together they keep the deck's total span inside the
 * page gutter: span = cardWidth × (1 + 2 × spread ÷ 100).
 */
const FAN = {
  base: { cardWidth: 34, spread: 90, aspect: "16 / 11" },
  md: { cardWidth: 24, spread: 112, aspect: "16 / 8" },
  lg: { cardWidth: 17, spread: 128, aspect: "16 / 6.5" },
} as const;

/** Arc shape, shared across breakpoints — outer cards dip and rotate further. */
const ARC = [
  { lift: 9, rotate: -11, depth: 0.5 },
  { lift: 1, rotate: -5.5, depth: 0.75 },
  { lift: -3, rotate: 0, depth: 1.15 },
  { lift: 1, rotate: 5.5, depth: 0.75 },
  { lift: 9, rotate: 11, depth: 0.5 },
];

function buildFan(spread: number): FanCard[] {
  const steps = [-1, -0.5, 0, 0.5, 1];
  return heroArtworks.map((artwork, index) => ({
    artwork,
    offset: steps[index] * spread,
    ...ARC[index],
  }));
}

/** Community handles, pinned to the outer edges of the fanned deck. */
const pills = [
  { handle: "@odalys", className: "left-[6%] top-[26%]", tone: "bg-ink text-paper", delay: 1.15 },
  { handle: "@ise.k", className: "right-[7%] top-[14%]", tone: "bg-cobalt text-white", delay: 1.3 },
  { handle: "@renzo", className: "left-[22%] bottom-[2%]", tone: "bg-coral text-white", delay: 1.45 },
];

export function HeroSection() {
  const breakpoint = useBreakpoint();
  const config = FAN[breakpoint];
  const fan = buildFan(config.spread);

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-26 md:pt-31"
    >
      <div className="shell">
        {/* Opening statement — centred, as in the reference composition. */}
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="type-label inline-flex items-center gap-2.5 text-muted"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-ember" />
            Independent art platform — est. 2021
          </motion.p>

          <RevealText
            as="h1"
            id="hero-heading"
            onLoad
            delay={0.2}
            className="type-hero mt-6"
            lines={[
              "A place to discover",
              ["what", "moves", { text: "culture.", accent: true }],
            ]}
          />
        </div>

        {/* Artwork deck — the same fan at every size, only the geometry changes. */}
        <div className="relative mt-10 md:mt-12 lg:mt-14">
          <div className="relative" style={{ aspectRatio: config.aspect }}>
            <FloatingCardStack cards={fan} cardWidth={config.cardWidth} />

            {pills.map((pill) => (
              <motion.span
                key={pill.handle}
                aria-hidden
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: pill.delay }}
                className={cn(
                  "absolute z-30 rounded-full px-2.5 py-1 text-[11px] font-medium shadow-[0_8px_20px_-8px_rgba(17,17,17,0.4)] sm:px-3.5 sm:py-1.5 sm:text-[13px]",
                  pill.tone,
                  pill.className,
                )}
              >
                {pill.handle}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Supporting copy, centred beneath the deck */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.95 }}
          className="mx-auto mt-10 max-w-lg text-center md:mt-12"
        >
          <p className="type-lead">
            Thirty thousand artists, one open archive, and an editorial team that actually goes to
            the openings. Start anywhere — the work will take you somewhere else.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href="#membership" variant="solid" size="lg">
              Join the platform
            </LinkButton>
            <LinkButton href="#collection" variant="outline" size="lg">
              Browse the archive
            </LinkButton>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.35 }}
          className="mt-14 flex items-center justify-between gap-6 border-t border-line py-6 md:py-7"
        >
          <a
            href="#showcase"
            className="group inline-flex items-center gap-3 text-sm text-muted transition-colors hover:text-ink"
          >
            <span className="inline-flex size-9 items-center justify-center rounded-full border border-ink/15 transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
              <ArrowDown aria-hidden className="size-4" strokeWidth={1.75} />
            </span>
            Scroll to explore
          </a>
          <p className="type-label hidden text-muted sm:block">
            30,412 works · 2,180 artists · 64 countries
          </p>
        </motion.div>
      </div>
    </section>
  );
}
