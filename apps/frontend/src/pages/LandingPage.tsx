import { lazy, Suspense, type ReactNode } from "react";
import { CyberGridBackground } from "@/components/landing/CyberGridBackground";
import { HeroBootSequence } from "@/components/landing/HeroBootSequence";
import { SiteFooter } from "@/components/ui/SiteFooter";

const ThreatMapSection = lazy(() =>
  import("@/components/landing/ThreatMapSection").then((m) => ({
    default: m.ThreatMapSection,
  }))
);

const ChallengeShowcase = lazy(() =>
  import("@/components/landing/ChallengeShowcase").then((m) => ({
    default: m.ChallengeShowcase,
  }))
);

const LeaderboardPreview = lazy(() =>
  import("@/components/landing/LeaderboardPreview").then((m) => ({
    default: m.LeaderboardPreview,
  }))
);

const TerminalPreview = lazy(() =>
  import("@/components/landing/TerminalPreview").then((m) => ({
    default: m.TerminalPreview,
  }))
);

const CourseCarousel = lazy(() =>
  import("@/components/landing/CourseCarousel").then((m) => ({
    default: m.CourseCarousel,
  }))
);

const CTASection = lazy(() =>
  import("@/components/landing/CTASection").then((m) => ({
    default: m.CTASection,
  }))
);

function SectionFallback(): ReactNode {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-6 h-6 border-2 border-hacker-green/30 border-t-hacker-green rounded-full animate-spin" />
    </div>
  );
}

export function LandingPage(): ReactNode {
  return (
    <div className="relative min-h-screen bg-terminal-bg overflow-x-hidden">
      <CyberGridBackground />

      <div className="relative z-10">
        <HeroBootSequence />

        <Suspense fallback={<SectionFallback />}>
          <ThreatMapSection />
        </Suspense>

        <div className="h-px bg-gradient-to-r from-transparent via-terminal-border to-transparent" />

        <Suspense fallback={<SectionFallback />}>
          <ChallengeShowcase />
        </Suspense>

        <div className="h-px bg-gradient-to-r from-transparent via-terminal-border to-transparent" />

        <Suspense fallback={<SectionFallback />}>
          <LeaderboardPreview />
        </Suspense>

        <div className="h-px bg-gradient-to-r from-transparent via-terminal-border to-transparent" />

        <Suspense fallback={<SectionFallback />}>
          <TerminalPreview />
        </Suspense>

        <div className="h-px bg-gradient-to-r from-transparent via-terminal-border to-transparent" />

        <Suspense fallback={<SectionFallback />}>
          <CourseCarousel />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <CTASection />
        </Suspense>

        <SiteFooter />
      </div>
    </div>
  );
}
