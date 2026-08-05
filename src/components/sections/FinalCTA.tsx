"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { EASE } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { LinkButton } from "@/components/ui/Button";
import { artworks } from "@/data/artworks";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Four fragments drifting behind the statement — decorative only. */
const fragments = [
  { id: "aw-02", className: "left-[3%] top-[12%] w-[16%] sm:w-[13%]", rotate: -9, depth: 40 },
  { id: "aw-19", className: "right-[4%] top-[8%] w-[18%] sm:w-[14%]", rotate: 7, depth: -55 },
  { id: "aw-26", className: "bottom-[8%] left-[8%] w-[14%] sm:w-[11%]", rotate: 5, depth: -35 },
  { id: "aw-13", className: "bottom-[14%] right-[7%] w-[15%] sm:w-[12%]", rotate: -6, depth: 48 },
];

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section
      ref={ref}
      id="join"
      aria-labelledby="join-heading"
      className="relative scroll-mt-24 overflow-hidden py-24 md:py-32 lg:py-40"
    >
      {/* Drifting artwork fragments */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {fragments.map((fragment) => {
          const piece = artworks.find((item) => item.id === fragment.id);
          if (!piece) return null;
          return (
            <Fragment
              key={fragment.id}
              className={fragment.className}
              rotate={fragment.rotate}
              depth={reduced ? 0 : fragment.depth}
              progress={scrollYProgress}
              src={piece.image}
            />
          );
        })}
      </div>

      <div className="shell relative">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="type-label flex items-center justify-center gap-2.5 text-muted"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-ember" />
            Open to everyone
          </motion.p>

          <RevealText
            as="h2"
            id="join-heading"
            className="type-display mt-7"
            lines={["Create what the", ["world", "has", { text: "not", accent: true }], "seen yet."]}
          />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <LinkButton href="#membership" variant="accent" size="lg">
              Join the platform
            </LinkButton>
            <LinkButton href="#artist" variant="outline" size="lg">
              Explore artists
            </LinkButton>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="type-meta mt-7 text-muted"
          >
            Free to start · No commission on direct sales · Export your archive at any time
          </motion.p>
        </div>
      </div>
    </section>
  );
}

interface FragmentProps {
  className: string;
  rotate: number;
  depth: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  src: string;
}

function Fragment({ className, rotate, depth, progress, src }: FragmentProps) {
  const y = useTransform(progress, [0, 1], [depth, -depth]);

  return (
    <motion.div
      style={{ y, rotate }}
      className={`absolute aspect-3/4 overflow-hidden rounded-2xl bg-surface opacity-[0.55] ${className}`}
    >
      <Image src={src} alt="" fill sizes="16vw" className="object-cover" />
    </motion.div>
  );
}
