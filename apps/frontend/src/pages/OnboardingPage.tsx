import { OnboardingFlow } from "../components/onboarding/OnboardingFlow";
import { SiteFooter } from "../components/ui/SiteFooter";
import type { ReactNode } from "react";

export function OnboardingPage(): ReactNode {
  return (
    <div className="min-h-screen flex flex-col bg-terminal-bg">
      <div className="flex-1">
        <OnboardingFlow />
      </div>
      <SiteFooter />
    </div>
  );
}
