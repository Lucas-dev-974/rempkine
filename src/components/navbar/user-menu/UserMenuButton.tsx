interface UserMenuButtonProps {
  text: string;
  onClick: () => void;
}

export function UserMenuButton(props: UserMenuButtonProps) {
  return (
    <button onClick={props.onClick}
      class="border-none white px-4 py-3 w-[140px] cursor-pointer bg-transparent  text-white font-normal font-[Nunito] transition-all duration-500 ">
      {props.text}
    </button>
  );
}
