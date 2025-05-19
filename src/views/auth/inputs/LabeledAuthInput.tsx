interface LabeledAuthInputProps {
  label: string;
  name: string;
  type: string;

  required?: boolean;
}

export function LabeledAuthInput(props: LabeledAuthInputProps) {
  return (
    <div>
      <label
        for={props.name}
        class="block text-sm font-medium text-neutral-700"
      >
        {props.label}
      </label>
      <input
        id={props.name}
        name={props.name}
        type={props.type}
        autocomplete={props.name}
        required={props.required}
        class="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
      />
    </div>
  );
}
