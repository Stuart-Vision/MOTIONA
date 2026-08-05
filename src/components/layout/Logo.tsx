import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Renders the mark only, for tight spaces. */
  markOnly?: boolean;
}

/**
 * MOTIONA wordmark. The mark is an abstract "M" drawn as two rising strokes —
 * a motion vector rather than a letter.
 */
export function Logo({ className, markOnly = false }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 32 32"
        aria-hidden
        className="size-7 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="9" className="fill-ink" />
        <path
          d="M7 23V10h3.6l5.4 8 5.4-8H25v13h-3.4v-7.4L16 23l-5.6-7.4V23z"
          className="fill-paper"
        />
      </svg>
      {markOnly ? null : (
        /* Tracking is the biggest contributor to the wordmark's width, so it
           tightens on narrow screens to keep the header on one line. */
        <span className="text-[13px] font-semibold uppercase tracking-[0.12em] sm:text-[15px] sm:tracking-[0.2em]">
          Motiona
        </span>
      )}
    </span>
  );
}
