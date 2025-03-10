import { GenderEnum } from "../contract/editor/PDFTool";

interface Dialog2InputRadioProps {
  legend: string;
  items: {
    id: string;
    value: string;
    text: string;
  }[];

  name: string;

  onChange: (e: Event) => void;

  value?: string;
}

export function Dialog2InputRadio(props: Dialog2InputRadioProps) {
  return (
    <fieldset class="flex gap-2">
      <legend>{props.legend}</legend>

      {props.items.map((item) => (
        <div>
          <input
            type="radio"
            id={item.id}
            name={props.name}
            value={item.value}
            onChange={props.onChange}
            checked={props.value == item.value}
          />
          <label for={item.id}>{item.text}</label>
        </div>
      ))}
    </fieldset>
  );
}
