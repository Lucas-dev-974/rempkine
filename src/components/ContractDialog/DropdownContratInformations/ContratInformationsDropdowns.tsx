import { DropdownWrapper } from "../../Dropdown/DropdownWrapper";
import { ContractInformationsFields } from "./ContractInformationsFields";
import { setIsFilledWithUserSubstitute, SubstituteFields } from "./SubstituteFields";
import { ReplacedFields, setIsFilledWithUserReplaced } from "./ReplacedFields";
import { createSignal, onCleanup } from "solid-js";
import { Signatures } from "../Signatures/Singatures";
import { setFillMode } from "./formFillMode";

export const [toggleItemEvent, setToggleItemEvent] = createSignal(false);

export function formatDateForInput(date: string | undefined) {
  if (!date) return ""
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function ContratInformationsDropdowns() {
  onCleanup(() => {
    setFillMode(null);
    setIsFilledWithUserReplaced(false);
    setIsFilledWithUserSubstitute(false);
  })

  return (
    <DropdownWrapper multiple={true}>
      {(toggleItem, items) => (
        <>
          <ContractInformationsFields items={items} toggleItem={toggleItem} />
          <ReplacedFields items={items} toggleItem={toggleItem} />
          <SubstituteFields items={items} toggleItem={toggleItem} />
          <Signatures items={items} toggleItem={toggleItem} />
        </>
      )}
    </DropdownWrapper>
  );
}
