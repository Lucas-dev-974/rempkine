interface TableEmptyStateProps {
  colSpan: number;
  message?: string;
}

export function TableEmptyState(props: TableEmptyStateProps) {
  return (
    <tr>
      <td
        colspan={props.colSpan}
        class="px-4 py-8 text-center text-gray-500"
      >
        {props.message || "Aucune donnée disponible"}
      </td>
    </tr>
  );
}

