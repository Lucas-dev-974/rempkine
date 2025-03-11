import { Show } from "solid-js";
import { Button } from "../../components/buttons/Button";
import storeService from "../../utils/store.service";
import { DialogTool } from "../../components/dialog/dialog-tool/DialogTool";
import { Title1 } from "../../components/titles/Title1";
import { Text } from "../../components/titles/Text";

export function Home() {
  return (
    <div class="pt-8 xl:mx-40 ">
      <div class="flex items-center flex-wrap">
        <div class="w-full lg:w-2/3 ">
          <Title1 text="Simplifie la gestion de tes contrats avec tes collaborateurs" />

          <Text
            text="RempKiné est un outil dédié aux kinésithérapeutes, conçu pour simplifier la création de contrats. Gagnez du temps en générant automatiquement des documents conformes et personnalisés en quelques clics."
            class="text-1-home "
          />

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

          <div class="my-3 flex justify-end lg:justify-start">
            <DialogTool />
          </div>
        </div>

        <div class=" block lg:w-1/3 radius-10 ">
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
