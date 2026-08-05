"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { EASE } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { LinkButton } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { accentBackground, cn } from "@/lib/utils";
import { artists } from "@/data/artists";

/** Three ways in, each fronted by a working artist. */
const slides = [
  {
    id: "gw-01",
    kicker: "For artists",
    title: "Publish a practice, not a portfolio",
    body: "Upload the finished piece and the six that led to it. Studios, curators and writers can follow the whole line of thinking.",
    artist: artists[0],
    colour: "coral" as const,
  },
  {
    id: "gw-02",
    kicker: "For collectors",
    title: "Buy from the person who made it",
    body: "Every listing links to the artist, the edition and the terms. No intermediary marks it up on the way to you.",
    artist: artists[3],
    colour: "ember" as const,
  },
  {
    id: "gw-03",
    kicker: "For curators",
    title: "Programme a room in an afternoon",
    body: "Assemble works from across the archive, invite collaborators, and open the show online or in a physical space.",
    artist: artists[2],
    colour: "cobalt" as const,
  },
];

export function GatewaySection() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const slide = slides[index];

  const go = (step: number) => {
    setDirection(step);
    setIndex((current) => (current + step + slides.length) % slides.length);
  };

  return (
    <section
      id="gateway"
      aria-labelledby="gateway-heading"
      className="scroll-mt-24 py-16 md:py-24 lg:py-28"
    >
      <div className="shell">
        <div className="overflow-hidden rounded-[1.75rem] border border-line bg-white md:rounded-[2.25rem]">
          <div className="grid lg:grid-cols-[1.05fr_1fr]">
            {/* Copy */}
            <div className="flex flex-col justify-between gap-10 p-7 sm:p-10 lg:p-14">
              <div>
                <SectionLabel>{slide.kicker}</SectionLabel>

                <RevealText
                  as="h2"
                  id="gateway-heading"
                  className="type-h2 mt-6 max-w-[13ch]"
                  lines={["Gateway to", ["artist-led", { text: "culture.", accent: true }]]}
                />

                <div className="mt-8 min-h-42 sm:min-h-38">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={slide.id}
                      custom={direction}
                      initial={{ opacity: 0, x: direction * 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: direction * -24 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <h3 className="type-h3 max-w-[18ch]">{slide.title}</h3>
                      <p className="type-lead mt-4 max-w-[46ch]">{slide.body}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-6">
                <LinkButton href="#collection" variant="solid" size="lg">
                  Explore
                </LinkButton>

                <div className="flex items-center gap-4">
                  {/* Slide counter doubles as the live region for the control pair. */}
                  <p aria-live="polite" className="type-label tabular-nums text-muted">
                    <span className="text-ink">{String(index + 1).padStart(2, "0")}</span>
                    <span className="mx-1.5">/</span>
                    {String(slides.length).padStart(2, "0")}
                  </p>
                  <div className="flex items-center gap-2">
                    <ArrowButton direction="left" label="Previous entry point" onClick={() => go(-1)} />
                    <ArrowButton direction="right" label="Next entry point" onClick={() => go(1)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Portrait */}
            <div
              className={cn(
                "relative min-h-95 overflow-hidden transition-colors duration-700 sm:min-h-115 lg:min-h-140",
                accentBackground[slide.colour],
              )}
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, scale: 1.06, x: 40 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 1.02, x: -30 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Image
                    src={slide.artist.coverImage}
                    alt={`${slide.artist.name}, ${slide.artist.discipline}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Vertical progress indicator. The visible bar stays hairline
                  thin, but each control carries padding so the tap target is a
                  usable size on touch. */}
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col sm:right-4">
                {slides.map((item, itemIndex) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setDirection(itemIndex > index ? 1 : -1);
                      setIndex(itemIndex);
                    }}
                    aria-label={`Show ${item.kicker}`}
                    aria-current={itemIndex === index}
                    className="group flex w-11 items-center justify-center py-2.5"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "w-1 rounded-full bg-white transition-[height,opacity] duration-500",
                        itemIndex === index
                          ? "h-9 opacity-100"
                          : "h-4 opacity-45 group-hover:opacity-75",
                      )}
                    />
                  </button>
                ))}
              </div>

              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-linear-to-t from-black/55 to-transparent p-6 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:p-8">
                <div className="text-white">
                  <p className="text-lg font-medium leading-tight">{slide.artist.name}</p>
                  <p className="type-meta text-white/80">{slide.artist.location}</p>
                </div>
                <p className="type-label text-white/70">{slide.artist.discipline}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
