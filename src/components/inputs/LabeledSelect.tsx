import "./LabeledSelect.css";

interface LabeledSelectProps {
  id: string;
  label: string;
  selected?: string | number;
  options: { value: string | number; label: string }[];
  onChange?: (e: Event & { target: any & { value: string } }) => void;
}

export function LabeledSelect(props: LabeledSelectProps) {
  return (
    <div class="labeled-select">
      <label for="author">Autheur du contrat</label>
      <select name={props.id} id={props.id} onChange={props.onChange}>
        {props.options.map((option) => (
          <option
            value={option.value}
            selected={option.value == props.selected}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
