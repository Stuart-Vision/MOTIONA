"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, MapPin, Plus } from "lucide-react";
import { useState } from "react";

import { EASE } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { Button, LinkButton } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { artworks } from "@/data/artworks";
import { featuredArtist } from "@/data/artists";
import { cn } from "@/lib/utils";

const selected = featuredArtist.selectedWorks
  .map((id) => artworks.find((piece) => piece.id === id))
  .filter((piece): piece is (typeof artworks)[number] => Boolean(piece));

const stats = [
  { label: "Works", value: featuredArtist.works },
  { label: "Followers", value: featuredArtist.followers },
  { label: "Exhibitions", value: featuredArtist.exhibitions },
];

export function ArtistFeature() {
  const [following, setFollowing] = useState(false);

  return (
    <section
      id="artist"
      aria-labelledby="artist-heading"
      className="scroll-mt-24 py-20 md:py-28 lg:py-32"
    >
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Portrait — sticks alongside the copy on tall screens. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.div
              initial={{ clipPath: "inset(14% 8% 14% 8% round 1.75rem)", opacity: 0 }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0% round 1.75rem)", opacity: 1 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1.05, ease: EASE }}
              className="relative aspect-4/5 overflow-hidden rounded-[1.75rem] bg-ember p-2 sm:p-2.5"
            >
              {/* The ember plate is inset rather than blended, so it frames the
                  portrait instead of tinting it. */}
              <div className="relative size-full overflow-hidden rounded-[1.25rem]">
                <Image
                  src={featuredArtist.coverImage}
                  alt={`${featuredArtist.name}, ${featuredArtist.discipline}`}
                  fill
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="object-cover"
                />
              </div>
            </motion.div>

            <div className="mt-4 flex items-center gap-3">
              <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-surface">
                <Image
                  src={featuredArtist.avatar}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </span>
              <p className="type-meta text-muted">
                Artist of the month, chosen by the MOTIONA editorial team.
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <SectionLabel dot="bg-ember">Featured artist</SectionLabel>

            <RevealText
              as="h2"
              id="artist-heading"
              className="type-h2 mt-6"
              lines={[featuredArtist.name]}
            />

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="rounded-full bg-ink/6 px-3.5 py-1.5 text-[13px] font-medium">
                {featuredArtist.discipline}
              </span>
              <span className="type-meta inline-flex items-center gap-1.5 text-muted">
                <MapPin aria-hidden className="size-3.5" strokeWidth={1.75} />
                {featuredArtist.location}
              </span>
            </div>

            <p className="type-lead mt-7 max-w-[52ch]">{featuredArtist.bio}</p>

            <dl className="mt-9 grid grid-cols-3 gap-4 border-y border-line py-7">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="type-label text-muted">{stat.label}</dt>
                  <dd className="mt-2 text-[1.75rem] font-medium leading-none tracking-tight tabular-nums">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                variant={following ? "outline" : "accent"}
                size="lg"
                onClick={() => setFollowing((current) => !current)}
                aria-pressed={following}
                className="min-w-37"
              >
                {following ? (
                  <>
                    <Check aria-hidden className="size-4" strokeWidth={2.25} />
                    Following
                  </>
                ) : (
                  <>
                    <Plus aria-hidden className="size-4" strokeWidth={2.25} />
                    Follow
                  </>
                )}
              </Button>
              <LinkButton href="#collection" variant="outline" size="lg">
                View profile
              </LinkButton>
            </div>

            <div className="mt-12">
              <h3 className="type-label text-muted">Selected works</h3>
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {selected.map((piece, index) => (
                  <motion.li
                    key={piece.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{ duration: 0.6, ease: EASE, delay: index * 0.07 }}
                    className="group"
                  >
                    <span
                      className={cn(
                        "relative block aspect-3/4 overflow-hidden rounded-xl bg-surface",
                      )}
                    >
                      <Image
                        src={piece.image}
                        alt={`${piece.title}, ${piece.year}`}
                        fill
                        sizes="(max-width: 640px) 44vw, 12vw"
                        className="object-cover transition-transform duration-900 ease-out-expo group-hover:scale-105"
                      />
                    </span>
                    <p className="mt-2 truncate text-[13px] font-medium">{piece.title}</p>
                    <p className="type-meta text-muted">{piece.year}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
