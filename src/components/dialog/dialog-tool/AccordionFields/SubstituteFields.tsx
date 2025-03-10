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
import { setToggleItemEvent, toggleItemEvent } from "./FormFields";
import { FitFieldsWithUserData } from "./FitFieldsWithUserData";
import storeService from "../../../../utils/store.service";
import { UserEntity } from "../../../../models/user.entity";

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

  function subInputHandler(
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
    HandleInputChangePDFEditor(
      currentPDF()?.getSubstituteFields(Gender() as GenderEnum)[
        `${field}`
      ] as unknown as string,
      value
    );
  }

  function fillWithMyInformations() {
    setToggleItemEvent(!toggleItemEvent());

    // code
    const userDatas: UserEntity = storeService.data.user;

    setEmailValue(userDatas.personalAddress);
    setNameValue(userDatas.name);
    setBirthdayLocationValue(userDatas.bornLocation);
    setBirthdayValue(userDatas.birthday.toString());
    setOrderDepartmentNumberValue(
      userDatas.orderNumber ? userDatas.orderNumber.toString() : ""
    );
    setGender(userDatas.gender as GenderEnum);
    setOrderDepartementValue(userDatas.department);
    setProfessionnalAddressValue(userDatas.personalAddress as string);

    subInputHandler("email", userDatas.email);
    subInputHandler("name", userDatas.name);
    subInputHandler("birthday", userDatas.birthday.toString());
    subInputHandler("birthdayLoction", userDatas.bornLocation);
    subInputHandler("orderDepartement", userDatas.department);
    subInputHandler(
      "orderDepartmentNumber",
      userDatas.orderNumber ? userDatas.orderNumber.toString() : ""
    );
    subInputHandler("address", userDatas.personalAddress);
  }

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
      <FitFieldsWithUserData fillWithMyInformations={fillWithMyInformations} />

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
          subInputHandler("name", e.target.value);
        }}
        value={NameValue()}
      />
      <LabeledInput
        id="substitute-mail"
        label="Email"
        type="text"
        onInput={(e) => {
          subInputHandler("email", e.target.value);
        }}
        value={EmailValue()}
      />
      <LabeledInput
        id="substitute-birthday"
        label="Anniversaire"
        type="date"
        onInput={(e) => {
          subInputHandler("birthday", e.target.value);
        }}
        value={BirthdayValue()}
      />
      <LabeledInput
        id="substitute-birthday-location"
        label="Née à"
        type="text"
        onInput={(e) => {
          subInputHandler("birthdayLoction", e.target.value);
        }}
        value={BirthdayLocationValue()}
      />
      <LabeledInput
        id="department-order"
        label="Département d'ordre"
        type="text"
        onInput={(e) => {
          subInputHandler("orderDepartement", e.target.value);
        }}
        value={OrderDepartementValue()}
      />
      <LabeledInput
        id="department-number-order"
        label="Numéro"
        type="number"
        onInput={(e) => {
          subInputHandler("orderDepartmentNumber", e.target.value);
        }}
        value={OrderDepartmentNumberValue()}
      />
      <LabeledInput
        id="substitute-address"
        label="Adresse"
        type="text"
        onInput={(e) => {
          subInputHandler("address", e.target.value);
        }}
        value={ProfessionnalAddressValue()}
      />
    </AccordionItem>
  );
}
