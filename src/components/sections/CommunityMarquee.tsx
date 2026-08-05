import { ArtworkMarquee } from "@/components/motion/ArtworkMarquee";
import { FadeUp } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { LinkButton } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { marqueeRowOne, marqueeRowTwo } from "@/data/artworks";

/**
 * Two counter-running artwork rows with the statement sitting between them.
 * Hovering either row pauses it, so a piece can be looked at properly.
 */
export function CommunityMarquee() {
  return (
    <section
      id="community"
      aria-labelledby="community-heading"
      className="scroll-mt-24 overflow-hidden py-20 md:py-28 lg:py-32"
    >
      <ArtworkMarquee items={marqueeRowOne} direction="left" duration={78} />

      <div className="shell my-12 text-center md:my-16">
        <FadeUp>
          <SectionLabel className="justify-center" dot="bg-lime">
            The community
          </SectionLabel>
          <RevealText
            as="h2"
            id="community-heading"
            className="type-h2 mx-auto mt-6 max-w-[15ch]"
            lines={["You will find yourself", ["among", { text: "us.", accent: true }]]}
          />
          <p className="type-lead mx-auto mt-6 max-w-lg">
            Painters, programmers, printers, people who mostly just look. Nobody has to justify
            which one they are.
          </p>
          <LinkButton href="#membership" variant="accent" size="lg" className="mt-8">
            Join the community
          </LinkButton>
        </FadeUp>
      </div>

      <ArtworkMarquee items={marqueeRowTwo} direction="right" duration={86} />
    </section>
  );
}
