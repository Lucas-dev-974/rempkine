import "./button.css";

interface ButtonProps {
  text: string;
  onClick: () => void;
}

export function Button(props: ButtonProps) {
  return (
    <button class="default-button" onClick={props.onClick}>
      {props.text}
    </button>
  );
}
