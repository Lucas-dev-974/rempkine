import { Show } from "solid-js";
import "./AccordionItem.css";

type AccordionItemProps = {
  id: number;
  toggle: (id: number) => void;
  isOpen?: boolean;
  title: string;
};

export function AccordionItem(props: AccordionItemProps & { children?: any }) {
  return (
    <div class="accordion-item">
      <div class="accordion-header" onClick={() => props.toggle(props.id)}>
        <p>{props.title}</p>
      </div>
      {props.isOpen && <div class="accordion-content">{props.children}</div>}
    </div>
  );
}
