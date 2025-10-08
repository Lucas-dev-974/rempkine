import { createSignal, onCleanup, onMount, Show } from "solid-js";
import storeService from "../../../utils/store.service";
import { ButtonIcon } from "../../buttons/ButtonIcon";
import { UserMenuDialog } from "./UserMenuDialog";
import { CgProfile } from 'solid-icons/cg'

import "./UserMenu.css";
import { loggedIn } from "../../../../public/const.data";
import { useNavigate } from "@solidjs/router";
interface UserMenuProps {
  class?: string;
}

function FallbackLogInButton() {
  const navigate = useNavigate();
  return (
    <button class="font-[Nunito] text-xs md:text-sm px-4 py-2 rounded-lg cursor-pointer text-white duration-700 hover:shadow-lg border-none bg-transparent" onClick={() => (navigate("/login"))}>Se connecter</button>
  );
}

export function UserMenu(props: UserMenuProps) {
  const [isMenuDialogOpen, setIsMenuDialogOpen] = createSignal<boolean>(false);
  const [menuRef, setMenuRef] = createSignal<HTMLDivElement>();

  function handleClickOutside(event: MouseEvent) {
    if (storeService.proxy.isLogin) {
      if (menuRef() && !menuRef()!.contains(event.target as Node)) {
        setIsMenuDialogOpen(false); // Ferme le menu si on clique à l'extérieur
      }
    }
  }

  onMount(() => {
    console.log(loggedIn());

    if (storeService.proxy.isLogin)
      document.addEventListener("click", handleClickOutside);
  });

  onCleanup(() => {
    if (storeService.proxy.isLogin)
      document.removeEventListener("click", handleClickOutside);
  });

  return (
    <Show when={loggedIn()} fallback={<FallbackLogInButton />}>
      <div ref={setMenuRef} class={props.class + " hidden relative"}>
        <ButtonIcon
          icons={<CgProfile fill="white" />}
          onClick={() => setIsMenuDialogOpen(!isMenuDialogOpen())}
          size="large"
        />
        <UserMenuDialog openDialog={isMenuDialogOpen()} />
      </div>
    </Show>
  );
}
