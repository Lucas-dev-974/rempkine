import { createSignal } from "solid-js";
import { AccordionWrapper } from "../../Accordion/AccordionWrapper";

import { ReplacedFields } from "./AccordionFields/ReplacedFields";
import { SubstituteFields } from "./AccordionFields/SubstituteFields";
import { ContractInformationsFields } from "./AccordionFields/ContractInformationsFields";

export const [toggleItemEvent, setToggleItemEvent] = createSignal(false);

export function FormFields() {
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
