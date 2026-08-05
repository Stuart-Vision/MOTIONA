import type { Article, EditorialEntry, ToolExperience } from "@/types";

export const editorialEntries: EditorialEntry[] = [
  {
    id: "ed-01",
    title: "When art rewrites commerce",
    category: "Economy",
    excerpt:
      "Studios are selling process, access and proximity — not just objects. What that changes about who gets paid.",
    image: "/images/editorial/editorial-01.webp",
    variant: "feature",
    colour: "ember",
  },
  {
    id: "ed-02",
    title: "Spin your identity",
    category: "Practice",
    excerpt: "Six artists on the alias, the avatar and the working name.",
    image: "/images/editorial/editorial-03.webp",
    variant: "portrait",
    colour: "violet",
  },
  {
    id: "ed-03",
    title: "Personal archives",
    category: "Method",
    excerpt: "The folder nobody sees is usually the real body of work.",
    variant: "dark",
    colour: "carbon",
  },
  {
    id: "ed-04",
    title: "Living colour systems",
    category: "Material",
    excerpt: "Pigment that ages, shifts and refuses to be a hex value.",
    image: "/images/editorial/editorial-02.webp",
    variant: "landscape",
    colour: "ochre",
  },
  {
    id: "ed-05",
    title: "Future folk",
    category: "Culture",
    excerpt:
      "Craft traditions are not being preserved. They are being argued with, and that is the healthier outcome.",
    variant: "quote",
    colour: "lime",
  },
  {
    id: "ed-06",
    title: "New visual languages",
    category: "Research",
    excerpt: "What replaces a style when the tools stop having one?",
    image: "/images/editorial/editorial-06.webp",
    variant: "portrait",
    colour: "cobalt",
  },
];

export const journalArticles: Article[] = [
  {
    id: "jr-01",
    title: "Where technology meets new people",
    excerpt:
      "The most interesting studios right now are not the most technical ones. They are the ones with a door, a mailing list and someone whose job is to answer it.",
    image: "/images/editorial/editorial-04.webp",
    category: "Community",
    slug: "where-technology-meets-new-people",
    readingTime: "8 min read",
    published: "March 2026",
  },
  {
    id: "jr-02",
    title: "Architecture of new art spaces",
    excerpt:
      "Ground-floor galleries are being replaced by warehouses, corner shops and shared kitchens. A look at four rooms that changed how their cities show work.",
    image: "/images/editorial/editorial-05.webp",
    category: "Spaces",
    slug: "architecture-of-new-art-spaces",
    readingTime: "11 min read",
    published: "February 2026",
  },
];

export const toolExperiences: ToolExperience[] = [
  {
    id: "tl-ai",
    name: "AI Studio",
    headline: "A studio assistant that stays out of the way.",
    description:
      "Draft variations, test colourways and extend a series without handing over authorship. Every output is traceable to the prompt, the seed and the source files you supplied.",
    image: "/images/artworks/artwork-13.webp",
    colour: "violet",
    highlights: ["Seed-locked variations", "Source-file provenance", "Batch colour studies"],
  },
  {
    id: "tl-collect",
    name: "Collect",
    headline: "Collecting that behaves like a reading list.",
    description:
      "Save pieces, group them into public or private sets, and keep notes on why something mattered. Collections can be shared as a single link or kept entirely to yourself.",
    image: "/images/collections/collection-02.webp",
    colour: "ember",
    highlights: ["Private and public sets", "Annotated saves", "One-link sharing"],
  },
  {
    id: "tl-music",
    name: "Music",
    headline: "Sound is part of the work, not a soundtrack.",
    description:
      "Attach recordings, field audio or full scores to any piece. Listeners get a proper player rather than an autoplaying background loop.",
    image: "/images/artworks/artwork-17.webp",
    colour: "cobalt",
    highlights: ["Lossless upload", "Timed annotations", "No autoplay, ever"],
  },
  {
    id: "tl-identity",
    name: "Identity",
    headline: "One profile, as many working names as you need.",
    description:
      "Run separate practices under separate names while keeping a single account, single payout and single set of permissions behind them.",
    image: "/images/artists/artist-03.webp",
    colour: "coral",
    highlights: ["Multiple personas", "Shared payouts", "Granular visibility"],
  },
  {
    id: "tl-social",
    name: "Social",
    headline: "A feed that ranks by attention, not outrage.",
    description:
      "Follow practices rather than accounts. The timeline is chronological by default and every ranking signal it uses is listed in your settings.",
    image: "/images/artworks/artwork-29.webp",
    colour: "lime",
    highlights: ["Chronological default", "Visible ranking signals", "Follow a practice"],
  },
  {
    id: "tl-exhibitions",
    name: "Exhibitions",
    headline: "Programme a show in an afternoon.",
    description:
      "Build a room, sequence the works, set an opening date and hand collaborators a key. Physical and online shows use the same tools.",
    image: "/images/editorial/editorial-05.webp",
    colour: "ochre",
    highlights: ["Shared install keys", "Opening schedules", "Hybrid rooms"],
  },
];
