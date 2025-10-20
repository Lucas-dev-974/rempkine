import { createSignal, Setter } from "solid-js";
import { UserEntity } from "../../models/user.entity";
import { authService } from "../../services/auth.service";
import { LabeledInput } from "../../components/inputs/LabeledInput";
import { LabeledSelect } from "../../components/inputs/LabeledSelect";
import { TitleForm } from "../../components/titles/TitleForm";
import { AuthWrapper } from "./AuthWrapper";
import { Button } from "../../components/buttons/Button";
import { RadioButtons } from "../../components/inputs/DialogToInputRadio";

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
    <AuthWrapper setFormRef={setFormRef as Setter<HTMLFormElement>} handleSubmit={handleSubmit}>
      <TitleForm title="Je rejoin la platform" />

      <div class="flex flex-col p-6 h-[450px] overflow-y-auto">
        <LabeledInput
          label="Nom et Prénom"
          id="fullname"
          required
          type="text"

        />
        <LabeledInput
          label="Email"
          id="email"
          required
          type="text"
        />
        <LabeledInput
          label="Mot de passe"
          id="password"
          type="password"
          required
        />
        <LabeledInput
          label="Département d'ordre des kinésithérapeutes"
          id="department"
          type="text"
          required
        />
        <LabeledInput
          label="Numéro du département d'ordre"
          id="orderNumber"
          type="number"
          required
        />
        <LabeledInput
          label="Née le"
          id="birthday"
          type="date"
          required
        />
        <LabeledInput
          label="Née à"
          id="bornLocation"
          type="text"
          required
        />
        <LabeledInput
          label="Adresse personnelle"
          id="personalAdress"
          type="text"
          required
        />
        <LabeledInput
          label="Adresse professionnelle"
          id="officeAdress"
          type="text"
          required
        />
        <LabeledInput
          label="Numéro de téléphone"
          id="phoneNumber"
          type="text"
          required
        />
        <RadioButtons
          name="genre"
          onChange={() => { }}
          legend="Genre"
          items={[
            { text: "Homme", value: "male", id: "" },
            { text: "Femme", value: "female", id: "" },
          ]}

        />
      </div>

      <div class="flex justify-end p-5">
        <Button text="S'enregistrer" type="submit" onClick={() => { }} preventDefault={false} />
      </div>
    </AuthWrapper>
  );
}
