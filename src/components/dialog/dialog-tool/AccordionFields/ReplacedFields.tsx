import { createSignal, createEffect, on } from "solid-js";
import { AccordionItem } from "../../../Accordion/AccordionItem";
import { AccordionItemType } from "../../../Accordion/AccordionWrapper";
import {
  currentPDF,
  HandleInputChangePDFEditor,
} from "../../../contract/editor/PDFEditor";
import { GenderEnum } from "../../../contract/editor/PDFTool";
import { Dialog2InputRadio } from "../../../inputs/Dialog2InputRadio";
import { LabeledInput } from "../../../inputs/LabeledInput";
import { toggleItemEvent } from "./FormFields";

export function ReplacedFields(props: {
  toggleItem: ((id: number) => void) | ((id: number) => void);
  items: AccordionItemType[] | (() => AccordionItemType[]);
}) {
  const [replacedGender, setReplacedGender] = createSignal(
    currentPDF()?.OCD.replacedGender as GenderEnum
  );
  const [replacedEmailValue, setReplacedEmailValue] = createSignal("");
  const [replacedNameValue, setReplacedNameValue] = createSignal("");
  const [replacedBirthdayValue, setReplacedBirthdayValue] = createSignal("");
  const [
    replacedProfessionnalAddressValue,
    setReplacedProfessionnalAddressValue,
  ] = createSignal("");
  const [
    replacedOrderDepartmentNumberValue,
    setReplacedOrderDepartmentNumberValue,
  ] = createSignal("");
  const [replacedOrderDepartementValue, setReplacedOrderDepartementValue] =
    createSignal("");
  const [replacedBirthdayLocationValue, setReplacedBirthdayLocationValue] =
    createSignal("");

  createEffect(
    on(toggleItemEvent, () => {
      setReplacedEmailValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getReplacedFields().email as string
        ) || ""
      );

      setReplacedNameValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getReplacedFields(replacedGender()).name[0] as string
        ) || ""
      );

      setReplacedBirthdayValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getReplacedFields(replacedGender()).birthday as string
        ) || ""
      );

      setReplacedBirthdayLocationValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getReplacedFields(replacedGender())
            .birthdayLocation as string
        ) || ""
      );

      setReplacedOrderDepartementValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getReplacedFields(replacedGender())
            .orderDepartement as string
        ) || ""
      );

      setReplacedOrderDepartmentNumberValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getReplacedFields(replacedGender())
            .orderDepartmentNumber as string
        ) || ""
      );

      setReplacedProfessionnalAddressValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getReplacedFields(replacedGender())
            .professionnalAddress as string
        ) || ""
      );
    })
  );
  return (
    <AccordionItem
      id={1}
      title="Le remplacé"
      toggle={props.toggleItem}
      isOpen={
        (typeof props.items === "function" ? props.items() : props.items).find(
          (i: { id: number }) => i.id === 1
        )?.isOpen ?? false
      }
    >
      <Dialog2InputRadio
        legend="Genre:"
        name="replaced-gender"
        id1="replaced-mister"
        text1="Monsieur"
        value1="m"
        id2="replaced-miss"
        text2="Madame"
        value2="f"
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setReplacedGender(target.value as GenderEnum);
          currentPDF()?.updateOCD({
            replacedGender: target.value as GenderEnum,
          });
        }}
      />

      <LabeledInput
        id="replaced-name"
        label="Nom, prénom"
        type="text"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getReplacedFields(replacedGender() as "m" | "f")
              .name as unknown as string,
            e.target.value
          );
        }}
        value={replacedNameValue()}
      />
      <LabeledInput
        id="replaced-mail"
        label="Email"
        type="text"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getReplacedFields().email as string,
            e.target.value
          );
        }}
        value={replacedEmailValue()}
      />
      <LabeledInput
        id="birthday"
        label="Anniversaire"
        type="date"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getReplacedFields().birthday as string,
            e.target.value
          );
        }}
        value={replacedBirthdayValue()}
      />
      <LabeledInput
        id="birthday-location"
        label="Née à"
        type="text"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getReplacedFields().birthdayLocation as string,
            e.target.value
          );
        }}
        value={replacedBirthdayLocationValue()}
      />
      <LabeledInput
        id="department-order"
        label="Département d'ordre"
        type="text"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getReplacedFields().orderDepartement as string,
            e.target.value
          );
        }}
        value={replacedOrderDepartementValue()}
      />
      <LabeledInput
        id="department-number-order"
        label="Numéro"
        type="text"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getReplacedFields().orderDepartmentNumber as string,
            e.target.value
          );
        }}
        value={replacedOrderDepartmentNumberValue()}
      />
      <LabeledInput
        id="professional-address"
        label="Adresse profesionnel"
        type="text"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getReplacedFields().professionnalAddress as string,
            e.target.value
          );
        }}
        value={replacedProfessionnalAddressValue()}
      />
    </AccordionItem>
  );
}
