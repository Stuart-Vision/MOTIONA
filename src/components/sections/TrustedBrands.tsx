import { FadeUp, StaggerContainer } from "@/components/motion/FadeUp";
import { partners } from "@/data/artists";

/**
 * Partner strip. On small screens the row becomes a marquee so all eight names
 * stay legible; from `sm` up it settles into a static grid that fades in.
 */
export function TrustedBrands() {
  return (
    <section id="partners" aria-labelledby="partners-heading" className="scroll-mt-24 py-12 md:py-16">
      <div className="shell">
        <div className="border-y border-line py-9 md:py-11">
          <FadeUp>
            <h2 id="partners-heading" className="type-label text-center text-muted">
              Trusted by the best — institutions, studios and independent programmes
            </h2>
          </FadeUp>

          {/* Mobile: continuous marquee */}
          <div className="marquee-group edge-fade mt-7 overflow-hidden sm:hidden">
            <div className="marquee-track items-center" style={{ "--marquee-duration": "38s" } as React.CSSProperties}>
              {[...partners, ...partners].map((name, index) => (
                <span
                  key={`${name}-${index}`}
                  aria-hidden={index >= partners.length}
                  className="shrink-0 px-6 text-xl font-medium tracking-tight text-ink/45"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Tablet and up: static grid */}
          <StaggerContainer
            as="ul"
            stagger={0.06}
            className="mt-8 hidden grid-cols-4 items-center gap-y-7 sm:grid lg:grid-cols-8"
          >
            {partners.map((name) => (
              <FadeUp key={name} as="li" nested className="text-center">
                <span className="text-lg font-medium tracking-tight text-ink/45 transition-colors duration-500 hover:text-ink lg:text-xl">
                  {name}
                </span>
              </FadeUp>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
