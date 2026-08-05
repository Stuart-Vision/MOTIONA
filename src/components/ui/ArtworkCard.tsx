import Image from "next/image";

import { aspectClass, cn } from "@/lib/utils";
import type { Artwork } from "@/types";

interface ArtworkCardProps {
  artwork: Artwork;
  className?: string;
  sizes?: string;
  /** Overrides the artwork's own orientation when a layout needs a set shape. */
  ratio?: keyof typeof aspectClass;
  showMeta?: boolean;
  priority?: boolean;
}

/**
 * Standard artwork tile: rounded plate, image zoom on hover, metadata that
 * fades up from the bottom edge.
 */
export function ArtworkCard({
  artwork,
  className,
  sizes = "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw",
  ratio,
  showMeta = true,
  priority = false,
}: ArtworkCardProps) {
  return (
    <figure className={cn("group relative", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.25rem] bg-surface sm:rounded-[1.5rem]",
          aspectClass[ratio ?? artwork.orientation],
        )}
      >
        <Image
          src={artwork.image}
          alt={`${artwork.title} by ${artwork.artist}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-900 ease-out-expo group-hover:scale-[1.06]"
        />

        {showMeta ? (
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-linear-to-t from-black/75 via-black/25 to-transparent p-4 opacity-0 transition-[opacity,transform] duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 sm:p-5">
            <span className="type-label text-white/70">{artwork.category}</span>
            <p className="mt-1.5 text-[15px] font-medium leading-tight text-white">{artwork.title}</p>
            <p className="type-meta text-white/70">
              {artwork.artist} · {artwork.year}
            </p>
          </figcaption>
        ) : null}
      </div>

      {showMeta ? (
        <div className="mt-3 flex items-baseline justify-between gap-3 sm:hidden">
          <p className="text-sm font-medium leading-tight">{artwork.title}</p>
          <p className="type-meta shrink-0 text-muted">{artwork.year}</p>
        </div>
      ) : null}
    </figure>
  );
}
