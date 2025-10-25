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
    <div class="border-none border-solid border-gray-300 last:border-b-0 ">
      <div class="w-full bg-gray-100 text-lg font-semibold text-left cursor-pointer hover:bg-gray-200" onClick={() => props.toggle(props.id)}>
        <div class="px-3 flex items-center justify-between gap-2">

          <p>{props.title}</p>
          <Show when={props.valid}>
            <FaRegularCircleCheck color="green" />
          </Show>
          <Show when={!props.valid}>
            <IoCloseCircleOutline color="red" />
          </Show>
        </div>
      </div>
      {props.isOpen && <div class="p-3 bg-white">{props.children}</div>}
    </div>
  );
}
