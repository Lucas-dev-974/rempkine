import { GenderEnum } from "../ContractEditor/PDFTool";

interface RadioButtonsProps {
  name: string;
  legend: string;
  value?: string;
  items: {
    id: string;
    value: string;
    text: string;
  }[];

  onChange: (e: Event) => void;
}

export function RadioButtons(props: RadioButtonsProps) {
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
