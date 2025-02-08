type AccordionItemProps = {
  id: number;
  toggle: (id: number) => void;
  isOpen?: boolean;
  title: string;
};

export function AccordionItem(props: AccordionItemProps & { children?: any }) {
  return (
    <div class="accordion-item">
      <button class="accordion-header" onClick={() => props.toggle(props.id)}>
        {props.title}
      </button>
      {props.isOpen && <div class="accordion-content">{props.children}</div>}
    </div>
  );
}
