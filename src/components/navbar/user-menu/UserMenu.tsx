import { createSignal, onCleanup, onMount, Show } from "solid-js";
import storeService from "../../../utils/store.service";
import { ButtonIcon } from "../../buttons/ButtonIcon";
import { UserMenuDialog } from "./UserMenuDialog";
import { CgProfile } from 'solid-icons/cg'
import { loggedIn } from "../../../const.data";
import { FallbackAuthBtn } from "./FallbackAuthBtn";

export function UserMenu() {
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
    <Show when={loggedIn()} fallback={<FallbackAuthBtn />}>
      <div ref={setMenuRef} class={" relative"}>
        <ButtonIcon
          icons={<CgProfile fill="white" size={24} />}
          onClick={() => setIsMenuDialogOpen(!isMenuDialogOpen())}
          size="large"
        />
        <UserMenuDialog openDialog={isMenuDialogOpen()} />
      </div>
    </Show>
  );
}
