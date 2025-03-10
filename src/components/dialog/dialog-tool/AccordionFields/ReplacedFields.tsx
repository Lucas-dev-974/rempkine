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
import { Button } from "../../../buttons/Button";
import { FitFieldsWithUserData } from "./FitFieldsWithUserData";
import { UserEntity } from "../../../../models/user.entity";
import storeService from "../../../../utils/store.service";

export function ReplacedFields(props: {
  toggleItem: ((id: number) => void) | ((id: number) => void);
  items: AccordionItemType[] | (() => AccordionItemType[]);
}) {
  const [Gender, setGender] = createSignal(
    (currentPDF()?.OCD.replacedGender as GenderEnum) ||
      GenderEnum.female.toString()
  );
  const [emailValue, setEmailValue] = createSignal("");
  const [nameValue, setNameValue] = createSignal("");
  const [birthdayValue, setBirthdayValue] = createSignal("");
  const [professionnalAddressValue, setProfessionnalAddressValue] =
    createSignal("");
  const [orderDepartmentNumberValue, setOrderDepartmentNumberValue] =
    createSignal("");
  const [orderDepartementValue, setOrderDepartementValue] = createSignal("");
  const [birthdayLocationValue, setBirthdayLocationValue] = createSignal("");

  createEffect(
    on(toggleItemEvent, () => {
      setEmailValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getReplacedFields().email as string
        ) || ""
      );

      setNameValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getReplacedFields(Gender()).name[0] as string
        ) || ""
      );

      setBirthdayValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getReplacedFields(Gender()).birthday as string
        ) || ""
      );

      setBirthdayLocationValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getReplacedFields(Gender()).birthdayLocation as string
        ) || ""
      );

      setOrderDepartementValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getReplacedFields(Gender()).orderDepartement as string
        ) || ""
      );

      setOrderDepartmentNumberValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getReplacedFields(Gender())
            .orderDepartmentNumber as string
        ) || ""
      );

      setProfessionnalAddressValue(
        currentPDF()?.getFieldValue(
          currentPDF()?.getReplacedFields(Gender())
            .professionnalAddress as string
        ) || ""
      );
      setGender(currentPDF()?.OCD.replacedGender as GenderEnum);
    })
  );

  function subInputHandler(
    field:
      | "name"
      | "birthday"
      | "birthdayLocation"
      | "orderDepartement"
      | "orderDepartmentNumber"
      | "professionnalAddress"
      | "email",
    value: string
  ) {
    HandleInputChangePDFEditor(
      currentPDF()?.getReplacedFields(Gender() as GenderEnum)[
        `${field}`
      ] as unknown as string,
      value
    );
  }
  function fillWithMyInformations() {
    setToggleItemEvent(!toggleItemEvent());

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
    setProfessionnalAddressValue(userDatas.officeAddress as string);

    subInputHandler("email", userDatas.email);
    subInputHandler("name", userDatas.name);
    subInputHandler("birthday", userDatas.birthday.toString());
    subInputHandler("birthdayLocation", userDatas.bornLocation);
    subInputHandler("orderDepartement", userDatas.department);
    subInputHandler(
      "orderDepartmentNumber",
      userDatas.orderNumber ? userDatas.orderNumber.toString() : ""
    );
    subInputHandler("professionnalAddress", userDatas.personalAddress);
  }

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
      <FitFieldsWithUserData fillWithMyInformations={fillWithMyInformations} />

      <Dialog2InputRadio
        legend="Genre:"
        name="replaced-gender"
        items={[
          {
            id: "replaced-mister",
            text: "Monsieur",
            value: GenderEnum.male,
          },
          {
            id: "replaced-miss",
            text: "Madame",
            value: GenderEnum.female,
          },
        ]}
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setGender(target.value as GenderEnum);
          currentPDF()?.updateOCD({
            replacedGender: target.value as GenderEnum,
          });
        }}
        value={Gender()}
      />

      <LabeledInput
        id="replaced-name"
        label="Nom, prénom"
        type="text"
        onInput={(e) => {
          subInputHandler("name", e.target.value);
        }}
        value={nameValue()}
      />
      <LabeledInput
        id="replaced-mail"
        label="Email"
        type="text"
        onInput={(e) => {
          subInputHandler("email", e.target.value);
        }}
        value={emailValue()}
      />
      <LabeledInput
        id="birthday"
        label="Anniversaire"
        type="date"
        onInput={(e) => {
          subInputHandler("birthday", e.target.value);
        }}
        value={birthdayValue()}
      />
      <LabeledInput
        id="birthday-location"
        label="Née à"
        type="text"
        onInput={(e) => {
          subInputHandler("birthdayLocation", e.target.value);
        }}
        value={birthdayLocationValue()}
      />
      <LabeledInput
        id="department-order"
        label="Département d'ordre"
        type="text"
        onInput={(e) => {
          subInputHandler("orderDepartement", e.target.value);
        }}
        value={orderDepartementValue()}
      />
      <LabeledInput
        id="department-number-order"
        label="Numéro"
        type="text"
        onInput={(e) => {
          subInputHandler("orderDepartmentNumber", e.target.value);
        }}
        value={orderDepartmentNumberValue()}
      />
      <LabeledInput
        id="professional-address"
        label="Adresse profesionnel"
        type="text"
        onInput={(e) => {
          subInputHandler("professionnalAddress", e.target.value);
        }}
        value={professionnalAddressValue()}
      />
    </AccordionItem>
  );
}
