import { createSignal, onMount } from "solid-js";
import "./LabeledInput.css";

interface LabeledInputProps {
  id: string;
  label: string;
  type: "text" | "mail" | "date" | "number" | "password";
  placeholder?: string;

  style?: "form";
  value?: string;
  required?: boolean;

  onInput?: (e: Event & { target: any & { value: string } }) => void;
}

export function LabeledInput(props: LabeledInputProps) {
  const [classname, setClassname] = createSignal("labeled-input");

  onMount(() =>
    setClassname((prev) => (!!props.style ? `${prev}-${props.style}` : prev))
  );
  return (
    <div class={classname()}>
      <label for={props.id}>{props.label}</label>
      <input
        type={props.type}
        id={props.id}
        name={props.id}
        placeholder={props.placeholder ? props.placeholder : ""}
        onInput={(e) => props.onInput && props.onInput(e)}
        value={props.value || ""}
        required={props.required}
      />
    </div>
  );
}
