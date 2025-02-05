import "./button.css";

interface ButtonProps {
  text: string;
  onClick: () => void;
  class?: string;
  size?: "small" | "medium" | "large";
}

export function Button(props: ButtonProps) {
  return (
    <button
      class={(props.size ? props.size + "-button  " : "") + "default-button "}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}
