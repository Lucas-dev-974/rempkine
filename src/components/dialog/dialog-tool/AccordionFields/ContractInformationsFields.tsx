import { AccordionItemType } from "../../../Accordion/AccordionWrapper";
import { AccordionItem } from "../../../Accordion/AccordionItem";
import { LabeledSelect } from "../../../inputs/LabeledSelect";
import { LabeledInput } from "../../../inputs/LabeledInput";
import { createSignal, createEffect, on } from "solid-js";
import {
  currentPDF,
  HandlerInputChangePDFEditor,
} from "../../../contract/editor/PDFEditor";
import { AuthorsEnum } from "../../../contract/editor/PDFTool";

interface ContractInformationsFieldsProps {
  toggleItem: ((id: number) => void) | ((id: number) => void);
  items: AccordionItemType[] | (() => AccordionItemType[]);
}

export function ContractInformationsFields(
  props: ContractInformationsFieldsProps
) {
  const [fieldUpdatedEvent, setFieldUpdatedEvent] = createSignal(false);

  // ------------ Input fields signals ------------
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
  const [authorStatus, setAuthorStatus] = createSignal(
    AuthorsEnum.professional
  );
  const [authorEmail, setAuthorEmail] = createSignal("");
  const [authorName, setAuthorName] = createSignal("");

  // ------------ Input fields signals ------------

  // ------------ Select Options List ------------
  const selectAuhorOptions = [
    { value: AuthorsEnum.student, label: "Etudient" },
    { value: AuthorsEnum.professional, label: "Profesionnel" },
  ];
  // ------------ Select Options List ------------

  function updateFieldsWithCurrentPDF() {
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
        currentPDF()?.getContractInformationFields().conciliationCDOMK as string
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

    setAuthorStatus(currentPDF()?.OCD.authorStatus ?? AuthorsEnum.professional);

    setAuthorEmail(currentPDF()?.OCD.authorEmail ?? "");

    setAuthorName(currentPDF()?.OCD.authorName?.toString() ?? "");
  }

  createEffect(on(fieldUpdatedEvent, () => updateFieldsWithCurrentPDF()));

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
      <LabeledSelect
        id="author"
        label="Auteur du contrat"
        options={selectAuhorOptions}
        selected={authorStatus()}
        onChange={(e) => {
          currentPDF()?.updateOCD({ authorStatus: e.target.value });
          setAuthorStatus(e.target.value);
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
      />

      <LabeledInput
        id="author-email"
        label="Email de l'auteur du contrat"
        type="text"
        onInput={(e) => {
          currentPDF()?.updateOCD({ authorEmail: e.target.value });
          setAuthorEmail(e.target.value);
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={authorEmail()}
      />

      <LabeledInput
        id="author-name"
        label="Nom de l'auteur du contrat"
        type="text"
        onInput={(e) => {
          currentPDF()?.updateOCD({ authorName: e.target.value });
          setAuthorName(e.target.value);
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={authorName()}
      />

      <LabeledInput
        id="start-date"
        label="Date de début"
        type="date"
        onInput={(e) => {
          HandlerInputChangePDFEditor(
            currentPDF()?.getContractInformationFields().startDate as string,
            e.target.value
          );
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={startDate()}
      />
      <LabeledInput
        id="end-date"
        label="Date de fin"
        type="date"
        onInput={(e) => {
          HandlerInputChangePDFEditor(
            currentPDF()?.getContractInformationFields().enDate as string,
            e.target.value
          );
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={endDate()}
      />

      <LabeledInput
        id="percent-returned-to-subsitute"
        label="Pourcentage reversé au remplaçant"
        type="number"
        onInput={(e) => {
          HandlerInputChangePDFEditor(
            currentPDF()?.getContractInformationFields()
              .percentReversedToSubstitute as string,
            e.target.value
          );
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={percentReturnToSubstitute()}
      />

      <LabeledInput
        id="percent-returned-to-subsitute-before-date"
        label="Pourcentage reversé au remplaçant avant la date"
        type="date"
        onInput={(e) => {
          HandlerInputChangePDFEditor(
            currentPDF()?.getContractInformationFields()
              .reversedBefore as string,
            e.target.value
          );
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={percentReturnToSubstituteBeforeDate()}
      />

      <LabeledInput
        id="non-installation-radius"
        label="Rayon de non installation"
        type="number"
        onInput={(e) => {
          HandlerInputChangePDFEditor(
            currentPDF()?.getContractInformationFields()
              .NonInstallationRadius as string,
            e.target.value
          );
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={nonInstallationRadius()}
      />
      <LabeledInput
        id="conciliationCDOMK "
        label="conciliation CDOMK "
        type="text"
        onInput={(e) => {
          HandlerInputChangePDFEditor(
            currentPDF()?.getContractInformationFields()
              .conciliationCDOMK as string,
            e.target.value
          );
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={conciliationCDOMK()}
      />
      <LabeledInput
        id="make-at-location"
        label="Fait à"
        type="text"
        onInput={(e) => {
          HandlerInputChangePDFEditor(
            currentPDF()?.getContractInformationFields()
              .doneAtLocation as string,
            e.target.value
          );
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={doneAtLocation()}
      />
      <LabeledInput
        id="make-at-date"
        label="Fait le"
        type="date"
        onInput={(e) => {
          HandlerInputChangePDFEditor(
            currentPDF()?.getContractInformationFields().doneAt as string,
            e.target.value
          );
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={doneAt()}
      />
    </AccordionItem>
  );
}
