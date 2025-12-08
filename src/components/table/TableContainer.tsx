import { JSX } from "solid-js";

interface TableContainerProps {
  children: JSX.Element;
  class?: string;
}

export function TableContainer(props: TableContainerProps) {
  return (
    <div class={`border border-gray-300 shadow-lg rounded-lg w-full overflow-hidden ${props.class ?? ""}`}>
      <div class="overflow-y-auto h-full">
        {props.children}
      </div>
    </div>
  );
}

