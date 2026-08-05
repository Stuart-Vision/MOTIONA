"use client";

import { ArrowRight, Check, Globe } from "lucide-react";
import { useState } from "react";

import { ArrowButton } from "@/components/ui/ArrowButton";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { footerColumns, languages, type Language } from "@/data/navigation";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/motiona" },
  { label: "YouTube", href: "https://www.youtube.com/@motiona" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/motiona" },
  { label: "RSS", href: "/rss.xml" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done">("idle");
  const [language, setLanguage] = useState<Language>("English");

  /**
   * There is no backend in this build, so the form validates natively and
   * confirms locally rather than pretending to reach a mailing list.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    setStatus("done");
    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="legal" className="bg-paper pb-10 pt-20 md:pt-28">
      <div className="shell">
        <div className="grid gap-12 border-t border-line pt-12 lg:grid-cols-[1.15fr_2fr] lg:gap-16">
          {/* Brand summary + newsletter */}
          <div className="max-w-md">
            <Logo />
            <p className="type-lead mt-5">
              MOTIONA is an independent platform for artist-led culture. We publish, exhibit and
              pay the people making the work — and we keep the archive open.
            </p>

            <form onSubmit={handleSubmit} className="mt-8">
              <label htmlFor="footer-email" className="type-label text-muted">
                Monthly dispatch
              </label>
              <div className="mt-3 flex items-center gap-2 rounded-full border border-ink/15 p-1.5 transition-colors focus-within:border-ink">
                <input
                  id="footer-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (status === "done") setStatus("idle");
                  }}
                  placeholder="you@studio.com"
                  className="h-10 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to the monthly dispatch"
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-ember"
                >
                  <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
                </button>
              </div>
              <p
                role="status"
                className={cn(
                  "type-meta mt-2.5 flex items-center gap-1.5 transition-opacity duration-300",
                  status === "done" ? "text-ink opacity-100" : "text-muted opacity-70",
                )}
              >
                {status === "done" ? (
                  <>
                    <Check aria-hidden className="size-3.5 text-ember" strokeWidth={2.5} />
                    Thanks — you are on the list.
                  </>
                ) : (
                  "One email a month. No sponsorships, no resale."
                )}
              </p>
            </form>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="type-label text-muted">{column.title}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <a
                        href={link.href}
                        className="text-sm text-ink/75 transition-colors hover:text-ember"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Baseline */}
        <div className="mt-14 flex flex-col gap-6 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className="type-meta text-muted">
              © {new Date().getFullYear()} MOTIONA. All work belongs to its makers.
            </p>
            <ul className="flex flex-wrap items-center gap-4">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="type-meta text-ink/70 underline-offset-4 transition-colors hover:text-ember hover:underline"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-ink/12 py-1.5 pl-3.5 pr-2">
              <Globe aria-hidden className="size-3.5 text-muted" strokeWidth={1.75} />
              <label htmlFor="footer-language" className="sr-only">
                Language
              </label>
              <select
                id="footer-language"
                value={language}
                onChange={(event) => setLanguage(event.target.value as Language)}
                className="cursor-pointer bg-transparent pr-1 text-[13px] outline-none"
              >
                {languages.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <ArrowButton direction="up" label="Back to top" onClick={scrollToTop} size="sm" />
          </div>
        </div>
      </div>
    </footer>
  );
}
