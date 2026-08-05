"use client";

import { Menu, Search, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { cn } from "@/lib/utils";
import { primaryNav } from "@/data/navigation";

/**
 * Slim sticky header. It sits transparent over the hero and picks up a paper
 * background plus a hairline once the page has scrolled past the fold marker.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <ScrollProgress />

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-out-expo",
          scrolled
            ? "border-b border-line bg-paper/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="shell flex h-17 items-center justify-between gap-6 md:h-19">
          <a href="#hero" aria-label="MOTIONA home" className="shrink-0">
            <Logo />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group relative inline-flex h-9 items-center rounded-full px-3.5 text-sm text-ink/80 transition-colors hover:text-ink"
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-ink transition-transform duration-400 ease-out-expo group-hover:scale-x-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Search artists and artworks"
              className="inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/6"
            >
              <Search aria-hidden className="size-4.5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              aria-label="Your account"
              className="hidden size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/6 sm:inline-flex"
            >
              <UserRound aria-hidden className="size-4.5" strokeWidth={1.75} />
            </button>

            <a
              href="#membership"
              className="ml-1 hidden h-10 items-center rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-ember lg:inline-flex"
            >
              Join
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              className="ml-1 inline-flex size-10 items-center justify-center rounded-full border border-ink/15 transition-colors hover:bg-ink hover:text-paper lg:hidden"
            >
              <Menu aria-hidden className="size-4.5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
