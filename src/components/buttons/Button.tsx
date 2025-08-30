import { JSXElement } from "solid-js";
import "./button.css";

interface ButtonProps {
  text: string;
  icon?: JSXElement;
  onClick: () => void;
  class?: string;
  size?: "xs" | "small" | "medium" | "large" | "responsive" | "full-mobile";
}

export function Button(props: ButtonProps) {
  return (
    <button
      class={(props.size ? props.size + "-button  " : "") + "default-button " + (props.class ?? " ")}
      onClick={props.onClick}
    >

      {props.icon ? props.icon : props.text}
    </button>
  );
}
