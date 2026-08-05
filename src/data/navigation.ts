import type { FooterColumn, NavLink } from "@/types";

export const primaryNav: NavLink[] = [
  { label: "Get Started", href: "#gateway" },
  { label: "Art & Culture", href: "#collection" },
  { label: "Artists", href: "#artist" },
  { label: "Journal", href: "#journal" },
  { label: "Exhibitions", href: "#editorial" },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Platform",
    links: [
      { label: "Get Started", href: "#gateway" },
      { label: "Artists", href: "#artist" },
      { label: "Collections", href: "#collection" },
      { label: "Exhibitions", href: "#editorial" },
      { label: "Membership", href: "#membership" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Journal", href: "#journal" },
      { label: "Events", href: "#editorial" },
      { label: "Partnerships", href: "#partners" },
      { label: "Submit Work", href: "#join" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#vision" },
      { label: "Careers", href: "#join" },
      { label: "Contact", href: "#join" },
      { label: "Press", href: "#journal" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#legal" },
      { label: "Terms", href: "#legal" },
      { label: "Cookies", href: "#legal" },
    ],
  },
];

export const languages = ["English", "Français", "Deutsch", "日本語"] as const;

export type Language = (typeof languages)[number];
