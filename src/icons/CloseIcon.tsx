export function CloseIcon(props: { stroke: string }) {
  return (
    <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 2L12 12M2 12L12 2"
        stroke={props.stroke}
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
