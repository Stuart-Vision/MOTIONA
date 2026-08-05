"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Artwork } from "@/types";

interface ArtworkMarqueeProps {
  items: Artwork[];
  direction?: "left" | "right";
  /** Seconds for one full loop. Larger is slower. */
  duration?: number;
  className?: string;
  itemClassName?: string;
  showCaption?: boolean;
}

/**
 * Seamless infinite artwork strip.
 *
 * The track holds the list twice and animates by exactly -50%, so the duplicate
 * arrives at the original's starting position and the loop has no seam. The
 * animation is pure CSS transform, which keeps it off the main thread and lets
 * `prefers-reduced-motion` disable it without any JavaScript branch.
 */
export function ArtworkMarquee({
  items,
  direction = "left",
  duration = 70,
  className,
  itemClassName,
  showCaption = false,
}: ArtworkMarqueeProps) {
  const sequence = [...items, ...items];

  return (
    <div className={cn("marquee-group relative w-full overflow-hidden edge-fade", className)}>
      <ul
        className="marquee-track gap-3 sm:gap-4"
        data-direction={direction}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {sequence.map((piece, index) => (
          <li
            key={`${piece.id}-${index}`}
            // The duplicate half is decorative repetition, not new content.
            aria-hidden={index >= items.length}
            className={cn(
              "relative shrink-0 overflow-hidden rounded-2xl bg-surface",
              piece.orientation === "square"
                ? "aspect-square w-40 sm:w-52"
                : piece.orientation === "landscape"
                  ? "aspect-8/5 w-52 sm:w-72"
                  : "aspect-3/4 w-36 sm:w-48",
              itemClassName,
            )}
          >
            <Image
              src={piece.image}
              alt={index < items.length ? `${piece.title} by ${piece.artist}` : ""}
              fill
              sizes="(max-width: 640px) 40vw, 18vw"
              className="object-cover"
              loading="lazy"
            />
            {showCaption ? (
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-3 text-[11px] font-medium text-white">
                {piece.title}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface TextMarqueeProps {
  /** One entry per phrase; separators are inserted between them. */
  phrases: string[];
  separator?: React.ReactNode;
  direction?: "left" | "right";
  duration?: number;
  className?: string;
  repeat?: number;
}

/** Word-based marquee used by the manifesto banner. */
export function TextMarquee({
  phrases,
  separator,
  direction = "left",
  duration = 34,
  className,
  repeat = 2,
}: TextMarqueeProps) {
  const single = Array.from({ length: repeat }, () => phrases).flat();
  const sequence = [...single, ...single];

  return (
    <div className={cn("marquee-group relative w-full overflow-hidden", className)}>
      <div
        className="marquee-track items-center"
        data-direction={direction}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {sequence.map((phrase, index) => (
          <span
            key={`${phrase}-${index}`}
            aria-hidden={index >= single.length}
            className="flex shrink-0 items-center gap-6 pr-6 sm:gap-10 sm:pr-10"
          >
            <span>{phrase}</span>
            <span aria-hidden className="shrink-0 opacity-80">
              {separator ?? "•"}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
