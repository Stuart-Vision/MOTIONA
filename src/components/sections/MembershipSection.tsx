"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { RevealText } from "@/components/motion/RevealText";
import { PricingCard } from "@/components/ui/PricingCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/utils";
import { membershipPlans } from "@/data/pricing";

export function MembershipSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section
      id="membership"
      aria-labelledby="membership-heading"
      className="scroll-mt-24 bg-surface py-20 md:py-28 lg:py-32"
    >
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel className="justify-center">Membership</SectionLabel>
          <RevealText
            as="h2"
            id="membership-heading"
            className="type-h2 mt-6"
            lines={["Membership for every", [{ text: "creative", accent: true }, "journey."]]}
          />
          <p className="type-lead mx-auto mt-6 max-w-lg">
            Cancel in one click. Your archive stays downloadable whether you are paying or not.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="inline-flex items-center rounded-full border border-ink/12 bg-paper p-1">
            {(
              [
                { key: false, label: "Monthly" },
                { key: true, label: "Yearly" },
              ] as const
            ).map((option) => (
              <button
                key={String(option.key)}
                type="button"
                onClick={() => setYearly(option.key)}
                aria-pressed={yearly === option.key}
                className={cn(
                  "relative h-10 rounded-full px-6 text-sm font-medium transition-colors duration-300",
                  yearly === option.key ? "text-paper" : "text-ink/65 hover:text-ink",
                )}
              >
                {yearly === option.key ? (
                  <motion.span
                    layoutId="billing-pill"
                    transition={{ type: "spring", stiffness: 340, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-ink"
                  />
                ) : null}
                <span className="relative">{option.label}</span>
              </button>
            ))}
          </div>
          <p className="type-meta text-muted">
            {yearly ? "Two months free on every annual plan." : "Switch to yearly and save 17%."}
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {membershipPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} yearly={yearly} />
          ))}
        </div>

        <p className="type-meta mx-auto mt-10 max-w-lg text-center text-muted">
          Prices in USD, excluding local tax. Student and low-income rates are available — write to
          us and we will sort it out.
        </p>
      </div>
    </section>
  );
}
