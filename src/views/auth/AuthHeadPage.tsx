import { Accessor, Setter } from "solid-js";
import { AuthActionEnum } from "./Authentication";
import { loggedIn } from "../../const.data";

interface AuthHeadPageProps {
  authAction: Accessor<AuthActionEnum>;
  setAuthAction: Setter<AuthActionEnum>;
}

export function AuthHeadPage(props: AuthHeadPageProps) {
  return (
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-neutral-900">
        {props.authAction() == "login"
          ? "Connexion à votre compte"
          : "Créer un compte"}
      </h2>
      <p class="mt-2 text-center text-sm text-neutral-600">
        {!loggedIn()
          ? "Vous n'avez pas de compte ?"
          : "Vous avez déjà un compte ?"}{" "}
        <button
          class="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:underline transition-colors"
          onClick={() =>
            props.setAuthAction(
              props.authAction() == AuthActionEnum.REGISTER
                ? AuthActionEnum.LOGIN
                : AuthActionEnum.REGISTER
            )
          }
        >
          {props.authAction() == AuthActionEnum.LOGIN
            ? "S'inscrire"
            : "Se connecter"}
        </button>
      </p>
    </div>
  );
}
