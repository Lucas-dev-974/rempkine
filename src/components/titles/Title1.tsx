import { mergeProps } from "solid-js";
import "./Title1.css";

interface Title1Props {
  text: string;
  color?: "primary" | "normal"
}

export function Title1(props: Title1Props) {
  const mergedProps = mergeProps({ color: "normal" }, props)

  return <h1 class={`title-1 ${mergedProps.color}`}>{props.text}</h1>;
}
