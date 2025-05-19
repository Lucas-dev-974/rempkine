export function TestimonialSection() {
  return (
    <div class="bg-primary-500 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-8">
          <div>
            <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
              Conçu par et pour les kinésithérapeutes de La Réunion
            </h2>
            <p class="mt-6 max-w-3xl text-lg text-primary-100">
              Notre plateforme est adaptée aux spécificités du métier et de
              l'île, pour répondre au mieux à vos besoins quotidiens.
            </p>
          </div>
          <div class="mt-12 lg:mt-0">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
              <div class="px-6 py-8">
                <div class="flex items-center">
                  <div class="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span class="text-xl font-bold text-primary-600">JR</span>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-bold text-neutral-900">
                      Jean Robert
                    </h4>
                    <p class="text-neutral-600">
                      Kinésithérapeute à Saint-Denis
                    </p>
                  </div>
                </div>
                <p class="mt-6 text-neutral-700">
                  "Cette plateforme m'a permis de trouver rapidement des
                  remplaçants de confiance, tout en simplifiant considérablement
                  la gestion administrative des contrats. Un vrai gain de temps
                  au quotidien !"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
