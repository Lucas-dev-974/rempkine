import { createSignal } from "solid-js";
import { AccordionWrapper } from "../../../Accordion/AccordionWrapper";

import { ReplacedFields } from "./ReplacedFields";
import { SubstituteFields } from "./SubstituteFields";
import { ContractInformationsFields } from "./ContractInformationsFields";

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
