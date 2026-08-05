import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { AccentColour } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Token-backed swatches so accents stay consistent across every section. */
export const accentBackground: Record<AccentColour, string> = {
  ember: "bg-ember",
  coral: "bg-coral",
  lime: "bg-lime",
  violet: "bg-violet",
  cobalt: "bg-cobalt",
  ochre: "bg-ochre",
  blush: "bg-blush",
  carbon: "bg-carbon",
};

export const accentText: Record<AccentColour, string> = {
  ember: "text-ember",
  coral: "text-coral",
  lime: "text-lime",
  violet: "text-violet",
  cobalt: "text-cobalt",
  ochre: "text-ochre",
  blush: "text-blush",
  carbon: "text-carbon",
};

/** Accents bright enough to need dark type on top. */
const LIGHT_ACCENTS: AccentColour[] = ["lime", "ochre", "blush"];

export function accentForeground(colour: AccentColour) {
  return LIGHT_ACCENTS.includes(colour) ? "text-ink" : "text-white";
}

export const aspectClass: Record<string, string> = {
  portrait: "aspect-3/4",
  square: "aspect-square",
  landscape: "aspect-8/5",
  tall: "aspect-2/3",
};

export function formatPrice(value: number) {
  return value === 0 ? "0" : value.toString();
}
