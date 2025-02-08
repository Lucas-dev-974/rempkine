import { createSignal } from "solid-js";
import { AccordionItem } from "../../Accordion/AccordionItem";
import { AccordionWrapper } from "../../Accordion/AccordionWrapper";
import {
  HandleInputChangePDFEditor,
  currentPDF,
} from "../../contract/edit-contract/PDFEditor";
import { Dialog2InputRadio } from "../../inputs/Dialog2InputRadio";
import { LabeledInput } from "../../inputs/LabeledInput";

export function FormFields() {
  const [replacedGender, setReplacedGender] = createSignal<"m" | "f">();
  const [substituteGender, setSubstituteGender] = createSignal<"m" | "f">();

  return (
    <AccordionWrapper multiple={true}>
      {(toggleItem, items) => (
        <>
          <AccordionItem
            id={1}
            title="Le remplacé"
            toggle={toggleItem}
            isOpen={
              (typeof items === "function" ? items() : items).find(
                (i) => i.id === 1
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
                setReplacedGender(target.value as "m" | "f");
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
            />
            <LabeledInput
              id="department-number-order"
              label="Numéro"
              type="text"
              onInput={(e) => {
                HandleInputChangePDFEditor(
                  currentPDF()?.getReplacedFields()
                    .orderDepartmentNumber as string,
                  e.target.value
                );
              }}
            />
            <LabeledInput
              id="professional-address"
              label="Adresse profesionnel"
              type="text"
              onInput={(e) => {
                HandleInputChangePDFEditor(
                  currentPDF()?.getReplacedFields()
                    .professionnalAddress as string,
                  e.target.value
                );
              }}
            />
          </AccordionItem>

          <AccordionItem
            id={2}
            title="Le remplacant"
            toggle={toggleItem}
            isOpen={
              (typeof items === "function" ? items() : items).find(
                (i) => i.id === 2
              )?.isOpen
            }
          >
            <Dialog2InputRadio
              legend="Genre:"
              name="substitute-gender"
              id1="substitute-mister"
              text1="Monsieur"
              value1="m"
              id2="substitute-miss"
              text2="Madame"
              value2="f"
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setSubstituteGender(target.value as "m" | "f");
              }}
            />
            <LabeledInput
              id="substitute-name"
              label="Nom, prénom"
              type="text"
              onInput={(e) => {
                HandleInputChangePDFEditor(
                  currentPDF()?.getSubstituteFields(
                    substituteGender() as "m" | "f"
                  ).name as unknown as string,
                  e.target.value
                );
              }}
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
            />
            <LabeledInput
              id="substitute-birthday-location"
              label="Née à"
              type="text"
              onInput={(e) => {
                HandleInputChangePDFEditor(
                  currentPDF()?.getSubstituteFields().birtdayLoction as string,
                  e.target.value
                );
              }}
            />
            <LabeledInput
              id="department-order"
              label="Département d'ordre"
              type="text"
              onInput={(e) => {
                HandleInputChangePDFEditor(
                  currentPDF()?.getSubstituteFields()
                    .orderDepartement as string,
                  e.target.value
                );
              }}
            />
            <LabeledInput
              id="department-number-order"
              label="Numéro"
              type="text"
              onInput={(e) => {
                HandleInputChangePDFEditor(
                  currentPDF()?.getSubstituteFields()
                    .orderDepartmentNumber as string,
                  e.target.value
                );
              }}
            />
            <LabeledInput
              id="address"
              label="Adresse"
              type="text"
              onInput={(e) => {
                HandleInputChangePDFEditor(
                  currentPDF()?.getSubstituteFields().email as string,
                  e.target.value
                );
              }}
            />
          </AccordionItem>
        </>
      )}
    </AccordionWrapper>
  );
}
