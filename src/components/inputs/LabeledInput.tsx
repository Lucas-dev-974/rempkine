import "./LabeledInput.css";

interface LabeledInputProps {
  id: string;
  label: string;
  type: "text" | "mail" | "date";
  placeholder?: string;

  value?: string;

  onInput?: (e: Event & { target: any & { value: string } }) => void;
}

export function LabeledInput(props: LabeledInputProps) {
  return (
    <div class="labeled-input">
      <label for={props.id}>{props.label}</label>
      <input
        type={props.type}
        id={props.id}
        placeholder={props.placeholder ? props.placeholder : ""}
        onInput={(e) => props.onInput && props.onInput(e)}
        value={props.value || ""}
      />
    </div>
  );
}
