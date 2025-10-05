import FaqSection from "@/components/home/faq-section";
import FeatureSection from "@/components/home/feature-section";
import HeroHome from "@/components/home/hero-home";
import IntroSection from "@/components/home/intro-section";
import { RandomDots } from "@/components/ui/random-dot";

export default function Home() {
  return (
    <div className="relative mb-24 overflow-hidden md:mb-0">
      {/* Background decorative dots */}
      <RandomDots
        count={50}
        className="pointer-events-none"
        sizeVariants={["w-1 h-1", "w-2 h-2", "w-3 h-3"]}
        opacityVariants={[
          "bg-primary/10",
          "bg-primary/15",
          "bg-primary/20",
          "bg-primary/25",
        ]}
        animationVariants={["animate-pulse", "animate-bounce", ""]}
        durationVariants={["duration-2000", "duration-3000", "duration-[4s]"]}
        enableGlow={true}
        enableFloat={true}
        maxDelay={3}
      />

      <HeroHome />
      <IntroSection />
      <FeatureSection />
      <FaqSection />
    </div>
  );
}
