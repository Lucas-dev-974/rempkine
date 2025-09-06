import { FaRegularCircleCheck } from 'solid-icons/fa'
import { IoCloseCircleOutline } from 'solid-icons/io'
import { Show } from 'solid-js';

import "./DropdownItem.css";

type DropdownItemProps = {
  id: number;
  toggle: (id: number) => void;
  isOpen?: boolean;
  title: string;
  valid?: boolean;
};

export function DropdownItem(props: DropdownItemProps & { children?: any }) {
  return (
    <div class="accordion-item">
      <div class="accordion-header" onClick={() => props.toggle(props.id)}>
        <p>{props.title}</p>
        <Show when={props.valid}>
          <FaRegularCircleCheck color="green" />
        </Show>
        <Show when={!props.valid}>
          <IoCloseCircleOutline color="red" />
        </Show>
      </div>
      {props.isOpen && <div class="accordion-content ">{props.children}</div>}
    </div>
  );
}
