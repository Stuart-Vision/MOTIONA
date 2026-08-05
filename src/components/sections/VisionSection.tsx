"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Fingerprint,
  FlaskConical,
  Globe2,
  Palette,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import { EASE } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { LinkButton } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { artworks } from "@/data/artworks";
import { cn } from "@/lib/utils";

const pillars: { icon: LucideIcon; label: string }[] = [
  { icon: Palette, label: "Art" },
  { icon: Fingerprint, label: "Identity" },
  { icon: Globe2, label: "Culture" },
  { icon: Sparkles, label: "Technology" },
  { icon: Users, label: "Community" },
  { icon: FlaskConical, label: "Experimentation" },
];

type Mode = "business" | "personal";

const modes: Record<
  Mode,
  { label: string; caption: string; url: string; picks: string[] }
> = {
  business: {
    label: "Business",
    caption: "Studios, galleries and programmes running work as a team.",
    url: "motiona.studio/for-studios",
    // One wide lead plus two squares — fills the 2-column panel exactly.
    picks: ["aw-05", "aw-17", "aw-23"],
  },
  personal: {
    label: "Personal",
    caption: "One artist, one archive, one place to send people.",
    url: "motiona.studio/@odalys",
    picks: ["aw-09", "aw-03", "aw-30"],
  },
};

export function VisionSection() {
  const [mode, setMode] = useState<Mode>("business");
  const active = modes[mode];
  const cards = active.picks
    .map((id) => artworks.find((piece) => piece.id === id))
    .filter((piece): piece is (typeof artworks)[number] => Boolean(piece));

  return (
    <section
      id="vision"
      aria-labelledby="vision-heading"
      className="scroll-mt-24 bg-surface py-20 md:py-28 lg:py-32"
    >
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left: statement */}
          <div>
            <SectionLabel dot="bg-violet">Our vision</SectionLabel>
            <RevealText
              as="h2"
              id="vision-heading"
              className="type-h2 mt-6 max-w-[14ch]"
              lines={["Our vision for art", ["and", { text: "technology.", accent: true }]]}
            />
            <p className="type-lead mt-7 max-w-lg">
              Tools should widen what an artist can attempt and stay out of the credit. We build
              for the long archive — work that is still findable, attributable and paid for in
              twenty years, not just this quarter.
            </p>

            <LinkButton href="#journal" variant="solid" size="lg" className="mt-8">
              Read the manifesto
            </LinkButton>

            {/* Single column on the narrowest screens: "Experimentation" is one
                unbreakable word, and a two-column cell cannot contain it below
                ~380px without forcing the page wider. */}
            <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-5 min-[380px]:grid-cols-2 sm:grid-cols-3">
              {pillars.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-ink/12 bg-paper">
                    <Icon aria-hidden className="size-4.5 text-ember" strokeWidth={1.6} />
                  </span>
                  <span className="text-sm font-medium">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: browser-style panel */}
          <div>
            <div
              role="tablist"
              aria-label="Choose an account type"
              className="inline-flex rounded-full border border-ink/12 bg-paper p-1"
            >
              {(Object.keys(modes) as Mode[]).map((key) => (
                <button
                  key={key}
                  role="tab"
                  type="button"
                  id={`vision-tab-${key}`}
                  aria-selected={mode === key}
                  aria-controls="vision-panel"
                  onClick={() => setMode(key)}
                  className={cn(
                    "relative h-10 rounded-full px-6 text-sm font-medium transition-colors duration-300",
                    mode === key ? "text-paper" : "text-ink/65 hover:text-ink",
                  )}
                >
                  {mode === key ? (
                    <motion.span
                      layoutId="vision-pill"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-ink"
                    />
                  ) : null}
                  <span className="relative">{modes[key].label}</span>
                </button>
              ))}
            </div>

            <div
              id="vision-panel"
              role="tabpanel"
              aria-labelledby={`vision-tab-${mode}`}
              className="mt-6 overflow-hidden rounded-[1.5rem] bg-carbon p-2.5 shadow-[0_36px_80px_-40px_rgba(17,17,17,0.65)] sm:rounded-[1.75rem] sm:p-3"
            >
              {/* Chrome */}
              <div className="flex items-center gap-3 px-2 pb-3 pt-1">
                <span aria-hidden className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-white/25" />
                  <span className="size-2.5 rounded-full bg-white/25" />
                  <span className="size-2.5 rounded-full bg-white/25" />
                </span>
                <span className="min-w-0 flex-1 truncate rounded-full bg-white/8 px-3.5 py-1.5 text-[11px] text-white/55">
                  {active.url}
                </span>
              </div>

              <div className="rounded-[1.1rem] bg-paper p-4 sm:p-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <p className="type-meta text-muted">{active.caption}</p>

                    <ul className="mt-4 grid grid-cols-2 gap-3">
                      {cards.map((piece, index) => (
                        <motion.li
                          key={piece.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, ease: EASE, delay: index * 0.06 }}
                          className={cn(
                            "relative overflow-hidden rounded-xl bg-surface",
                            index === 0 ? "col-span-2 aspect-8/5" : "aspect-square",
                          )}
                        >
                          <Image
                            src={piece.image}
                            alt={`${piece.title} by ${piece.artist}`}
                            fill
                            sizes="(max-width: 1024px) 45vw, 22vw"
                            className="object-cover"
                          />
                          <span className="absolute bottom-2 left-2.5 rounded-full bg-paper/90 px-2.5 py-1 text-[11px] font-medium">
                            {piece.title}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
