import { JSX } from "solid-js";

import "./ButtonIcon.css";

interface ButtonIconProps {
  icons: JSX.Element;
  onClick: () => void;
}

export function ButtonIcon(props: ButtonIconProps) {
  return (
    <button class="button-icon" onClick={props.onClick}>
      {props.icons}
    </button>
  );
}
