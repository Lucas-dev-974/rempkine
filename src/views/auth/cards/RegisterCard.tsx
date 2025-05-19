import { createSignal } from "solid-js";
import { UserEntity } from "../../../models/user.entity";
import { authService } from "../../../services/auth.service";
import { LabeledInput } from "../../../components/inputs/LabeledInput";
import { LabeledSelect } from "../../../components/inputs/LabeledSelect";
import { LabeledAuthInput } from "../inputs/LabeledAuthInput";
import { AuthSubmitButton } from "../inputs/AuthSubmitButton";

export function RegisterCard() {
  const [formData, setFormData] = createSignal<Partial<UserEntity>>();
  const [formRef, setFormRef] = createSignal<HTMLFormElement>();

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault(); // Prevent the default form behavior

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

    // Iterate over the form elements to retrieve their values
    for (let element of formElements) {
      if (element.name) {
        // Check if the element has a name attribute
        data[element.name] = element.value;
      }
    }

    setFormData(data); // Update the state if necessary
    await authService.register(formData() as Partial<UserEntity>);
  }

  return (
    <form ref={setFormRef} onSubmit={handleSubmit} class="space-y-6">
      <LabeledAuthInput
        label="Nom Prénom"
        name="fullname"
        type="text"
        required
      />

      <LabeledAuthInput label="Email" name="email" type="text" required />
      <LabeledAuthInput
        label="Mot de passe"
        name="password"
        type="password"
        required
      />
      <LabeledAuthInput
        label="Département d'ordre des kinésithérapeutes"
        name="department"
        type="text"
        required
      />
      <LabeledAuthInput
        label="Numéro du département d'ordre"
        name="orderNumber"
        type="number"
        required
      />
      <LabeledAuthInput label="Née le" name="birthday" type="date" required />
      <LabeledAuthInput
        label="Née à"
        name="bornLocation"
        type="text"
        required
      />
      <LabeledAuthInput
        label="Adresse personnelle"
        name="personalAdress"
        type="text"
        required
      />
      <LabeledAuthInput
        label="Adresse professionnelle"
        name="officeAdress"
        type="text"
        required
      />
      <LabeledAuthInput
        label="Numéro de téléphone"
        name="phoneNumber"
        type="text"
        required
      />

      <LabeledSelect
        id="status"
        label="Status"
        options={[
          { label: "Etudiant", value: "student" },
          { label: "Professionnel", value: "professionnal" },
        ]}
      />
      <LabeledSelect
        id="gender"
        label="Genre"
        options={[
          { label: "Homme", value: "male" },
          { label: "Femme", value: "female" },
        ]}
      />
      <AuthSubmitButton text="S'enregistrer" />
    </form>
  );
}
