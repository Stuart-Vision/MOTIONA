import { Asterisk, Sparkle, Star } from "lucide-react";

import { TextMarquee } from "@/components/motion/ArtworkMarquee";

const phrases = ["Inspired by people", "Made for culture", "Powered by imagination"];

/**
 * Full-bleed lime banner. Two rows run in opposite directions so the band reads
 * as movement rather than a single scrolling line.
 */
export function ManifestoMarquee() {
  return (
    <section aria-label="MOTIONA manifesto" className="overflow-hidden bg-lime py-12 md:py-16">
      <TextMarquee
        phrases={phrases}
        duration={40}
        separator={<Asterisk aria-hidden className="size-6 sm:size-8" strokeWidth={1.5} />}
        className="text-[2rem] font-medium leading-none tracking-tighter text-ink sm:text-[3rem] lg:text-[4rem]"
      />

      <TextMarquee
        phrases={phrases}
        direction="right"
        duration={52}
        separator={<Star aria-hidden className="size-4 sm:size-5" strokeWidth={1.75} />}
        className="mt-5 text-[1.25rem] font-medium leading-none tracking-tight text-ink/55 sm:mt-7 sm:text-[1.75rem]"
      />

      <div className="shell mt-10 flex items-center justify-center gap-2 sm:mt-12">
        <Sparkle aria-hidden className="size-4 text-ink/50" strokeWidth={1.75} />
        <p className="type-label text-ink/60">Independent since 2021 — and staying that way</p>
      </div>
    </section>
  );
}
