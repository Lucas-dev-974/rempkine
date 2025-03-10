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

export function SubstituteFields(props: {
  toggleItem: ((id: number) => void) | ((id: number) => void);
  items: AccordionItemType[] | (() => AccordionItemType[]);
}) {
  const [Gender, setGender] = createSignal(
    currentPDF()?.OCD.substituteGender.toString() as GenderEnum
  );

  const [EmailValue, setEmailValue] = createSignal("");
  const [NameValue, setNameValue] = createSignal("");
  const [BirthdayValue, setBirthdayValue] = createSignal("");
  const [OrderDepartementValue, setOrderDepartementValue] = createSignal("");
  const [BirthdayLocationValue, setBirthdayLocationValue] = createSignal("");

  const [ProfessionnalAddressValue, setProfessionnalAddressValue] =
    createSignal("");
  const [OrderDepartmentNumberValue, setOrderDepartmentNumberValue] =
    createSignal("");

  createEffect(
    on(toggleItemEvent, () => {
      setEmailValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getSubstituteFields().email as string
        ) || ""
      );

      setNameValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getSubstituteFields(Gender()).name[0] as string
        ) || ""
      );

      setBirthdayValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getSubstituteFields(Gender()).birthday as string
        ) || ""
      );

      setBirthdayLocationValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getSubstituteFields(Gender()).birthdayLoction as string
        ) || ""
      );

      setOrderDepartementValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getSubstituteFields(Gender()).orderDepartement as string
        ) || ""
      );

      setOrderDepartmentNumberValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getSubstituteFields(Gender())
            .orderDepartmentNumber as string
        ) || ""
      );

      setProfessionnalAddressValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getSubstituteFields(Gender()).address as string
        ) || ""
      );

      setGender(currentPDF()?.OCD.substituteGender as GenderEnum);
    })
  );

  return (
    <AccordionItem
      id={2}
      title="Le remplacant"
      toggle={props.toggleItem}
      isOpen={
        (typeof props.items === "function" ? props.items() : props.items).find(
          (i) => i.id === 2
        )?.isOpen
      }
    >
      <Dialog2InputRadio
        legend="Genre:"
        name="substitute-gender"
        items={[
          {
            id: "substitute-mister",
            text: "Monsieur",
            value: GenderEnum.male,
          },
          {
            id: "substitute-miss",
            text: "Madame",
            value: GenderEnum.female,
          },
        ]}
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setGender(target.value as GenderEnum);
          currentPDF()?.updateOCD({
            substituteGender: target.value as GenderEnum,
          });
        }}
        value={Gender()}
      />
      <LabeledInput
        id="substitute-name"
        label="Nom, prénom"
        type="text"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getSubstituteFields(Gender() as "m" | "f")
              .name as unknown as string,
            e.target.value
          );
        }}
        value={NameValue()}
      />
      <LabeledInput
        id="substitute-mail"
        label="Email"
        type="text"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getSubstituteFields().email as string,
            e.target.value
          );
        }}
        value={EmailValue()}
      />
      <LabeledInput
        id="substitute-birthday"
        label="Anniversaire"
        type="date"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getSubstituteFields().birthday as string,
            e.target.value
          );
        }}
        value={BirthdayValue()}
      />
      <LabeledInput
        id="substitute-birthday-location"
        label="Née à"
        type="text"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getSubstituteFields().birthdayLoction as string,
            e.target.value
          );
        }}
        value={BirthdayLocationValue()}
      />
      <LabeledInput
        id="department-order"
        label="Département d'ordre"
        type="text"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getSubstituteFields().orderDepartement as string,
            e.target.value
          );
        }}
        value={OrderDepartementValue()}
      />
      <LabeledInput
        id="department-number-order"
        label="Numéro"
        type="text"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getSubstituteFields().orderDepartmentNumber as string,
            e.target.value
          );
        }}
        value={OrderDepartmentNumberValue()}
      />
      <LabeledInput
        id="substitute-address"
        label="Adresse"
        type="text"
        onInput={(e) => {
          HandleInputChangePDFEditor(
            currentPDF()?.getSubstituteFields().address as string,
            e.target.value
          );
        }}
        value={ProfessionnalAddressValue()}
      />
    </AccordionItem>
  );
}
