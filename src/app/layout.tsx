import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

import "./globals.css";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans-stack",
  display: "swap",
  // One variable family carries the whole scale, so no second font request.
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://motiona.studio";
const description =
  "MOTIONA is a creative art platform for discovering digital artists, curated collections and the exhibitions shaping contemporary visual culture.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MOTIONA — A place where art, identity and technology connect",
    template: "%s · MOTIONA",
  },
  description,
  applicationName: "MOTIONA",
  keywords: [
    "digital art platform",
    "artist discovery",
    "curated art collections",
    "contemporary art",
    "online exhibitions",
    "creative community",
  ],
  authors: [{ name: "MOTIONA" }],
  creator: "MOTIONA",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "MOTIONA",
    title: "MOTIONA — A place where art, identity and technology connect",
    description,
    locale: "en_GB",
    images: [
      {
        url: "/images/og-cover.webp",
        width: 1800,
        height: 900,
        alt: "MOTIONA — a creative art platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MOTIONA — A place where art, identity and technology connect",
    description,
    images: ["/images/og-cover.webp"],
  },
  icons: {
    icon: [{ url: "/mark.svg", type: "image/svg+xml" }],
    apple: [{ url: "/mark.svg" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f7f4",
  colorScheme: "light",
};

/** Organisation markup so search and social surfaces resolve the brand. */
const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MOTIONA",
  url: siteUrl,
  logo: `${siteUrl}/mark.svg`,
  description,
  slogan: "A place where art, identity and technology connect.",
  sameAs: [
    "https://www.instagram.com/motiona",
    "https://www.youtube.com/@motiona",
    "https://www.linkedin.com/company/motiona",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          // Static, developer-authored JSON-LD — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }}
        />
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
