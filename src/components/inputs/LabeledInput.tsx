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
  let inputRef: HTMLInputElement | undefined;

  function getValue() {
    if (props.type === "date") {
      return props.value?.toString();
    }
    return props.value;
  }

  return (
    <div class={"grid grid-cols-1 form-input py-1"}>
      <label class="font-[Nunito]" for={props.id}>{props.label}</label>
      <input
        ref={inputRef}
        class="border border-gray-300 rounded-lg py-2 px-3 bg-transparent shadow-sm focus:outline-none resize-none   outline-none font-[Nunito]"
        type={props.type}
        id={props.id}
        name={props.id}
        placeholder={props.placeholder ? props.placeholder : ""}
        onInput={(e) => props.onInput && props.onInput(e)}
        value={getValue()}
        required={props.required}
      />
    </div>
  );
}
