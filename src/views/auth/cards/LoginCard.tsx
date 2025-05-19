import { createSignal } from "solid-js";
import { UserEntity } from "../../../models/user.entity";
import { authService } from "../../../services/auth.service";
import { LabeledAuthInput } from "../inputs/LabeledAuthInput";
import { AuthSubmitButton } from "../inputs/AuthSubmitButton";

export function LoginCard() {
  const [formData, setFormData] = createSignal<Partial<UserEntity>>();
  const [formRef, setFormRef] = createSignal<HTMLFormElement>();

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
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
    await authService.login(
      formData() as Pick<UserEntity, "email" | "password">
    );
  };

  return (
    <form ref={setFormRef} onSubmit={handleSubmit} class="space-y-6 ">
      <div class="grid grid-cols-1  gap-6">
        <LabeledAuthInput
          label="Adresse email"
          name="email"
          type="email"
          required
        />
        <LabeledAuthInput
          label="Mot de passe"
          name="password"
          type="password"
          required
        />

        <div class="text-sm">
          <a
            href="#"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            Mot de passe oublié ?
          </a>
        </div>
      </div>

      <AuthSubmitButton text="Se connecter" />
    </form>
  );
}
