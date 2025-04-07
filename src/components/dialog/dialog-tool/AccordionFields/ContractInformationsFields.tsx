import { AccordionItemType } from "../../../Accordion/AccordionWrapper";
import { fillWithMyInformationsSubstitute } from "./SubstituteFields";
import { fillWithMyInformationsReplaced } from "./ReplacedFields";
import { AccordionItem } from "../../../Accordion/AccordionItem";
import { AuthorsEnum } from "../../../contract/editor/PDFTool";
import { LabeledSelect } from "../../../inputs/LabeledSelect";
import { LabeledInput } from "../../../inputs/LabeledInput";
import { UserEntity } from "../../../../models/user.entity";
import storeService from "../../../../utils/store.service";
import { Button } from "../../../buttons/Button";
import {
  currentPDF,
  HandlerInputChangePDFEditor,
} from "../../../contract/editor/PDFEditor";
import { createSignal } from "solid-js";

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

  function fillWithMyInformations(
    as: "auhtor" | "author,replaced" | "author,substitute"
  ) {
    // setFieldUpdatedEvent(!fieldUpdatedEvent());
    const userDatas: UserEntity = storeService.data.user;

    setAuthorStatus(userDatas.status);
    setAuthorEmail(userDatas.email);
    setAuthorName(userDatas.fullname);

    currentPDF()?.updateOCD({ authorName: userDatas.fullname });
    currentPDF()?.updateOCD({ authorEmail: userDatas.email });
    currentPDF()?.updateOCD({ authorStatus: userDatas.status });

    switch (as) {
      case "author,replaced":
        fillWithMyInformationsReplaced();
        break;

      case "author,substitute":
        fillWithMyInformationsSubstitute();
        break;
    }
  }

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
      <div class="flex w-full justify-end gap-2">
        <Button
          text="Je ne suis pas sur le contrat"
          onClick={() => fillWithMyInformations("auhtor")}
          size="small"
        />

        <Button
          text="Je suis remplacé"
          onClick={() => fillWithMyInformations("author,replaced")}
          size="small"
        />

        <Button
          text="Je remplace un confrère"
          onClick={() => fillWithMyInformations("author,replaced")}
          size="small"
        />
      </div>

      {/* <LabeledSelect
        id="author"
        label="Status de l'auteur du contrat"
        options={selectAuhorOptions}
        selected={authorStatus()}
        onChange={(e) => {
          currentPDF()?.updateOCD({ authorStatus: e.target.value });
          setAuthorStatus(e.target.value);
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
      /> */}

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
          setStartDate(e.target.value);
        }}
        value={startDate()}
      />
      <LabeledInput
        id="end-date"
        label="Date de fin"
        type="date"
        onInput={(e) => {
          HandlerInputChangePDFEditor(
            currentPDF()?.getContractInformationFields().endDate as string,
            e.target.value
          );
          setEndDate(e.target.value);
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
          setPercentReturnToSubstitute(e.target.value);
        }}
        value={percentReturnToSubstitute()}
      />

      <LabeledInput
        id="percent-returned-to-subsitute-before-date"
        label="Date limite de paiement au lieu de pourcentage reversé "
        type="date"
        onInput={(e) => {
          HandlerInputChangePDFEditor(
            currentPDF()?.getContractInformationFields()
              .reversedBefore as string,
            e.target.value
          );
          setPercentReturnToSubstituteBeforeDate(e.target.value);
        }}
        value={percentReturnToSubstituteBeforeDate()}
      />

      <LabeledInput
        id="non-installation-radius"
        label="Rayon de non installation (KM) si plus de 3 mois  "
        type="number"
        onInput={(e) => {
          HandlerInputChangePDFEditor(
            currentPDF()?.getContractInformationFields()
              .NonInstallationRadius as string,
            e.target.value
          );
          setNonInstallationRadius(e.target.value);
        }}
        value={nonInstallationRadius()}
      />
      <LabeledInput
        id="conciliationCDOMK "
        label="Lieu de remplacement"
        type="text"
        onInput={(e) => {
          HandlerInputChangePDFEditor(
            currentPDF()?.getContractInformationFields()
              .conciliationCDOMK as string,
            e.target.value
          );
          setConciliationCDOMK(e.target.value);
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
          setDoneAtLocation(e.target.value);
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
          setDoneAt(e.target.value);
        }}
        value={doneAt()}
      />
    </AccordionItem>
  );
}
