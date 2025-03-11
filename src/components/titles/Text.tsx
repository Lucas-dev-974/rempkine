import "./Text.css";

interface TextProps {
  text: string;
  class?: string;
}

export function Text(props: TextProps) {
  return <p class={"text " + props.class}>{props.text}</p>;
}
