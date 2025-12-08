import { Show } from "solid-js";
import { TableColumn } from "./TableTypes";
import { TableContainer } from "./TableContainer";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { TableEmptyState } from "./TableEmptyState";

interface DataTableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    emptyMessage?: string;
    headerGradient?: string;
    rowClass?: (item: T, index: number) => string;
}

export function DataTable<T>(props: DataTableProps<T>) {
    return (
        <TableContainer>
            <table class="w-full font-[Nunito]">
                <TableHeader columns={props.columns} headerGradient={props.headerGradient} />
                <tbody>
                    <Show
                        when={props.data.length > 0}
                        fallback={
                            <TableEmptyState colSpan={props.columns.length} message={props.emptyMessage} />
                        }
                    >
                        <TableBody
                            columns={props.columns}
                            data={props.data}
                            rowClass={props.rowClass}
                        />
                    </Show>
                </tbody>
            </table>
        </TableContainer>
    );
}


