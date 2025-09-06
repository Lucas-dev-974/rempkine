import { Show } from "solid-js";
import { Button } from "../../components/buttons/Button";
import { Title1 } from "../../components/titles/Title1";
import storeService from "../../utils/store.service";
import { Text } from "../../components/titles/Text";
import { EditContractDialog } from "../../components/contract-dialog/EditContractDialog";

export function HeroSection() {
    return (
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
                            text="Je souhaite rejoindre"
                            onClick={() => (location.href = "/register")}
                            size="full-mobile"
                        />
                        <Button
                            text="Je souhaite me connecter"
                            onClick={() => (location.href = "/login")}
                            size="full-mobile"
                        />
                    </div>
                </Show>

                <div class="my-3 flex justify-end lg:justify-start">
                    <EditContractDialog />
                </div>
            </div>

            <div class=" block lg:w-1/3 radius-10 ">
                <img
                    class="rounded-2xl"
                    src="https://images.pexels.com/photos/20860582/pexels-photo-20860582/free-photo-of-physiotherapist-and-patient-exercising.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt=""
                />
            </div>
        </div>)
}