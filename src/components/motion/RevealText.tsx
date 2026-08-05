"use client";

import { motion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

/** A word, optionally rendered in the accent colour once it lands. */
export type RevealToken = string | { text: string; accent?: boolean };

const TONE = {
  dark: { settled: "#111111", accent: "#FF5A1F", pending: "#C6C6C0" },
  light: { settled: "#F7F7F4", accent: "#DFFF3F", pending: "rgba(247,247,244,0.35)" },
} as const;

interface RevealTextProps {
  /**
   * One entry per visual line. A plain string is split on spaces; pass tokens
   * explicitly when a word needs the accent colour.
   */
  lines: (RevealToken[] | string)[];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  tone?: keyof typeof TONE;
  delay?: number;
  /** Play immediately instead of waiting for the line to scroll into view. */
  onLoad?: boolean;
  id?: string;
}

/**
 * Word-by-word heading reveal.
 *
 * Each word starts pale and settles to its final colour as it rises the last
 * fraction of a line, so a heading reads as being written rather than faded in.
 * Colour is animated per word rather than through a class, which lets accent
 * words settle to a different value in the same pass.
 */
export function RevealText({
  lines,
  className,
  as: Tag = "h2",
  tone = "dark",
  delay = 0,
  onLoad = false,
  id,
}: RevealTextProps) {
  const palette = TONE[tone];

  const tokenLines = lines.map<RevealToken[]>((line) =>
    typeof line === "string" ? line.split(" ") : line,
  );

  // Words carry a running index across the whole heading — not restarted per
  // line — so the reveal reads as one continuous sweep. Headings are a handful
  // of words, so summing the preceding lines per word is cheaper than the
  // bookkeeping needed to avoid it.
  const normalised = tokenLines.map((tokens, lineIndex) => {
    const lineStart = tokenLines
      .slice(0, lineIndex)
      .reduce((sum, previous) => sum + previous.length, 0);

    return tokens.map((token, tokenIndex) => {
      const isObject = typeof token !== "string";
      return {
        text: isObject ? token.text : token,
        settled: isObject && token.accent ? palette.accent : palette.settled,
        order: lineStart + tokenIndex,
      };
    });
  });

  const trigger = onLoad
    ? { animate: "visible" as const }
    : {
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-12% 0px -12% 0px" },
      };

  return (
    <Tag id={id} className={cn(className)}>
      <motion.span
        className="block"
        initial="hidden"
        variants={{ hidden: {}, visible: { transition: { delayChildren: delay } } }}
        {...trigger}
      >
        {normalised.map((line, lineIndex) => (
          <span key={lineIndex} className="block">
            {line.map((word, tokenIndex) => {
              const variants: Variants = {
                hidden: { color: palette.pending, y: "0.14em", opacity: 0.25 },
                visible: {
                  color: word.settled,
                  y: "0em",
                  opacity: 1,
                  transition: {
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                    delay: word.order * 0.055,
                  },
                },
              };

              return (
                <motion.span
                  key={`${word.text}-${tokenIndex}`}
                  variants={variants}
                  className="inline-block"
                >
                  {word.text}
                  {tokenIndex < line.length - 1 ? " " : ""}
                </motion.span>
              );
            })}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

/** Lighter body-copy variant — opacity and lift only, no colour shift. */
export function WordReveal({ text, className, delay = 0 }: WordRevealProps) {
  const words = text.split(" ");

  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15% 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.018, delayChildren: delay } },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
          }}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
