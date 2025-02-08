import { createSignal, JSX, onMount } from "solid-js";

import "./Accordion.css";

type AccordionWrapperProps = {
  multiple?: boolean; // Permet plusieurs panneaux ouverts simultanément
  children: (
    toggleItem: (id: number) => void,
    items: AccordionItem[]
  ) => JSX.Element;
};

type AccordionItem = {
  id: number;
  isOpen: boolean;
};

export function AccordionWrapper(
  props: AccordionWrapperProps & {
    children: (
      toggle: (id: number) => void,
      items: () => AccordionItem[]
    ) => any;
  }
) {
  const [items, setItems] = createSignal<AccordionItem[]>([]);

  // Initialisation des items
  onMount(() => {
    const initialItems = props.children(() => {}, []);
    setItems(
      Array.isArray(initialItems)
        ? initialItems.map((_, index) => ({
            id: index + 1,
            isOpen: false,
          }))
        : []
    );
  });

  function toggleItem(id: number) {
    setItems((prevItems) => {
      console.log("toggle item", id, prevItems);

      return props.multiple
        ? prevItems.map((item) =>
            item.id === id ? { ...item, isOpen: !item.isOpen } : item
          )
        : prevItems.map((item) => ({
            ...item,
            isOpen: item.id === id ? !item.isOpen : false,
          }));
    });
  }

  return <div class="accordion">{props.children(toggleItem, items)}</div>;
}
