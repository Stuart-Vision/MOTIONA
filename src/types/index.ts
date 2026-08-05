export type AccentColour =
  | "ember"
  | "coral"
  | "lime"
  | "violet"
  | "cobalt"
  | "ochre"
  | "blush"
  | "carbon";

export type Orientation = "portrait" | "square" | "landscape" | "tall";

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  image: string;
  category: string;
  year: number;
  colour: AccentColour;
  orientation: Orientation;
}

export interface Artist {
  id: string;
  name: string;
  discipline: string;
  location: string;
  avatar: string;
  coverImage: string;
  bio: string;
  followers: string;
  works: number;
  exhibitions: number;
  selectedWorks: string[];
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  slug: string;
  readingTime: string;
  published: string;
}

/** Editorial grid entries vary in shape; `variant` drives the span and treatment. */
export type EditorialVariant = "feature" | "dark" | "landscape" | "quote" | "portrait";

export interface EditorialEntry {
  id: string;
  title: string;
  category: string;
  excerpt?: string;
  image?: string;
  variant: EditorialVariant;
  colour: AccentColour;
}

export interface MembershipPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

export interface Collection {
  id: string;
  title: string;
  curator: string;
  pieces: number;
  image: string;
  colour: AccentColour;
  orientation: Orientation;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface ToolExperience {
  id: string;
  name: string;
  headline: string;
  description: string;
  image: string;
  colour: AccentColour;
  highlights: string[];
}
