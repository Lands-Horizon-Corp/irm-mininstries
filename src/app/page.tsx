import FaqSection from "@/components/home/faq-section";
import FeatureSection from "@/components/home/feature-section";
import HeroHome from "@/components/home/hero-home";
import IntroSection from "@/components/home/intro-section";

export default function Home() {
  return (
    <div className="mb-24 md:mb-0">
      <HeroHome />
      <IntroSection />
      <FeatureSection />
      <FaqSection />
    </div>
  );
}
