import { createSignal, Match, onMount, Switch } from "solid-js";
import { authService } from "../../services/auth.service";
import { UserEntity } from "../../models/user.entity";
import { RegisterCard } from "./RegisterCard";
import { LoginCard } from "./Login";
import { useNavigate } from "@solidjs/router";

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
