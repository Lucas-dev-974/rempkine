import { createSignal } from "solid-js";
import { UserEntity } from "../../models/user.entity";
import { authService } from "../../services/auth.service";

export function RegisterCard() {
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

    await authService.register(formData() as Partial<UserEntity>);
  };

  return (
    <form
      ref={setFormRef}
      onSubmit={handleSubmit}
      class="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6 my-5"
    >
      <h2 class="text-2xl font-bold text-gray-700">
        Formulaire d'enregistrement
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">
            Prénom
          </label>
          <input
            type="text"
            id="name"
            name="name"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700">
            Nom de famille
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label for="address" class="block text-sm font-medium text-gray-700">
          Adresse
        </label>
        <input
          type="text"
          id="address"
          name="address"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            for="odreNumber"
            class="block text-sm font-medium text-gray-700"
          >
            Numéro d'ordre
          </label>
          <input
            type="number"
            id="odreNumber"
            name="odreNumber"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label for="department" class="block text-sm font-medium text-gray-700">
          Département
        </label>
        <input
          type="text"
          id="department"
          name="department"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label for="birthday" class="block text-sm font-medium text-gray-700">
          Date de naissance
        </label>
        <input
          type="date"
          id="birthday"
          name="birthday"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label
          for="bornLocation"
          class="block text-sm font-medium text-gray-700"
        >
          Lieu de naissance
        </label>
        <input
          type="text"
          id="bornLocation"
          name="bornLocation"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            for="officeAddress"
            class="block text-sm font-medium text-gray-700"
          >
            Adresse du bureau
          </label>
          <input
            type="text"
            id="officeAddress"
            name="officeAddress"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label for="gender" class="block text-sm font-medium text-gray-700">
            Genre
          </label>
          <select
            id="gender"
            name="gender"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="M">Homme</option>
            <option value="F">Femme</option>
          </select>
        </div>
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
        />
      </div>

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
