import { createSignal } from "solid-js";
import { ButtonIcon } from "../../buttons/ButtonIcon";
import { UserMenuDialog } from "./UserMenuDialog";
import { RiSystemMenu3Line } from 'solid-icons/ri'


export function UserMenu() {
  const [isMenuDialogOpen, setIsMenuDialogOpen] = createSignal<boolean>(false);
  const [menuRef, setMenuRef] = createSignal<HTMLDivElement>();

  return (
    <div ref={setMenuRef} class={" relative"}>
      <ButtonIcon
        icons={<RiSystemMenu3Line fill="white" size={24} />}
        onClick={() => setIsMenuDialogOpen(!isMenuDialogOpen())}
        size="large"
      />
      <UserMenuDialog
        openDialog={isMenuDialogOpen()}
        onClose={() => setIsMenuDialogOpen(false)}
        menuRootRef={menuRef}
      />
    </div>
  )
}
