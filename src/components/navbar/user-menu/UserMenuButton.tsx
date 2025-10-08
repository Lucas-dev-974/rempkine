import "./UserMenuButton.css";

interface UserMenuButtonProps {
  text: string;
  onClick: () => void;
}

export function UserMenuButton(props: UserMenuButtonProps) {
  return (
    <button onClick={props.onClick} class="hover:bg-gray-700 px-4 py-3 w-[140px] cursor-pointer">
      {props.text}
    </button>
  );
}
