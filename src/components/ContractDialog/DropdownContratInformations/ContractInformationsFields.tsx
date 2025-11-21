import { currentPDFTool, HandlerToUpdateCanvasInputs, setCurrentPDFTool } from "../../ContractEditor/PDFEditor";
import { DorpdownItemType } from "../../Dropdown/DropdownWrapper";
import { fillWithMyInformationsSubstitute } from "./SubstituteFields";
import { fillWithMyInformationsReplaced } from "./ReplacedFields";
import { DropdownItem } from "../../Dropdown/DropdownItem";
import { LabeledInput } from "../../inputs/LabeledInput";
import { Button } from "../../buttons/Button";
import { createSignal, onMount, Show } from "solid-js";
import { formatDateForInput } from "./ContratInformationsDropdowns";
import { loadContract, loggedIn } from "../../../const.data";

interface ContractInformationsFieldsProps {
  toggleItem: ((id: number) => void) | ((id: number) => void);
  items: DorpdownItemType[] | (() => DorpdownItemType[]);
}

export const formatDate = (date: string) => {
  const date_ = new Date(date)
  return date_.toLocaleDateString('fr-FR');
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


  function fillWithMyInformations(as: "author,replaced" | "author,substitute") {
    // setFieldUpdatedEvent(!fieldUpdatedEvent());
    // const userDatas: UserEntity = storeService.data.user;


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
      const endDate = formatDateForInput(loadContract()?.endDate) == "NaN-NaN-NaN" ? loadContract()?.endDate : formatDateForInput(loadContract()?.endDate)
      setEndDate(endDate)
      setDoneAt(formatDateForInput(loadContract()!.doneAtDate))
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
      <Show when={loggedIn()}>
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
          HandlerToUpdateCanvasInputs(
            currentPDFTool()?.getContractInformationFieldsIds().startDate as string,
            formatDateForInput(e.target.value)
          );
          setStartDate(e.target.value);
          isValid()
        }}
        value={startDate()}
      />
      <LabeledInput
        id="end-date"
        label="Date de fin"
        type="date"
        onInput={(e) => {
          HandlerToUpdateCanvasInputs(
            currentPDFTool()?.getContractInformationFieldsIds().endDate as string,
            formatDateForInput(e.target.value)
          );
          setEndDate(e.target.value);
          isValid()
        }}
        value={endDate()}
      />

      <LabeledInput
        id="percent-returned-to-subsitute"
        label="Pourcentage reversé au remplaçant"
        type="number"
        onInput={(e) => {
          HandlerToUpdateCanvasInputs(currentPDFTool()?.getContractInformationFieldsIds().percentReversedToSubstitute as string, e.target.value
          );
          setPercentReturnToSubstitute(e.target.value);
          isValid()
        }}
        value={percentReturnToSubstitute()?.toString()}
      />

      <LabeledInput
        id="percent-returned-to-subsitute-before-date"
        label="Date limite de paiement au lieu de pourcentage reversé "
        type="date"
        onInput={(e) => {
          HandlerToUpdateCanvasInputs(
            currentPDFTool()?.getContractInformationFieldsIds().reversedBefore as string,
            formatDateForInput(e.target.value)
          );
          setPercentReturnToSubstituteBeforeDate(e.target.value);
          isValid()
        }}
        value={percentReturnToSubstituteBeforeDate()?.toString()}
      />

      <LabeledInput
        id="non-installation-radius"
        label="Rayon de non installation (KM) si plus de 3 mois  "
        type="number"
        onInput={(e) => {
          HandlerToUpdateCanvasInputs(
            currentPDFTool()?.getContractInformationFieldsIds()
              .NonInstallationRadius as string,
            e.target.value
          );
          setNonInstallationRadius(e.target.value);
          isValid()
        }}
        value={nonInstallationRadius()?.toString()}
      />
      <LabeledInput
        id="conciliationCDOMK "
        label="Département de l'ordre concerné si conciliation"
        type="text"
        onInput={(e) => {
          HandlerToUpdateCanvasInputs(
            currentPDFTool()?.getContractInformationFieldsIds()
              .conciliationCDOMK as string,
            e.target.value
          );
          setConciliationCDOMK(e.target.value);
          isValid()
        }}
        value={conciliationCDOMK()}
      />
      <LabeledInput
        id="make-at-location"
        label="Fait à"
        type="text"
        onInput={(e) => {
          HandlerToUpdateCanvasInputs(
            currentPDFTool()?.getContractInformationFieldsIds()
              .doneAtLocation as string,
            e.target.value
          );
          setDoneAtLocation(e.target.value);
          isValid()
        }}
        value={doneAtLocation()}
      />
      <LabeledInput
        id="make-at-date"
        label="Fait le"
        type="date"
        onInput={(e) => {
          HandlerToUpdateCanvasInputs(
            currentPDFTool()?.getContractInformationFieldsIds().doneAt as string,
            formatDateForInput(e.target.value)
          );
          setDoneAt(e.target.value);
          isValid()
        }}
        value={doneAt()}
      />
    </DropdownItem>
  );
}
