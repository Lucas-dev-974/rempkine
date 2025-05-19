import { HeroSection } from "./sections/hero-section/HeroSection";
import { JSX } from "solid-js";
import { FeaturesSection } from "./sections/FeaturesSection";
import { TestimonialSection } from "./sections/TestimonialSection";

export type FeatureType = {
  icon: JSX.Element;
  title: string;
  description: string;
  path: string;
};

export function HomePage() {
  return (
    <div class="bg-gradient-to-br from-primary-50 to-white">
      <HeroSection />
      <FeaturesSection />
      <TestimonialSection />
    </div>
  );
}

export default HomePage;
