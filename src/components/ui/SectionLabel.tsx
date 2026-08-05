import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  /** Dot colour class, e.g. `bg-ember`. */
  dot?: string;
}

/** Small uppercase eyebrow used to open most sections. */
export function SectionLabel({ children, className, dot = "bg-ember" }: SectionLabelProps) {
  return (
    <span className={cn("type-label inline-flex items-center gap-2 text-muted", className)}>
      <span aria-hidden className={cn("size-1.5 rounded-full", dot)} />
      {children}
    </span>
  );
}
