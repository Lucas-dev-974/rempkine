import "./LabeledSelect.css";

interface LabeledSelectProps {
  id: string;
  label: string;
  selected?: string | number;
  options: { value: string | number; label: string }[];
  onChange?: (e: Event & { target: any & { value: string } }) => void;
  displayLine?: true
}

export function LabeledSelect(props: LabeledSelectProps) {
  return (
    <div class={"grid grid-cols-1 " + props.displayLine ? "d-flex" : ""}>
      <label for="author">{props.label}</label>
      <select name={props.id} id={props.id} onChange={props.onChange} class="bg-gray-100 border-b-2 py-2 px-3 outline-none">
        {props.options.map((option) => (
          <option value={option.value} selected={option.value == props.selected} >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
