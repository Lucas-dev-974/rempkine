import { createSignal, Match, onMount, Switch } from "solid-js";
import { RegisterCard } from "./RegisterCard";
import { LoginCard } from "./Login";

export function Authentication() {
  const [authAction, setAuthAction] = createSignal<"register" | "login">(
    "register"
  );

  onMount(() => {
    if (location.href.includes("register")) setAuthAction("register");
    else setAuthAction("login");
  });

  return (
    <div class="flex flex-col justify-center one-page ">
      <Switch>
        <Match when={authAction() == "register"}>
          <RegisterCard />
        </Match>
        <Match when={authAction() == "login"}>
          <LoginCard />
        </Match>
      </Switch>
    </div>
  );
}
