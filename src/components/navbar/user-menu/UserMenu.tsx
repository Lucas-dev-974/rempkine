import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { UserProfileIcon } from "../../../icons/UserProfileIcon";
import storeService from "../../../utils/store.service";
import { ButtonIcon } from "../../buttons/ButtonIcon";
import { UserMenuDialog } from "./UserMenuDialog";
import { loggedIn } from "../../../const.data";

import "./UserMenu.css";
interface UserMenuProps {
  class?: string;
}

function FallbackLogInButton() {
  return (
    <button onClick={() => (location.href = "/login")}>Se connecter</button>
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
    if (storeService.proxy.isLogin)
      document.addEventListener("click", handleClickOutside);
  });

  onCleanup(() => {
    if (storeService.proxy.isLogin)
      document.removeEventListener("click", handleClickOutside);
  });

  return (
    <Show when={loggedIn()} fallback={<FallbackLogInButton />}>
      <div ref={setMenuRef} class={props.class + " user-menu relative"}>
        <ButtonIcon
          icons={<UserProfileIcon fill="white" />}
          onClick={() => setIsMenuDialogOpen(!isMenuDialogOpen())}
        />
        <UserMenuDialog openDialog={isMenuDialogOpen()} />
      </div>
    </Show>
  );
}
