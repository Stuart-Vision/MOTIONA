import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { FadeUp, StaggerContainer } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { accentBackground, accentForeground, cn } from "@/lib/utils";
import { editorialEntries } from "@/data/articles";
import type { EditorialEntry } from "@/types";

/** Column and row spans per card shape, collapsing to a single column on mobile. */
const spans: Record<EditorialEntry["variant"], string> = {
  feature: "md:col-span-7 md:row-span-2",
  portrait: "md:col-span-5",
  dark: "md:col-span-5",
  landscape: "md:col-span-7",
  quote: "md:col-span-5",
};

export function EditorialGrid() {
  return (
    <section
      id="editorial"
      aria-labelledby="editorial-heading"
      className="scroll-mt-24 py-20 md:py-28 lg:py-32"
    >
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <FadeUp>
            <SectionLabel dot="bg-cobalt">Exhibitions &amp; stories</SectionLabel>
            <RevealText
              as="h2"
              id="editorial-heading"
              className="type-h2 mt-6 max-w-[13ch]"
              lines={["What we are", ["looking", "at", { text: "right", accent: true }, "now."]]}
            />
          </FadeUp>
          <FadeUp delay={0.08}>
            <p className="type-meta max-w-xs text-muted">
              Updated every Thursday. Written by people who saw the work in person.
            </p>
          </FadeUp>
        </div>

        <StaggerContainer
          as="ul"
          stagger={0.07}
          className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5"
        >
          {editorialEntries.map((entry) => (
            <FadeUp key={entry.id} as="li" nested className={cn("col-span-1", spans[entry.variant])}>
              <EditorialCard entry={entry} />
            </FadeUp>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function EditorialCard({ entry }: { entry: EditorialEntry }) {
  const isQuote = entry.variant === "quote";
  const isDark = entry.variant === "dark";
  const hasImage = Boolean(entry.image);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col justify-end overflow-hidden rounded-[1.5rem] transition-[transform,box-shadow] duration-700 ease-out-expo hover:-translate-y-1 md:rounded-[1.75rem]",
        hasImage && "min-h-75 bg-carbon md:min-h-85",
        entry.variant === "feature" && "md:min-h-140",
        isDark && "min-h-75 bg-carbon text-white",
        isQuote && cn("min-h-75", accentBackground[entry.colour], accentForeground(entry.colour)),
      )}
    >
      {hasImage ? (
        <>
          <Image
            src={entry.image as string}
            alt=""
            fill
            sizes="(max-width: 768px) 92vw, (max-width: 1280px) 50vw, 40vw"
            className="object-cover transition-transform duration-1100 ease-out-expo group-hover:scale-[1.05]"
          />
          {/* Weighted toward the lower half where the type sits — pale artwork
              would otherwise drop the white text below AA contrast. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-black/88 via-black/55 to-black/15"
          />
        </>
      ) : null}

      <div
        className={cn(
          "relative flex flex-col gap-4 p-6 sm:p-8",
          hasImage && "text-white",
          isQuote && "flex-1 justify-between",
        )}
      >
        <span
          className={cn(
            "type-label w-fit rounded-full px-3 py-1.5",
            hasImage || isDark
              ? "bg-white/15 text-white backdrop-blur-sm"
              : "bg-ink/8 text-ink/70",
          )}
        >
          {entry.category}
        </span>

        <div>
          <h3
            className={cn(
              "font-medium tracking-tight transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5",
              isQuote
                ? "text-[1.75rem] leading-[1.05] sm:text-[2.25rem]"
                : entry.variant === "feature"
                  ? "text-[1.75rem] leading-[1.05] sm:text-[2.5rem]"
                  : "text-2xl leading-[1.08]",
            )}
          >
            {entry.title}
          </h3>
          {entry.excerpt ? (
            <p
              className={cn(
                "mt-3 max-w-[46ch] text-sm leading-relaxed",
                hasImage || isDark ? "text-white/75" : isQuote ? "text-ink/70" : "text-muted",
              )}
            >
              {entry.excerpt}
            </p>
          ) : null}
        </div>

        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="type-label opacity-70">Read</span>
          <span
            className={cn(
              "inline-flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-400",
              hasImage || isDark
                ? "border-white/30 text-white group-hover:bg-white group-hover:text-ink"
                : "border-ink/20 text-ink group-hover:bg-ink group-hover:text-paper",
            )}
          >
            <ArrowUpRight
              aria-hidden
              strokeWidth={1.75}
              className="size-4 transition-transform duration-400 ease-out-expo group-hover:rotate-45"
            />
          </span>
        </div>
      </div>

      {/* One link covers the card so the whole surface is a single target. */}
      <a href="#journal" className="absolute inset-0 z-10">
        <span className="sr-only">{`Read: ${entry.title}`}</span>
      </a>
    </article>
  );
}
