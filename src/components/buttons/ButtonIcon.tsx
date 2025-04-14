import { JSX } from "solid-js";

import "./ButtonIcon.css";

interface ButtonIconProps {
  icons: JSX.Element;
  onClick: () => void;
  size?: "small" | "medium" | "large";
}

export function ButtonIcon(props: ButtonIconProps) {
  return (
    <button class={"button-icon " + props.size} onClick={props.onClick}>
      {props.icons}
    </button>
  );
}
