import type { MembershipPlan } from "@/types";

/** Yearly prices are the effective monthly rate when billed for twelve months. */
export const membershipPlans: MembershipPlan[] = [
  {
    id: "plan-free",
    name: "Free",
    monthlyPrice: 9,
    yearlyPrice: 7,
    description: "For anyone who wants to look properly before they make anything.",
    features: [
      "Public artist portfolio",
      "Three curated collections",
      "Follow artists and studios",
      "Weekly editorial digest",
    ],
    highlighted: false,
    cta: "Start free",
  },
  {
    id: "plan-studio",
    name: "Studio",
    monthlyPrice: 12,
    yearlyPrice: 10,
    description: "For working artists who need the archive as much as the shopfront.",
    features: [
      "Unlimited collections",
      "Private uploads and drafts",
      "Exhibition submissions",
      "Audience analytics",
      "Custom profile domain",
    ],
    highlighted: true,
    cta: "Join Studio",
  },
  {
    id: "plan-collective",
    name: "Collective",
    monthlyPrice: 19,
    yearlyPrice: 16,
    description: "For studios, collectives and programmes running work together.",
    features: [
      "Everything in Studio",
      "Up to twelve seats",
      "Shared community tools",
      "Priority curation review",
      "Dedicated support contact",
    ],
    highlighted: false,
    cta: "Talk to us",
  },
];
