import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { FadeUp, StaggerContainer } from "@/components/motion/FadeUp";
import { RevealText } from "@/components/motion/RevealText";
import { LinkButton } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { journalArticles } from "@/data/articles";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/motiona" },
  { label: "YouTube", href: "https://www.youtube.com/@motiona" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/motiona" },
];

export function JournalSection() {
  return (
    <section
      id="journal"
      aria-labelledby="journal-heading"
      className="scroll-mt-24 py-20 md:py-28 lg:py-32"
    >
      <div className="shell">
        <FadeUp>
          <SectionLabel dot="bg-blush">Journal</SectionLabel>
          <RevealText
            as="h2"
            id="journal-heading"
            className="type-h2 mt-6 max-w-[14ch]"
            lines={["Long reads from", ["inside", "the", { text: "studio.", accent: true }]]}
          />
        </FadeUp>

        <StaggerContainer as="ul" stagger={0.1} className="mt-12 grid gap-5 lg:grid-cols-2 lg:gap-6">
          {journalArticles.map((article) => (
            <FadeUp key={article.id} as="li" nested>
              <article className="group relative flex min-h-105 flex-col justify-end overflow-hidden rounded-[1.75rem] bg-carbon sm:min-h-130">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="object-cover transition-transform duration-1200 ease-out-expo group-hover:scale-[1.06]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/5"
                />

                <div className="relative p-7 sm:p-9">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="type-label rounded-full bg-white/15 px-3 py-1.5 text-white backdrop-blur-sm">
                      {article.category}
                    </span>
                    <span className="type-meta text-white/70">
                      {article.published} · {article.readingTime}
                    </span>
                  </div>

                  <h3 className="mt-5 max-w-[16ch] text-[1.85rem] font-medium leading-[1.04] tracking-tight text-white sm:text-[2.4rem]">
                    {article.title}
                  </h3>
                  <p className="mt-4 max-w-[48ch] text-sm leading-relaxed text-white/75">
                    {article.excerpt}
                  </p>

                  <span className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-white/30 py-2.5 pl-5 pr-2.5 text-sm font-medium text-white transition-colors duration-400 group-hover:bg-white group-hover:text-ink">
                    Read story
                    <span className="inline-flex size-7 items-center justify-center rounded-full bg-white/15 transition-colors duration-400 group-hover:bg-ink/10">
                      <ArrowUpRight
                        aria-hidden
                        strokeWidth={1.75}
                        className="size-3.5 transition-transform duration-400 ease-out-expo group-hover:rotate-45"
                      />
                    </span>
                  </span>
                </div>

                <a href={`#journal`} className="absolute inset-0 z-10">
                  <span className="sr-only">{`Read story: ${article.title}`}</span>
                </a>
              </article>
            </FadeUp>
          ))}
        </StaggerContainer>

        {/* Platform note */}
        <div className="mt-16 grid gap-8 border-t border-line pt-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <FadeUp>
            <h3 className="type-h3 max-w-[12ch]">Our platform. Your art.</h3>
          </FadeUp>
          <FadeUp delay={0.08}>
            <p className="type-lead max-w-xl">
              MOTIONA takes no cut of a direct sale and claims no licence over anything you upload.
              We make money from memberships, and that is the whole business model. If you want the
              longer version, it is in the journal — including the parts we are still working out.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <LinkButton href="#membership" variant="solid" size="md">
                Start publishing
              </LinkButton>
              <ul className="flex flex-wrap items-center gap-4">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="type-meta text-ink/70 underline-offset-4 transition-colors hover:text-ember hover:underline"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
