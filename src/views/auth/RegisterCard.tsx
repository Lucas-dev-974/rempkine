import { createSignal } from "solid-js";
import { UserEntity } from "../../models/user.entity";
import { authService } from "../../services/auth.service";
import { LabeledInput } from "../../components/inputs/LabeledInput";
import { LabeledSelect } from "../../components/inputs/LabeledSelect";

export function RegisterCard() {
  // Créez un signal pour gérer l'état du formulaire
  const [formData, setFormData] = createSignal<Partial<UserEntity>>();

  // Référence à votre formulaire
  const [formRef, setFormRef] = createSignal<HTMLFormElement>();

  // Fonction pour récupérer les données du formulaire
  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault(); // Empêche le comportement par défaut du formulaire

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

    await authService.register(formData() as Partial<UserEntity>);
  }

  return (
    <form
      ref={setFormRef}
      onSubmit={handleSubmit}
      class="flex flex-col gap-5 mx-auto p-6 shadow-xl rounded-lg space-y my-5 bg-blue-200 w-full md:w-2/3 lg:w-1/3"
    >
      <h2 class="text-2xl font-bold text-gray-700">
        Formulaire d'enregistrement
      </h2>

      <LabeledInput
        label="Nom et Prénom"
        id="fullname"
        required
        type="text"
        style="form"
      />
      <LabeledInput
        label="Email"
        id="email"
        required
        type="text"
        style="form"
      />
      <LabeledInput
        label="Mot de passe"
        id="password"
        type="password"
        style="form"
        required
      />
      <LabeledInput
        label="Département d'ordre des kinésithérapeutes"
        id="department"
        type="text"
        style="form"
        required
      />
      <LabeledInput
        label="Numéro du département d'ordre"
        id="orderNumber"
        type="number"
        style="form"
        required
      />
      <LabeledInput
        label="Née le"
        id="birthday"
        type="date"
        style="form"
        required
      />
      <LabeledInput
        label="Née à"
        id="bornLocation"
        type="text"
        style="form"
        required
      />
      <LabeledInput
        label="Adresse personnelle"
        id="personalAdress"
        type="text"
        style="form"
        required
      />
      <LabeledInput
        label="Adresse professionnelle"
        id="officeAdress"
        type="text"
        style="form"
        required
      />
      <LabeledInput
        label="Numéro de téléphone"
        id="phoneNumber"
        type="text"
        style="form"
        required
      />
      <LabeledSelect
        id="status"
        label="Status"
        options={[
          { label: "Etudiant", value: "student" },
          { label: "Professionnel", value: "professional" },
        ]}
      />
      <LabeledSelect
        id="gender"
        label="Status"
        options={[
          { label: "Homme", value: "male" },
          { label: "Femme", value: "female" },
        ]}
      />
      <div class="flex justify-end">
        <button
          type="submit"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          S'enregistrer
        </button>
      </div>
    </form>
  );
}
