"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Drives page scrolling through Lenis and takes over in-page anchor jumps so
 * `#section` links glide instead of teleporting. Skipped entirely when the
 * visitor prefers reduced motion, which leaves native scrolling in place.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch devices already have good native inertia; overriding it feels worse.
      syncTouch: false,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -88, duration: 1.2 });
      // Keep the URL and focus in sync so keyboard and screen-reader users land too.
      window.history.replaceState(null, "", id);
      (target as HTMLElement).setAttribute("tabindex", "-1");
      (target as HTMLElement).focus({ preventScroll: true });
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
