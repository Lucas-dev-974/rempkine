interface LabeledInputProps {
  id: string;
  label: string;
  type: "text" | "mail" | "date" | "number" | "password" | "textarea";
  placeholder?: string;

  value?: string;
  required?: boolean;

  onInput?: (e: Event & { target: any & { value: string } }) => void;
}

export function LabeledInput(props: LabeledInputProps) {
  return (
    <div class={"grid grid-cols-1 form-input py-1"}>
      <label for={props.id}>{props.label}</label>
      <input
        class="border-none bg-slate-300 border-b-2 py-2 px-3 rounded-md rounded-sm outline-none"
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
