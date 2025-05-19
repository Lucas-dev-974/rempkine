import { createSignal, Match, Switch } from "solid-js";
import { RegisterCard } from "./cards/RegisterCard";
import { AuthHeadPage } from "./AuthHeadPage";
import { Motion } from "@motionone/solid";
import { LoginCard } from "./cards/LoginCard";

export enum AuthActionEnum {
  LOGIN = "login",
  REGISTER = "register",
}

export function Authentication() {
  const [authAction, setAuthAction] = createSignal<AuthActionEnum>(
    AuthActionEnum.LOGIN
  );

  return (
    <div class="min-h-screen bg-primary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 ">
      <AuthHeadPage authAction={authAction} setAuthAction={setAuthAction} />

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Motion.div
          class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Switch>
            <Match when={authAction() == AuthActionEnum.REGISTER}>
              <RegisterCard />
            </Match>
            <Match when={authAction() == AuthActionEnum.LOGIN}>
              <LoginCard />
            </Match>
          </Switch>
        </Motion.div>
      </div>
    </div>
  );
}
