import "./UserMenu.css";
import { UserProfileIcon } from "../../../icons/UserProfileIcon";
import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { loggedIn } from "../../../const.data";
import storeService from "../../../utils/store.service";

interface UserMenuProps {
  class?: string;
}

function LogIn() {
  return (
    <button onClick={() => (location.href = "/login")}>Se connecter</button>
  );
}
export function UserMenu(props: UserMenuProps) {
  const [open, setOpen] = createSignal<boolean>(false);
  const [menuRef, setMenuRef] = createSignal<HTMLDivElement>();

  function handleClickOutside(event: MouseEvent) {
    if (storeService.proxy.isLogin) {
      if (menuRef() && !menuRef()!.contains(event.target as Node)) {
        setOpen(false); // Ferme le menu si on clique à l'extérieur
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
    <Show when={loggedIn()} fallback={<LogIn />}>
      <div ref={setMenuRef} class={props.class + " user-menu relative"}>
        <button class="w-7 h-7" onClick={() => setOpen(!open())}>
          <UserProfileIcon fill="white" />
        </button>

        <div class="hidden visible"></div>
        <div
          class="bg-gray-800 absolute top-10 right-4 flex flex-col  "
          classList={{
            hidden: !open(),
            visible: open(),
          }}
        >
          <div class="hover:bg-gray-700 px-4 py-3 w-full cursor-pointer">
            Profile
          </div>
          <button
            onClick={() => {
              storeService.proxy.isLogin = false;
              storeService.proxy.isLogin = false;
              storeService.proxy.token = "";
              storeService.proxy.user = {};

              location.href = "/";
            }}
            class="hover:bg-gray-700 px-4 py-3 w-full cursor-pointer"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </Show>
  );
}
