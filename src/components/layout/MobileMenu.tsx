"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import { EASE } from "@/components/motion/FadeUp";
import { Logo } from "./Logo";
import { LinkButton } from "@/components/ui/Button";
import { primaryNav } from "@/data/navigation";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Full-screen navigation panel.
 *
 * Behaves as a modal dialog: focus is moved in on open, Escape closes it, Tab is
 * trapped inside the panel, and page scrolling is locked while it is up.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      restoreFocusTo.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-70 flex flex-col bg-paper lg:hidden"
        >
          <div className="flex items-center justify-between px-5 py-5">
            <Logo />
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="inline-flex size-11 items-center justify-center rounded-full border border-ink/15 transition-colors hover:bg-ink hover:text-paper"
            >
              <X aria-hidden className="size-5" strokeWidth={1.75} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 pb-8 pt-4">
            <ul className="flex flex-col">
              {primaryNav.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.06 + index * 0.055 }}
                  className="border-b border-line"
                >
                  <a
                    href={item.href}
                    onClick={onClose}
                    className="flex items-baseline gap-4 py-5 text-[2rem] font-medium tracking-tighter transition-colors hover:text-ember"
                  >
                    <span className="type-label w-7 shrink-0 text-muted">
                      0{index + 1}
                    </span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.36 }}
              className="mt-9 flex flex-col gap-3"
            >
              <LinkButton href="#membership" variant="accent" size="lg" onClick={onClose}>
                Join MOTIONA
              </LinkButton>
              <LinkButton href="#artist" variant="outline" size="lg" onClick={onClose}>
                Explore artists
              </LinkButton>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.46 }}
              className="type-meta mt-9 max-w-[34ch] text-muted"
            >
              A place where art, identity and technology connect.
            </motion.p>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
