import { createSignal, createEffect, on } from "solid-js";
import { AccordionItem } from "../../../Accordion/AccordionItem";
import { AccordionItemType } from "../../../Accordion/AccordionWrapper";
import {
  currentPDF,
  HandleInputChangePDFEditor,
} from "../../../contract/editor/PDFEditor";
import { LabeledInput } from "../../../inputs/LabeledInput";
import { toggleItemEvent } from "./FormFields";

export function ContractInformationsFields(props: {
  toggleItem: ((id: number) => void) | ((id: number) => void);
  items: AccordionItemType[] | (() => AccordionItemType[]);
}) {
  // ------------
  const [startDate, setStartDate] = createSignal("");
  const [endDate, setEndDate] = createSignal("");
  const [percentReturnToSubstitute, setPercentReturnToSubstitute] =
    createSignal("");
  const [
    percentReturnToSubstituteBeforeDate,
    setPercentReturnToSubstituteBeforeDate,
  ] = createSignal("");
  const [nonInstallationRadius, setNonInstallationRadius] = createSignal("");
  const [conciliationCDOMK, setConciliationCDOMK] = createSignal("");
  const [doneAtLocation, setDoneAtLocation] = createSignal("");
  const [doneAt, setDoneAt] = createSignal("");
  // ------------

  createEffect(
    on(toggleItemEvent, () => {
      setStartDate(
        currentPDF()?.getFieldValue(
          currentPDF()?.getContractInformationFields().startDate as string
        ) || ""
      );

      setEndDate(
        currentPDF()?.getFieldValue(
          currentPDF()?.getContractInformationFields().enDate as string
        ) || ""
      );

      setPercentReturnToSubstitute(
        currentPDF()?.getFieldValue(
          currentPDF()?.getContractInformationFields()
            .percentReversedToSubstitute as string
        ) || ""
      );

      setDoneAtLocation(
        currentPDF()?.getFieldValue(
          currentPDF()?.getContractInformationFields().doneAtLocation as string
        ) || ""
      );

      setConciliationCDOMK(
        currentPDF()?.getFieldValue(
          currentPDF()?.getContractInformationFields()
            .conciliationCDOMK as string
        ) || ""
      );

      setNonInstallationRadius(
        currentPDF()?.getFieldValue(
          currentPDF()?.getContractInformationFields()
            .NonInstallationRadius as string
        ) || ""
      );

      setDoneAt(
        currentPDF()?.getFieldValue(
          currentPDF()?.getContractInformationFields().doneAt as string
        ) || ""
      );
      setPercentReturnToSubstituteBeforeDate(
        currentPDF()?.getFieldValue(
          currentPDF()?.getContractInformationFields().reversedBefore as string
        ) || ""
      );
    })
  );

  return (
    <AccordionItem
      id={3}
      title="Informations du contrat"
      toggle={props.toggleItem}
      isOpen={
        (typeof props.items === "function" ? props.items() : props.items).find(
          (i) => i.id === 3
        )?.isOpen
      }
    >
      <LabeledInput
        id="start-date"
        label="Date de début"
        type="date"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getContractInformationFields().startDate as string,
            e.target.value
          );
        }}
        value={startDate()}
      />
      <LabeledInput
        id="end-date"
        label="Date de fin"
        type="date"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getContractInformationFields().enDate as string,
            e.target.value
          );
        }}
        value={endDate()}
      />

      <LabeledInput
        id="percent-returned-to-subsitute"
        label="Pourcentage reversé au remplaçant"
        type="text"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getContractInformationFields()
              .percentReversedToSubstitute as string,
            e.target.value
          );
        }}
        value={percentReturnToSubstitute()}
      />

      <LabeledInput
        id="percent-returned-to-subsitute-before-date"
        label="Pourcentage reversé au remplaçant avant la date"
        type="date"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getContractInformationFields()
              .reversedBefore as string,
            e.target.value
          );
        }}
        value={percentReturnToSubstituteBeforeDate()}
      />

      <LabeledInput
        id="non-installation-radius"
        label="Rayon de non installation"
        type="text"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getContractInformationFields()
              .NonInstallationRadius as string,
            e.target.value
          );
        }}
        value={nonInstallationRadius()}
      />
      <LabeledInput
        id="conciliationCDOMK "
        label="conciliation CDOMK "
        type="text"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getContractInformationFields()
              .conciliationCDOMK as string,
            e.target.value
          );
        }}
        value={conciliationCDOMK()}
      />
      <LabeledInput
        id="make-at-location"
        label="Fait à"
        type="text"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getContractInformationFields()
              .doneAtLocation as string,
            e.target.value
          );
        }}
        value={doneAtLocation()}
      />
      <LabeledInput
        id="make-at-date"
        label="Fait le"
        type="date"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getContractInformationFields().doneAt as string,
            e.target.value
          );
        }}
        value={doneAt()}
      />
    </AccordionItem>
  );
}
