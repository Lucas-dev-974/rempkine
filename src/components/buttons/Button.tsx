import "./button.css";

interface ButtonProps {
  text: string;
  onClick: () => void;
  class?: string;
}

export function Button(props: ButtonProps) {
  return (
    <button class={"default-button " + props.class} onClick={props.onClick}>
      {props.text}
    </button>
  );
}
