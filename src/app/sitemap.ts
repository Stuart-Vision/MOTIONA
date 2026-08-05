import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://motiona.studio";

/**
 * This build is a single page; the in-page landmarks are listed as fragments so
 * search engines can surface them as jump targets.
 */
const sections = [
  "gateway",
  "collection",
  "vision",
  "editorial",
  "tools",
  "artist",
  "membership",
  "journal",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...sections.map((id) => ({
      url: `${siteUrl}/#${id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
