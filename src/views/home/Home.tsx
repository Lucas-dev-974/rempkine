import { Show } from "solid-js";
import { Button } from "../../components/buttons/Button";
import storeService from "../../utils/store.service";

export function Home() {
  return (
    <div class="pt-8">
      <div class="flex gap-1 flex-wrap ">
        <div class="w-full sm:w-1/2 md:w-auto">
          <h1 class="text-2xl sm:text-3xl md:text-4xl my-3 font-bold text-gray-800 text-center md:text-left">
            Trouve dès maintenant un remplaçant pour ton cabinet
          </h1>
          <p class="my-3 md:w-2/3 text-center md:text-left">
            RempKiné est un outil dédié aux kinésithérapeutes, conçu pour
            simplifier la création de contrats. Gagnez du temps en générant
            automatiquement des documents conformes et personnalisés en quelques
            clics.
          </p>
          <Show when={!storeService.proxy.isLogin}>
            <div class="flex flex-wrap gap-3 w-full justify-center md:justify-start">
              <Button
                class="my-1 w-full sm:w-auto"
                text="Je souhaite rejoindre"
                onClick={() => (location.href = "/register")}
              />
              <Button
                class="my-1 w-full sm:w-auto"
                text="Je souhaite me connecter"
                onClick={() => (location.href = "/login")}
              />
            </div>
          </Show>

          <div class="my-3">
            <Button
              class="my-1 w-full sm:w-auto"
              text="Tester l'outil"
              onClick={() => (location.href = "/login")}
            />
          </div>
        </div>
      </div>

      {/* <Announcements announcements={announcements} /> */}
    </div>
  );
}
