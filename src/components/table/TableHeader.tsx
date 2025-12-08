import { For } from "solid-js";
import { TableColumn } from "./TableTypes";

interface TableHeaderProps<T> {
  columns: TableColumn<T>[];
  headerGradient?: string;
}

export function TableHeader<T>(props: TableHeaderProps<T>) {
  const gradientStyle = props.headerGradient
    ? { background: props.headerGradient }
    : {
        background:
          "linear-gradient(173deg,rgba(9, 151, 115, 1) 0%, rgba(67, 182, 146, 1) 100%)",
      };

  return (
    <thead
      class="sticky top-0 z-10"
      style={gradientStyle}
    >
      <tr class="text-white text-sm">
        <For each={props.columns}>
          {(column) => (
            <th
              class={`px-4 py-2 text-${column.align || "left"}`}
              style={column.width ? { width: column.width } : {}}
            >
              {column.label}
            </th>
          )}
        </For>
      </tr>
    </thead>
  );
}

