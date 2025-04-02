import { AccordionItemType } from "../../../Accordion/AccordionWrapper";
import { Dialog2InputRadio } from "../../../inputs/Dialog2InputRadio";
import { AccordionItem } from "../../../Accordion/AccordionItem";
import { FitFieldsWithUserData } from "./FitFieldsWithUserData";
import { GenderEnum } from "../../../contract/editor/PDFTool";
import { UserEntity } from "../../../../models/user.entity";
import { LabeledInput } from "../../../inputs/LabeledInput";
import storeService from "../../../../utils/store.service";
import { createSignal, createEffect, on } from "solid-js";
import {
  currentPDF,
  HandlerInputChangePDFEditor,
} from "../../../contract/editor/PDFEditor";

interface AccordionFieldsProps {
  toggleItem: ((id: number) => void) | ((id: number) => void);
  items: AccordionItemType[] | (() => AccordionItemType[]);
}

const [fieldUpdatedEvent, setFieldUpdatedEvent] = createSignal(false);

// ------------ Input fields signals ------------
const [Gender, setGender] = createSignal();
const [email, setEmail] = createSignal<string>("");
const [name, setName] = createSignal<string>("");
const [birthday, setBirthday] = createSignal<string>("");
const [birthdayLocation, setBirthdayLocation] = createSignal<string>("");
const [orderDepartement, setOrderDepartement] = createSignal<string>("");
const [professionnalAddress, setProfessionnalAddress] =
  createSignal<string>("");
const [orderDepartmentNumber, setOrderDepartmentNumber] =
  createSignal<string>("");

function SubHandleInputChangePDFEditor(
  field:
    | "name"
    | "birthday"
    | "birthdayLoction"
    | "orderDepartement"
    | "orderDepartmentNumber"
    | "address"
    | "email",
  value: string
) {
  HandlerInputChangePDFEditor(
    currentPDF()?.getSubstituteFields(Gender() as GenderEnum)[
      `${field}`
    ] as unknown as string,
    value
  );
}

export function fillWithMyInformationsSubstitute() {
  setFieldUpdatedEvent(!fieldUpdatedEvent());
  // code
  const userDatas: UserEntity = storeService.data.user;

  const birth = userDatas.birthday;
  const formattedDate = birth.toString().split("T")[0];

  setEmail(userDatas.personalAdress);
  setName(userDatas.fullname);
  setBirthdayLocation(userDatas.bornLocation);
  setBirthday(formattedDate);
  setOrderDepartmentNumber(
    userDatas.orderNumber ? userDatas.orderNumber.toString() : ""
  );
  setGender(userDatas.gender as GenderEnum);
  setOrderDepartement(userDatas.department);
  setProfessionnalAddress(userDatas.personalAdress as string);

  SubHandleInputChangePDFEditor("email", userDatas.email);
  SubHandleInputChangePDFEditor("name", userDatas.fullname);
  SubHandleInputChangePDFEditor("birthday", userDatas.birthday.toString());
  SubHandleInputChangePDFEditor("birthdayLoction", userDatas.bornLocation);
  SubHandleInputChangePDFEditor("orderDepartement", userDatas.department);
  SubHandleInputChangePDFEditor(
    "orderDepartmentNumber",
    userDatas.orderNumber ? userDatas.orderNumber.toString() : ""
  );
  SubHandleInputChangePDFEditor("address", userDatas.personalAdress);
}

export function SubstituteFields(props: AccordionFieldsProps) {
  // ------------ Input fields signals ------------

  function updateFieldsWithCurrentPDF() {
    setGender(currentPDF()?.OCD.substituteGender.toString() as GenderEnum);
    setEmail(
      currentPDF()?.getFieldValue(
        currentPDF()?.getSubstituteFields().email as string
      ) || ""
    );

    setName(
      currentPDF()?.getFieldValue(
        currentPDF()?.getSubstituteFields(Gender() as GenderEnum)
          .name[0] as string
      ) || ""
    );

    setBirthday(
      currentPDF()?.getFieldValue(
        currentPDF()?.getSubstituteFields().birthday as string
      ) || ""
    );

    setBirthdayLocation(
      currentPDF()?.getFieldValue(
        currentPDF()?.getSubstituteFields().birthdayLoction as string
      ) || ""
    );

    setOrderDepartement(
      currentPDF()?.getFieldValue(
        currentPDF()?.getSubstituteFields().orderDepartement as string
      ) || ""
    );

    setOrderDepartmentNumber(
      currentPDF()?.getFieldValue(
        currentPDF()?.getSubstituteFields().orderDepartmentNumber as string
      ) || ""
    );

    setProfessionnalAddress(
      currentPDF()?.getFieldValue(
        currentPDF()?.getSubstituteFields().address as string
      ) || ""
    );

    setGender(currentPDF()?.OCD.substituteGender as GenderEnum);
  }

  createEffect(on(fieldUpdatedEvent, () => updateFieldsWithCurrentPDF()));

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
      <FitFieldsWithUserData
        fillWithMyInformations={fillWithMyInformationsSubstitute}
      />

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
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={Gender() as GenderEnum}
      />
      <LabeledInput
        id="substitute-name"
        label="Nom, prénom"
        type="text"
        onInput={(e) => {
          SubHandleInputChangePDFEditor("name", e.target.value);
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={name()}
      />
      <LabeledInput
        id="substitute-mail"
        label="Email"
        type="text"
        onInput={(e) => {
          SubHandleInputChangePDFEditor("email", e.target.value);
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={email()}
      />
      <LabeledInput
        id="substitute-birthday"
        label="Anniversaire"
        type="date"
        onInput={(e) => {
          SubHandleInputChangePDFEditor("birthday", e.target.value);
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={birthday()}
      />
      <LabeledInput
        id="substitute-birthday-location"
        label="Née à"
        type="text"
        onInput={(e) => {
          SubHandleInputChangePDFEditor("birthdayLoction", e.target.value);
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={birthdayLocation()}
      />
      <LabeledInput
        id="department-order"
        label="Département d'ordre"
        type="text"
        onInput={(e) => {
          SubHandleInputChangePDFEditor("orderDepartement", e.target.value);
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={orderDepartement()}
      />
      <LabeledInput
        id="department-number-order"
        label="Numéro"
        type="number"
        onInput={(e) => {
          SubHandleInputChangePDFEditor(
            "orderDepartmentNumber",
            e.target.value
          );
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={orderDepartmentNumber()}
      />
      <LabeledInput
        id="substitute-address"
        label="Adresse"
        type="text"
        onInput={(e) => {
          SubHandleInputChangePDFEditor("address", e.target.value);
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={professionnalAddress()}
      />
    </AccordionItem>
  );
}
