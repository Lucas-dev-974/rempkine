import { createSignal } from "solid-js";
import { UserEntity } from "../../models/user.entity";
import { authService } from "../../services/auth.service";
import { LabeledInput } from "../../components/inputs/LabeledInput";
import { TitleForm } from "../../components/titles/TitleForm";

export function LoginCard() {
  // Créez un signal pour gérer l'état du formulaire
  const [formData, setFormData] = createSignal<Partial<UserEntity>>();

  // Référence à votre formulaire
  const [formRef, setFormRef] = createSignal<HTMLFormElement>();

  // Fonction pour récupérer les données du formulaire
  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault(); // Empêche le comportement par défaut du formulaire
    // Récupérer toutes les entrées du formulaire
    const formElements: HTMLFormControlsCollection &
      {
        name: string;
        value: string;
      }[] = formRef()!.elements as HTMLFormControlsCollection &
      {
        name: string;
        value: string;
      }[];

    const data: any = {};

    // Itérer sur les éléments du formulaire pour récupérer les valeurs
    for (let element of formElements) {
      if (element.name) {
        // Vérifie si l'élément a un attribut name
        data[element.name] = element.value;
      }
    }

    setFormData(data); // Mettez à jour l'état si nécessaire          
    await authService.login(
      formData() as Pick<UserEntity, "email" | "password">
    );
  };

  return (
    <form ref={setFormRef} onSubmit={handleSubmit} class="mx-auto shadow-xl shadow-slate-300 rounded-lg space-y my-5  w-full md:w-2/3 lg:w-1/4 " >
      <TitleForm title="Je me connecte" />

      <div class="flex flex-col gap-2 p-6">
        <LabeledInput label="email" type="mail" onInput={() => { }} id="email" />
        <LabeledInput label="mot de passe" type="password" onInput={() => { }} id="password" />
        <div class="flex justify-end">
          <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" >
            Se connecter
          </button>
        </div>
      </div>

    </form>
  );
}
