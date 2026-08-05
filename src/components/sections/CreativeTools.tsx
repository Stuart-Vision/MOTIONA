"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Boxes,
  Fingerprint,
  Frame,
  MessagesSquare,
  Music4,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import { EASE } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { LinkButton } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { accentBackground, accentForeground, cn } from "@/lib/utils";
import { toolExperiences } from "@/data/articles";

const icons: Record<string, LucideIcon> = {
  "tl-ai": Wand2,
  "tl-collect": Boxes,
  "tl-music": Music4,
  "tl-identity": Fingerprint,
  "tl-social": MessagesSquare,
  "tl-exhibitions": Frame,
};

export function CreativeTools() {
  const [activeId, setActiveId] = useState(toolExperiences[0].id);
  const active = toolExperiences.find((tool) => tool.id === activeId) ?? toolExperiences[0];

  return (
    <section
      id="tools"
      aria-labelledby="tools-heading"
      className="scroll-mt-24 py-20 md:py-28 lg:py-32"
    >
      <div className="shell">
        <div className="max-w-2xl">
          <SectionLabel dot="bg-ochre">Tools &amp; experiences</SectionLabel>
          <RevealText
            as="h2"
            id="tools-heading"
            className="type-h2 mt-6 max-w-[15ch]"
            lines={["Six ways to work,", ["one", { text: "account.", accent: true }]]}
          />
        </div>

        {/* Application icon row */}
        <ul className="mt-10 flex flex-wrap items-center gap-2.5">
          {toolExperiences.map((tool) => {
            const Icon = icons[tool.id];
            return (
              <li key={`icon-${tool.id}`}>
                <span
                  aria-hidden
                  className={cn(
                    "inline-flex size-12 items-center justify-center rounded-[0.9rem] transition-transform duration-500 ease-out-expo",
                    accentBackground[tool.colour],
                    accentForeground(tool.colour),
                    activeId === tool.id ? "scale-110" : "scale-100 opacity-55",
                  )}
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
              </li>
            );
          })}
        </ul>

        {/* Category tabs — horizontally scrollable on narrow screens */}
        <div
          role="tablist"
          aria-label="Creative tools"
          className="no-scrollbar mt-7 flex gap-2 overflow-x-auto border-b border-line pb-4"
        >
          {toolExperiences.map((tool) => (
            <button
              key={tool.id}
              role="tab"
              type="button"
              id={`tool-tab-${tool.id}`}
              aria-selected={activeId === tool.id}
              aria-controls="tool-panel"
              onClick={() => setActiveId(tool.id)}
              className={cn(
                "relative h-10 shrink-0 rounded-full px-5 text-sm font-medium transition-colors duration-300",
                activeId === tool.id ? "text-paper" : "text-ink/60 hover:text-ink",
              )}
            >
              {activeId === tool.id ? (
                <motion.span
                  layoutId="tool-pill"
                  transition={{ type: "spring", stiffness: 340, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-ink"
                />
              ) : null}
              <span className="relative">{tool.name}</span>
            </button>
          ))}
        </div>

        <div id="tool-panel" role="tabpanel" aria-labelledby={`tool-tab-${active.id}`} className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-7"
            >
              <div
                className={cn(
                  "relative min-h-80 overflow-hidden rounded-[1.75rem] sm:min-h-105 lg:min-h-130",
                  accentBackground[active.colour],
                )}
              >
                <Image
                  src={active.image}
                  alt={`${active.name} — ${active.headline}`}
                  fill
                  sizes="(max-width: 1024px) 92vw, 55vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="type-label text-white/70">{active.name}</p>
                  <p className="mt-2 max-w-[22ch] text-2xl font-medium leading-[1.05] tracking-tight text-white sm:text-3xl">
                    {active.headline}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-8 rounded-[1.75rem] border border-line bg-white p-7 sm:p-9">
                <div>
                  <p className="type-lead text-ink/80">{active.description}</p>
                  <ul className="mt-7 flex flex-col gap-3">
                    {active.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-3 border-b border-line pb-3 text-sm">
                        <span aria-hidden className={cn("size-1.5 rounded-full", accentBackground[active.colour])} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <LinkButton href="#membership" variant="solid" size="lg" className="w-full sm:w-fit">
                  Open {active.name}
                </LinkButton>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
