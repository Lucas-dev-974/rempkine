import { AccordionItemType } from "../../../Accordion/AccordionWrapper";
import { Dialog2InputRadio } from "../../../inputs/Dialog2InputRadio";
import { AccordionItem } from "../../../Accordion/AccordionItem";
import { FitFieldsWithUserData } from "./FitFieldsWithUserData";
import { GenderEnum } from "../../../contract/editor/PDFTool";
import { LabeledInput } from "../../../inputs/LabeledInput";
import { UserEntity } from "../../../../models/user.entity";
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

const [gender, setGender] = createSignal<GenderEnum>();
const [email, setEmail] = createSignal<string>("");
const [name, setName] = createSignal<string>("");
const [birthday, setBirthday] = createSignal<string>("");
const [professionnalAddress, setProfessionnalAddress] =
  createSignal<string>("");
const [orderDepartmentNumber, setOrderDepartmentNumber] =
  createSignal<string>("");
const [orderDepartement, setOrderDepartement] = createSignal<string>("");
const [birthdayLocation, setBirthdayLocation] = createSignal<string>("");

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
  HandlerInputChangePDFEditor(
    currentPDF()?.getReplacedFields(gender() as GenderEnum)[
      `${field}`
    ] as unknown as string,
    value
  );
}
export function fillWithMyInformationsReplaced() {
  setFieldUpdatedEvent(!fieldUpdatedEvent());
  const userDatas: UserEntity = storeService.data.user;

  const birth = userDatas.birthday;
  const formattedDate = birth.toString().split("T")[0];

  setEmail(userDatas.email);
  setName(userDatas.fullname);
  setBirthdayLocation(userDatas.bornLocation);
  setBirthday(formattedDate.toString());
  setOrderDepartmentNumber(
    userDatas.orderNumber ? userDatas.orderNumber.toString() : ""
  );
  setGender(userDatas.gender as GenderEnum);
  setOrderDepartement(userDatas.department);
  setProfessionnalAddress(userDatas.officeAdress as string);

  subInputHandler("email", userDatas.email);
  subInputHandler("name", userDatas.fullname);
  subInputHandler("birthday", userDatas.birthday.toString());
  subInputHandler("birthdayLocation", userDatas.bornLocation);
  subInputHandler("orderDepartement", userDatas.department);
  subInputHandler(
    "orderDepartmentNumber",
    userDatas.orderNumber ? userDatas.orderNumber.toString() : ""
  );
  subInputHandler("professionnalAddress", userDatas.officeAdress as string);
}

export function ReplacedFields(props: AccordionFieldsProps) {
  function updateFieldsWithCurrentPDF() {
    setGender(
      (currentPDF()?.OCD.replacedGender as GenderEnum) ||
        GenderEnum.female.toString()
    );

    setEmail(
      currentPDF()?.getFieldValue(
        currentPDF()?.getReplacedFields().email as string
      ) || ""
    );

    setName(
      currentPDF()?.getFieldValue(
        currentPDF()?.getReplacedFields(gender()).name[0] as string
      ) || ""
    );

    setBirthday(
      currentPDF()?.getFieldValue(
        currentPDF()?.getReplacedFields(gender()).birthday as string
      ) || ""
    );

    setBirthdayLocation(
      currentPDF()?.getFieldValue(
        currentPDF()?.getReplacedFields(gender()).birthdayLocation as string
      ) || ""
    );

    setOrderDepartement(
      currentPDF()?.getFieldValue(
        currentPDF()?.getReplacedFields(gender()).orderDepartement as string
      ) || ""
    );

    setOrderDepartmentNumber(
      currentPDF()?.getFieldValue(
        currentPDF()?.getReplacedFields(gender())
          .orderDepartmentNumber as string
      ) || ""
    );

    setProfessionnalAddress(
      currentPDF()?.getFieldValue(
        currentPDF()?.getReplacedFields(gender()).professionnalAddress as string
      ) || ""
    );
    setGender(currentPDF()?.OCD.replacedGender as GenderEnum);
  }

  createEffect(on(fieldUpdatedEvent, () => updateFieldsWithCurrentPDF()));

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
      <FitFieldsWithUserData
        fillWithMyInformations={fillWithMyInformationsReplaced}
      />

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
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={gender()}
      />

      <LabeledInput
        id="replaced-name"
        label="Nom, prénom"
        type="text"
        onInput={(e) => {
          subInputHandler("name", e.target.value);
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={name()}
      />
      <LabeledInput
        id="replaced-mail"
        label="Email"
        type="text"
        onInput={(e) => {
          subInputHandler("email", e.target.value);
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={email()}
      />
      <LabeledInput
        id="birthday"
        label="Née le"
        type="date"
        onInput={(e) => {
          subInputHandler("birthday", e.target.value);
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={birthday()}
      />
      <LabeledInput
        id="birthday-location"
        label="Née à"
        type="text"
        onInput={(e) => {
          subInputHandler("birthdayLocation", e.target.value);
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={birthdayLocation()}
      />
      <LabeledInput
        id="department-order"
        label="Département d'ordre"
        type="text"
        onInput={(e) => {
          subInputHandler("orderDepartement", e.target.value);
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={orderDepartement()}
      />
      <LabeledInput
        id="department-number-order"
        label="Numéro"
        type="text"
        onInput={(e) => {
          subInputHandler("orderDepartmentNumber", e.target.value);
        }}
        value={orderDepartmentNumber()}
      />
      <LabeledInput
        id="professional-address"
        label="Adresse profesionnel"
        type="text"
        onInput={(e) => {
          subInputHandler("professionnalAddress", e.target.value);
          setFieldUpdatedEvent(!fieldUpdatedEvent());
        }}
        value={professionnalAddress()}
      />
    </AccordionItem>
  );
}
