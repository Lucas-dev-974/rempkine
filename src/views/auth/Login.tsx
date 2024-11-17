import { createSignal } from "solid-js";
import { UserEntity } from "../../models/user.entity";
import { authService } from "../../services/auth.service";

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
    console.log("form", formData());

    await authService.login(
      formData() as Pick<UserEntity, "email" | "password">
    );
  };

  return (
    <form
      ref={setFormRef}
      onSubmit={handleSubmit}
      class="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6 my-5"
    >
      <h2 class="text-2xl font-bold text-gray-700">Formulaire de connexion</h2>

      <div class="grid grid-cols-1  gap-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <a href="#" class="text-xs">
            Mot de passe oublié ?
          </a>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Se connecter
        </button>
      </div>
    </form>
  );
}
