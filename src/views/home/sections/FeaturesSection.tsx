import { Motion } from "@motionone/solid";
import { navigateTo } from "../../../router/Router";
import { FeatureType } from "../HomePage";
import { features } from "../data.features";

export function FeaturesSection() {
  return (
    <div class="py-16 bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-neutral-900 sm:text-4xl">
            Tout ce dont vous avez besoin en un seul endroit
          </h2>
          <p class="mt-4 max-w-2xl mx-auto text-xl text-neutral-600">
            Découvrez les fonctionnalités qui simplifient votre quotidien de
            kinésithérapeute
          </p>
        </div>

        <Motion.div
          class="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.2,
            },
          }}
        >
          {features.map((feature) => (
            <Motion.div
              class="relative bg-red p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.5,
                  autoplay: true,
                },
              }}
              onClick={() => navigateTo(feature.path)}
            >
              <div>
                <div class="mb-4">{feature.icon}</div>
                <h3 class="text-lg font-medium text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p class="text-neutral-600">{feature.description}</p>
              </div>
            </Motion.div>
          ))}
        </Motion.div>
      </div>
    </div>
  );
}
