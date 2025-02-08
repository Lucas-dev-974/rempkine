interface Dialog2InputRadioProps {
  legend: string;

  id1: string;
  value1: string;
  text1: string;

  id2: string;
  value2: string;
  text2: string;

  name: string;

  onChange: (e: Event) => void;
}

export function Dialog2InputRadio(props: Dialog2InputRadioProps) {
  return (
    <fieldset class="flex gap-2">
      <legend>{props.legend}</legend>
      <div>
        <input
          type="radio"
          id={props.id1}
          name={props.name}
          value={props.value1}
          onChange={props.onChange}
          checked
        />
        <label for={props.id1}>{props.text1}</label>
      </div>
      <div>
        <input
          type="radio"
          id={props.id2}
          name={props.name}
          value={props.value2}
          onChange={props.onChange}
        />
        <label for={props.id2}>{props.text2}</label>
      </div>
    </fieldset>
  );
}
