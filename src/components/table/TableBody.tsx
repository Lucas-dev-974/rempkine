import { For } from "solid-js";
import { TableColumn } from "./TableTypes";

interface TableBodyProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    rowClass?: (item: T, index: number) => string;
}

export function TableBody<T>(props: TableBodyProps<T>) {
    const defaultRowClass = (index: number) =>
        `${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-blue-100 transition-colors text-xs sm:text-sm`;

    return (
        <For each={props.data}>
            {(item, index) => (
                <tr class={props.rowClass ? props.rowClass(item, index()) : defaultRowClass(index())}>
                    <For each={props.columns}>
                        {(column) => (
                            <td class={`px-4 py-2 border-b text-${column.align || "left"}`}>
                                {column.render ? column.render(item, index()) : (item as any)[column.key] || "-"}
                            </td>
                        )}
                    </For>
                </tr>
            )}
        </For>
    );
}

