import "./UserMenu.css";

interface UserMenuProps {
  class?: string;
}

export function UserMenu(props: UserMenuProps) {
  return <div class={props.class + " user-menu"}>User menu</div>;
}
