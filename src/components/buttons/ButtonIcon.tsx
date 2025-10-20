import { JSX } from "solid-js";


interface ButtonIconProps {
  icons: JSX.Element;
  onClick: () => void;
  size?: "small" | "medium" | "large";
}

export function ButtonIcon(props: ButtonIconProps) {
  let classe = ""
  if (props.size == "small") {
    classe = "w-3 h-3"
  } else if (props.size == "medium") {
    classe = "w-5 h-5"
  } else if (props.size == "large") {
    classe = "w-7 h-7"
  }
  return (
    <button class={" cursor-pointer text-white duration-700 hover:shadow-lg border-none " + classe} onClick={props.onClick}>
      {props.icons}
    </button>
  );
}
