import dynamic from "next/dynamic";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ArtworkStackSection } from "@/components/sections/ArtworkStackSection";
import { CollectionCollage } from "@/components/sections/CollectionCollage";
import { CommunityMarquee } from "@/components/sections/CommunityMarquee";
import { EditorialGrid } from "@/components/sections/EditorialGrid";
import { GatewaySection } from "@/components/sections/GatewaySection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ManifestoMarquee } from "@/components/sections/ManifestoMarquee";
import { TrustedBrands } from "@/components/sections/TrustedBrands";

/**
 * Everything below the fold is code-split. These sections carry the heaviest
 * interactive logic — tab state, layout animations, scroll transforms — and
 * none of it is needed for the first paint.
 */
const VisionSection = dynamic(() =>
  import("@/components/sections/VisionSection").then((m) => m.VisionSection),
);
const CreativeTools = dynamic(() =>
  import("@/components/sections/CreativeTools").then((m) => m.CreativeTools),
);
const ArtistFeature = dynamic(() =>
  import("@/components/sections/ArtistFeature").then((m) => m.ArtistFeature),
);
const MembershipSection = dynamic(() =>
  import("@/components/sections/MembershipSection").then((m) => m.MembershipSection),
);
const JournalSection = dynamic(() =>
  import("@/components/sections/JournalSection").then((m) => m.JournalSection),
);
const FinalCTA = dynamic(() => import("@/components/sections/FinalCTA").then((m) => m.FinalCTA));

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main id="main">
        <HeroSection />
        <ArtworkStackSection />
        <GatewaySection />
        <TrustedBrands />
        <CollectionCollage />
        <VisionSection />
        <CommunityMarquee />
        <EditorialGrid />
        <CreativeTools />
        <ArtistFeature />
        <MembershipSection />
        <ManifestoMarquee />
        <JournalSection />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}
