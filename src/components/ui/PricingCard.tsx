"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "./Button";
import type { MembershipPlan } from "@/types";

interface PricingCardProps {
  plan: MembershipPlan;
  yearly: boolean;
}

export function PricingCard({ plan, yearly }: PricingCardProps) {
  const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
  const featured = plan.highlighted;

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-[1.75rem] border p-7 transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1.5 sm:p-8",
        featured
          ? "border-transparent bg-ember text-white shadow-[0_30px_70px_-30px_rgba(255,90,31,0.7)]"
          : "border-line bg-white hover:shadow-[0_24px_60px_-32px_rgba(17,17,17,0.28)]",
      )}
    >
      {featured ? (
        <span className="type-label absolute -top-3 left-7 rounded-full bg-ink px-3 py-1.5 text-white">
          Recommended
        </span>
      ) : null}

      <h3 className="text-xl font-medium tracking-tight">{plan.name}</h3>
      <p className={cn("type-meta mt-2 max-w-[30ch]", featured ? "text-white/80" : "text-muted")}>
        {plan.description}
      </p>

      <div className="mt-7 flex items-end gap-1">
        <span className="text-[2.75rem] font-medium leading-none tracking-tighter">${price}</span>
        {/* The number swaps in place so the toggle reads as a change of rate, not of plan. */}
        <span className={cn("pb-1.5 text-sm", featured ? "text-white/75" : "text-muted")}>
          /month
        </span>
      </div>

      <div className="h-5">
        <AnimatePresence mode="wait" initial={false}>
          {yearly ? (
            <motion.p
              key="yearly-note"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.25 }}
              className={cn("type-meta", featured ? "text-white/75" : "text-muted")}
            >
              Billed ${price * 12} yearly
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      <ul className="mt-7 flex flex-1 flex-col gap-3.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm leading-snug">
            <Check
              aria-hidden
              strokeWidth={2.25}
              className={cn("mt-0.5 size-4 shrink-0", featured ? "text-white" : "text-ember")}
            />
            <span className={featured ? "text-white/95" : undefined}>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={featured ? "lime" : "outline"}
        size="lg"
        className="mt-8 w-full"
        aria-label={`${plan.cta} — ${plan.name} plan at $${price} per month`}
      >
        {plan.cta}
      </Button>
    </article>
  );
}
