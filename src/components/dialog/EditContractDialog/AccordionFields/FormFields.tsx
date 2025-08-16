import { AccordionWrapper } from "../../../Accordion/AccordionWrapper";
import { ContractInformationsFields } from "./ContractInformationsFields";
import { SubstituteFields } from "./SubstituteFields";
import { ReplacedFields } from "./ReplacedFields";
import { createSignal } from "solid-js";

export const [toggleItemEvent, setToggleItemEvent] = createSignal(false);

export function formatDateForInput(date: string | undefined) {
  if (!date) return ""
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function AccordionInputsForm() {
  return (
    <AccordionWrapper multiple={true}>
      {(toggleItem, items) => (
        <>
          <ContractInformationsFields items={items} toggleItem={toggleItem} />
          <ReplacedFields items={items} toggleItem={toggleItem} />
          <SubstituteFields items={items} toggleItem={toggleItem} />
        </>
      )}
    </AccordionWrapper>
  );
}
