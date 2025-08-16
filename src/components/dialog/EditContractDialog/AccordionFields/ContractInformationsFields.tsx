import { currentPDFTool, HandlerToUpdateCanvasInputs, setCurrentPDFTool } from "../../../contract/editor/PDFEditor";
import { AccordionItemType } from "../../../Accordion/AccordionWrapper";
import { fillWithMyInformationsSubstitute } from "./SubstituteFields";
import { fillWithMyInformationsReplaced } from "./ReplacedFields";
import { AccordionItem } from "../../../Accordion/AccordionItem";
import { AuthorsEnum } from "../../../contract/editor/PDFTool";
import { LabeledInput } from "../../../inputs/LabeledInput";
import { UserEntity } from "../../../../models/user.entity";
import storeService from "../../../../utils/store.service";
import { loadContract, loggedIn } from "../../../../const.data";
import { Button } from "../../../buttons/Button";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import { formatDateForInput } from "./FormFields";

interface ContractInformationsFieldsProps {
  toggleItem: ((id: number) => void) | ((id: number) => void);
  items: AccordionItemType[] | (() => AccordionItemType[]);
}
export const formatDate = (date: string) => {
  const date_ = new Date(date)
  return date_.toLocaleDateString('fr-FR');
}


export function ContractInformationsFields(props: ContractInformationsFieldsProps) {
  const [fieldUpdatedEvent, setFieldUpdatedEvent] = createSignal(false);

  // ------------ Input fields signals ------------
  const [percentReturnToSubstituteBeforeDate, setPercentReturnToSubstituteBeforeDate] = createSignal<string>();
  const [percentReturnToSubstitute, setPercentReturnToSubstitute] = createSignal<number>();
  const [nonInstallationRadius, setNonInstallationRadius] = createSignal<number>();
  const [conciliationCDOMK, setConciliationCDOMK] = createSignal<string>();
  const [doneAtLocation, setDoneAtLocation] = createSignal<string>();
  const [authorEmail, setAuthorEmail] = createSignal<string>();
  const [authorName, setAuthorName] = createSignal<string>();
  const [startDate, setStartDate] = createSignal<string>();
  const [endDate, setEndDate] = createSignal<string>();
  const [doneAt, setDoneAt] = createSignal<string>();


  function fillWithMyInformations(as: "auhtor" | "author,replaced" | "author,substitute") {
    // setFieldUpdatedEvent(!fieldUpdatedEvent());
    const userDatas: UserEntity = storeService.data.user;

    setAuthorEmail(userDatas.email);
    setAuthorName(userDatas.fullname);

    setCurrentPDFTool((prev) => {
      if (!prev) return prev
      prev.contractData = {
        ...prev.contractData,
        authorName: userDatas.fullname,
        authorEmail: userDatas.email,
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
      setAuthorEmail(loadContract()!.authorEmail)
      setAuthorName(loadContract()!.authorName)

      setPercentReturnToSubstituteBeforeDate(formatDateForInput(loadContract()!.percentReturnToSubstituteBeforeDate))
      setStartDate(formatDateForInput(loadContract()!.startDate))
      const endDate = formatDateForInput(loadContract()?.endDate) == "NaN-NaN-NaN" ? loadContract()?.endDate : formatDateForInput(loadContract()?.endDate)
      setEndDate(endDate)

      setDoneAt(formatDateForInput(loadContract()!.doneAtDate))
    }
  })

  return (
    <AccordionItem
      id={3}
      title="Informations du contrat"
      toggle={props.toggleItem}
      isOpen={(typeof props.items === "function" ? props.items() : props.items).find((i) => i.id === 3)?.isOpen}
    >
      <Show when={loggedIn()}>
        <div class="flex flex-wrap w-full justify-end gap-2">
          <Button
            text="Je ne suis pas sur le contrat"
            onClick={() => fillWithMyInformations("auhtor")}
            size="xs"
          />

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
        id="author-email"
        label="Email de l'auteur du contrat"
        type="text"
        onInput={(e) => {
          setCurrentPDFTool(prev => {
            if (!prev) return prev
            prev.contractData = {
              ...prev.contractData,
              authorEmail: e.target.value
            }
            return prev
          })
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
          setCurrentPDFTool(prev => {
            if (!prev) return prev
            prev.contractData = {
              ...prev.contractData,
              authorName: e.target.value
            }
            return prev
          })
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
          HandlerToUpdateCanvasInputs(
            currentPDFTool()?.getContractInformationFieldsIds().startDate as string,
            formatDateForInput(e.target.value)
          );
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
        }}
        value={nonInstallationRadius()?.toString()}
      />
      <LabeledInput
        id="conciliationCDOMK "
        label="conciliation C.D.O.M.K"
        type="text"
        onInput={(e) => {
          HandlerToUpdateCanvasInputs(
            currentPDFTool()?.getContractInformationFieldsIds()
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
          HandlerToUpdateCanvasInputs(
            currentPDFTool()?.getContractInformationFieldsIds()
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
          HandlerToUpdateCanvasInputs(
            currentPDFTool()?.getContractInformationFieldsIds().doneAt as string,
            formatDateForInput(e.target.value)
          );
          setDoneAt(e.target.value);
        }}
        value={doneAt()}
      />
    </AccordionItem>
  );
}
