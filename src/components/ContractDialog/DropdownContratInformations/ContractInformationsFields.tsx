import { currentPDFTool, setCurrentPDFTool } from "../../ContractEditor/PDFEditor";
import { DorpdownItemType } from "../../Dropdown/DropdownWrapper";
import { fillWithMyInformationsSubstitute } from "./SubstituteFields";
import { fillWithMyInformationsReplaced } from "./ReplacedFields";
import { DropdownItem } from "../../Dropdown/DropdownItem";
import { LabeledInput } from "../../inputs/LabeledInput";
import { Button } from "../../buttons/Button";
import { createSignal, onMount, Show } from "solid-js";
import { formatDateForInput } from "./ContratInformationsDropdowns";
import { loadContract, loggedIn } from "../../../const.data";
import storeService from "../../../utils/store.service";

interface ContractInformationsFieldsProps {
  toggleItem: ((id: number) => void) | ((id: number) => void);
  items: DorpdownItemType[] | (() => DorpdownItemType[]);
}

export const formatDate = (date: string | undefined | null) => {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("fr-FR");
}


export function ContractInformationsFields(props: ContractInformationsFieldsProps) {
  const [valid, setValid] = createSignal<boolean>(false);

  // ------------ Input fields signals ------------
  const [percentReturnToSubstituteBeforeDate, setPercentReturnToSubstituteBeforeDate] = createSignal<string>();
  const [percentReturnToSubstitute, setPercentReturnToSubstitute] = createSignal<number>();
  const [nonInstallationRadius, setNonInstallationRadius] = createSignal<number>();
  const [conciliationCDOMK, setConciliationCDOMK] = createSignal<string>();
  const [doneAtLocation, setDoneAtLocation] = createSignal<string>();
  const [startDate, setStartDate] = createSignal<string>();
  const [endDate, setEndDate] = createSignal<string>();
  const [doneAt, setDoneAt] = createSignal<string>();

  function HandlerToUpdateFormInputsAndPDFInputs(
    field: "startDate" | "endDate" | "percentReturnToSubstitute" | "percentReturnToSubstituteBeforeDate" | "nonInstallationRadius" | "conciliationCDOMK" | "doneAtLocation" | "doneAt",
    value: string,
  ) {
    currentPDFTool()?.updateContractDataAndPDFFields(field, value);

    switch (field) {
      case "startDate":
        setStartDate(value);
        break;
      case "endDate":
        setEndDate(value);
        break;
      case "percentReturnToSubstitute":
        const percentReturnToSubstitute = Number(value);
        setPercentReturnToSubstitute(percentReturnToSubstitute);
        break;
      case "percentReturnToSubstituteBeforeDate":
        setPercentReturnToSubstituteBeforeDate(value);
        break;
      case "nonInstallationRadius":
        const nonInstallationRadius = Number(value);
        setNonInstallationRadius(nonInstallationRadius);
        break;
      case "conciliationCDOMK":
        setConciliationCDOMK(value);
        break;
      case "doneAtLocation":
        setDoneAtLocation(value);
        break;
      case "doneAt":
        setDoneAt(value);
        break;
    }

    isValid();
  }

  function fillWithMyInformations(as: "author,replaced" | "author,substitute") {
    setCurrentPDFTool((prev) => {
      if (!prev) return prev
      prev.contractData = {
        ...prev.contractData,
      }
      return prev
    })


    switch (as) {
      case "author,replaced":
        fillWithMyInformationsReplaced();
        break;

      case "author,substitute":
        fillWithMyInformationsSubstitute();
        break;
    }
  }

  onMount(() => {
    if (loadContract()) {
      setPercentReturnToSubstitute(loadContract()!.percentReturnToSubstitute)
      setNonInstallationRadius(loadContract()!.nonInstallationRadius)
      setConciliationCDOMK(loadContract()!.conciliationCDOMK)
      setDoneAtLocation(loadContract()!.doneAtLocation)

      setPercentReturnToSubstituteBeforeDate(formatDateForInput(loadContract()!.percentReturnToSubstituteBeforeDate))
      setStartDate(formatDateForInput(loadContract()!.startDate))
      setEndDate(formatDateForInput(loadContract()?.endDate))
      setDoneAt(formatDateForInput(loadContract()!.doneAt))
    }
    isValid()
  })


  function isValid() {
    if (startDate() && endDate() && percentReturnToSubstitute() && percentReturnToSubstituteBeforeDate() && conciliationCDOMK() && doneAtLocation() && doneAt()) {
      setValid(true);
    } else {
      setValid(false);
    }
  }

  return (
    <DropdownItem
      id={3}
      title="Informations du contrat"
      toggle={props.toggleItem}
      isOpen={(typeof props.items === "function" ? props.items() : props.items).find((i) => i.id === 3)?.isOpen}
      valid={valid()}
    >
      <Show when={storeService.data?.user?.email !== ""}>
        <div class="flex flex-wrap w-full justify-end gap-2">
          <Button
            text="Je suis remplacé"
            onClick={() => fillWithMyInformations("author,replaced")}
            size="xs"
          />

          <Button
            text="Je remplace un confrère"
            onClick={() => fillWithMyInformations("author,substitute")}
            size="xs"
          />
        </div>
      </Show>

      <LabeledInput
        id="start-date"
        label="Date de début"
        type="date"
        onInput={(e) => {
          HandlerToUpdateFormInputsAndPDFInputs("startDate", e.target.value);
        }}
        value={startDate()}
      />
      <LabeledInput
        id="end-date"
        label="Date de fin"
        type="date"
        onInput={(e) => {
          HandlerToUpdateFormInputsAndPDFInputs("endDate", e.target.value);
        }}
        value={endDate()}
      />

      <LabeledInput
        id="percent-returned-to-subsitute"
        label="Pourcentage reversé au remplaçant"
        type="number"
        onInput={(e) => {
          HandlerToUpdateFormInputsAndPDFInputs("percentReturnToSubstitute", e.target.value);
        }}
        value={percentReturnToSubstitute()?.toString()}
      />

      <LabeledInput
        id="percent-returned-to-subsitute-before-date"
        label="Date limite de paiement au lieu de pourcentage reversé "
        type="date"
        onInput={(e) => {
          HandlerToUpdateFormInputsAndPDFInputs("percentReturnToSubstituteBeforeDate", e.target.value);
        }}
        value={percentReturnToSubstituteBeforeDate()?.toString()}
      />

      <LabeledInput
        id="non-installation-radius"
        label="Rayon de non installation (KM) si plus de 3 mois  "
        type="number"
        onInput={(e) => {
          HandlerToUpdateFormInputsAndPDFInputs("nonInstallationRadius", e.target.value);
        }}
        value={nonInstallationRadius()?.toString()}
      />
      <LabeledInput
        id="conciliationCDOMK "
        label="Département de l'ordre concerné si conciliation"
        type="text"
        onInput={(e) => {
          HandlerToUpdateFormInputsAndPDFInputs("conciliationCDOMK", e.target.value);
        }}
        value={conciliationCDOMK()}
      />
      <LabeledInput
        id="make-at-location"
        label="Fait à"
        type="text"
        onInput={(e) => {
          HandlerToUpdateFormInputsAndPDFInputs("doneAtLocation", e.target.value);
        }}
        value={doneAtLocation()}
      />
      <LabeledInput
        id="make-at-date"
        label="Fait le"
        type="date"
        onInput={(e) => {
          HandlerToUpdateFormInputsAndPDFInputs("doneAt", e.target.value);
        }}
        value={doneAt()}
      />
    </DropdownItem>
  );
}
