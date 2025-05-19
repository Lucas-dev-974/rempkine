import { HeroDescription } from "./HeroDescription";
import { HeroButtons } from "./HeroButtons";
import { HeroTitle } from "./HeroTitle";
import { Motion } from "@motionone/solid";

export function HeroSection() {
  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="pt-10 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-28 text-center lg:text-left">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeroTitle />
          <HeroDescription />
          <HeroButtons />
        </Motion.div>
      </div>
    </div>
  );
}
