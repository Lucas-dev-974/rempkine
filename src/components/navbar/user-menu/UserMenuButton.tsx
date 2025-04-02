import "./UserMenuButton.css";

interface UserMenuButtonProps {
  text: string;
  onClick: () => void;
}

export function UserMenuButton(props: UserMenuButtonProps) {
  return (
    <button onClick={props.onClick} class="user-menu-button">
      {props.text}
    </button>
  );
}
