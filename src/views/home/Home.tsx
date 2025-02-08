import { Show } from "solid-js";
import { Button } from "../../components/buttons/Button";
import storeService from "../../utils/store.service";
import { DialogTool } from "../../components/dialog/dialog-tool/DialogTool";

export function Home() {
  return (
    <div class="pt-8 xl:mx-40 ">
      <div class="flex items-center">
        <div class="w-1/2">
          <h1 class="text-2xl sm:text-3xl md:text-5xl my-3 font-bold text-gray-800 text-center md:text-left">
            Simplifie la gestion de tes contrats avec tes collaborateurs
          </h1>
          <p class="my-3 text-center md:text-left pr-10">
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
            <DialogTool />
          </div>
        </div>

        <div class="w-1/2 radius-10 ">
          <img
            class="rounded-2xl"
            src="https://images.pexels.com/photos/20860582/pexels-photo-20860582/free-photo-of-physiotherapist-and-patient-exercising.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
          />
        </div>
      </div>

      {/* <Announcements announcements={announcements} /> */}
    </div>
  );
}
