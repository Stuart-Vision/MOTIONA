import { FadeUp, StaggerContainer } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { ArtworkCard } from "@/components/ui/ArtworkCard";
import { LinkButton } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { collageArtworks } from "@/data/artworks";
import { cn } from "@/lib/utils";

/**
 * Deliberately uneven placement — column span, row offset and a small tilt per
 * tile — so the section reads as a curated spread rather than a product grid.
 */
const placement = [
  { span: "md:col-span-5", offset: "md:mt-0", tilt: "rotate-[-1.2deg]", ratio: "portrait" },
  { span: "md:col-span-4", offset: "md:mt-16", tilt: "rotate-[0.8deg]", ratio: "square" },
  { span: "md:col-span-3", offset: "md:mt-6", tilt: "rotate-[-0.6deg]", ratio: "tall" },
  { span: "md:col-span-4", offset: "md:-mt-8", tilt: "rotate-1", ratio: "square" },
  { span: "md:col-span-5", offset: "md:mt-10", tilt: "rotate-[-0.9deg]", ratio: "landscape" },
  { span: "md:col-span-3", offset: "md:mt-2", tilt: "rotate-[1.4deg]", ratio: "portrait" },
  { span: "md:col-span-4", offset: "md:mt-12", tilt: "-rotate-1", ratio: "tall" },
  { span: "md:col-span-3", offset: "md:-mt-4", tilt: "rotate-[0.7deg]", ratio: "square" },
  { span: "md:col-span-5", offset: "md:mt-8", tilt: "rotate-[-0.5deg]", ratio: "landscape" },
] as const;

export function CollectionCollage() {
  return (
    <section
      id="collection"
      aria-labelledby="collection-heading"
      className="scroll-mt-24 py-20 md:py-28 lg:py-32"
    >
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <FadeUp>
            <SectionLabel dot="bg-coral">Curated</SectionLabel>
            <RevealText
              as="h2"
              id="collection-heading"
              className="type-h2 mt-6 max-w-[16ch]"
              lines={["All good things begin", ["with", "a", { text: "point", accent: true }, "of", "view."]]}
            />
          </FadeUp>

          <FadeUp delay={0.1} className="lg:pb-2">
            <p className="type-lead max-w-md">
              Nine pieces chosen this month by our editors and three guest curators. Sequenced to
              be read in order, though nobody will know if you don&apos;t.
            </p>
            <LinkButton href="#editorial" variant="outline" size="md" className="mt-6">
              See every collection
            </LinkButton>
          </FadeUp>
        </div>

        <StaggerContainer
          as="ul"
          stagger={0.07}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-12 md:gap-6"
        >
          {collageArtworks.map((piece, index) => {
            const spec = placement[index];
            return (
              <FadeUp
                key={piece.id}
                as="li"
                nested
                className={cn("sm:col-span-1", spec.span, spec.offset)}
              >
                {/* The tilt normalises to zero on hover, which makes the whole
                    collage feel like it snaps to attention under the cursor. */}
                <div
                  className={cn(
                    "transition-transform duration-800 ease-out-expo md:hover:rotate-0",
                    spec.tilt,
                  )}
                >
                  <ArtworkCard
                    artwork={piece}
                    ratio={spec.ratio}
                    sizes="(max-width: 640px) 92vw, (max-width: 768px) 46vw, 32vw"
                  />
                </div>
              </FadeUp>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
