import { currentPDFTool, HandlerToUpdateCanvasInputs, setCurrentPDFTool } from "../../ContractEditor/PDFEditor";
import { DorpdownItemType } from "../../Dropdown/DropdownWrapper";
import { RadioButtons } from "../../inputs/DialogToInputRadio";
import { DropdownItem } from "../../Dropdown/DropdownItem";
import { FitFieldsWithUserData } from "./FitFieldsWithUserData";
import { GenderEnum } from "../../ContractEditor/PDFTool";
import { UserEntity } from "../../../models/user.entity";
import { LabeledInput } from "../../inputs/LabeledInput";
import storeService from "../../../utils/store.service";
import { formatDateForInput } from "./ContratInformationsDropdowns";
import { createSignal, onMount, Show } from "solid-js";
import { loadContract, loggedIn } from "../../../../public/const.data";

interface AccordionFieldsProps {
  toggleItem: ((id: number) => void) | ((id: number) => void);
  items: DorpdownItemType[] | (() => DorpdownItemType[]);
}

// ------------ Input fields signals ------------
const [professionnalAddress, setProfessionnalAddress] = createSignal<string>("");
const [orderDepartmentNumber, setOrderDepartmentNumber] = createSignal<string>("");
const [birthdayLocation, setBirthdayLocation] = createSignal<string>("");
const [orderDepartement, setOrderDepartement] = createSignal<string>("");
const [birthday, setBirthday] = createSignal<string>("");
const [email, setEmail] = createSignal<string>("");
const [name, setName] = createSignal<string>("");
const [gender, setGender] = createSignal<GenderEnum>(GenderEnum.male);
const [valid, setValid] = createSignal<boolean>(false);


function isValid() {
  if (name() && email() && birthday() && birthdayLocation() && orderDepartement() && orderDepartmentNumber() && professionnalAddress()) {
    setValid(true);
  } else {
    setValid(false);
  }
}

function HandlerToUpdateFormInputsAndPDFInputs(
  field: | "name" | "birthday" | "birthdayLocation" | "orderDepartement" | "orderDepartmentNumber" | "address" | "email",
  value: string,
) {
  const fieldsIdsByGender = currentPDFTool()?.getSubstituteFieldsIds(gender() as GenderEnum)[`${field}`] as unknown as string

  // if update name and gender changed clear the wrong gender fields in canvas inputs
  if (field == "name") {
    if (gender() == GenderEnum.male) {
      const fieldIdOfNameForFemaleGender = currentPDFTool()?.getSubstituteFieldsIds(GenderEnum.female)[`${field}`] as unknown as string
      HandlerToUpdateCanvasInputs(fieldIdOfNameForFemaleGender, "", false);
    } else {
      const fieldIdOfNameForMaleGender = currentPDFTool()?.getSubstituteFieldsIds(GenderEnum.male)[`${field}`] as unknown as string
      HandlerToUpdateCanvasInputs(fieldIdOfNameForMaleGender, "", false);
    }
  }
  HandlerToUpdateCanvasInputs(fieldsIdsByGender, value);
  handlerToUpdateFormInputsWithContratData()
  isValid()
}

export function fillWithMyInformationsSubstitute() {
  const userDatas: UserEntity = storeService.data.user;

  HandlerToUpdateFormInputsAndPDFInputs("email", userDatas.email);
  HandlerToUpdateFormInputsAndPDFInputs("name", userDatas.fullname);
  HandlerToUpdateFormInputsAndPDFInputs("birthday", userDatas.birthday.toString());
  HandlerToUpdateFormInputsAndPDFInputs("birthdayLocation", userDatas.bornLocation);
  HandlerToUpdateFormInputsAndPDFInputs("orderDepartement", userDatas.department);
  HandlerToUpdateFormInputsAndPDFInputs("orderDepartmentNumber", userDatas.orderNumber ? userDatas.orderNumber.toString() : "");
  HandlerToUpdateFormInputsAndPDFInputs("address", userDatas.personalAdress);
}

export function handlerToUpdateFormInputsWithContratData() {
  setGender(currentPDFTool()?.contractData.substituteGender ?? GenderEnum.male);
  setEmail(currentPDFTool()?.contractData.substituteEmail!);
  setName(currentPDFTool()?.contractData.substituteName!);
  setBirthday(formatDateForInput(currentPDFTool()?.contractData.substituteBirthday!));
  setBirthdayLocation(currentPDFTool()?.contractData.substituteBirthdayLocation!);
  setOrderDepartement(currentPDFTool()?.contractData.substituteOrderDepartement!);
  setOrderDepartmentNumber(currentPDFTool()?.contractData.substituteOrderDepartmentNumber?.toString()!);
  setProfessionnalAddress(currentPDFTool()?.contractData.substituteAdress!);
}

export function SubstituteFields(props: AccordionFieldsProps) {
  onMount(() => {
    if (loadContract()) {
      handlerToUpdateFormInputsWithContratData()
    } else {
      setGender(GenderEnum.male);
      setEmail("");
      setName("");
      setBirthday("");
      setBirthdayLocation("");
      setOrderDepartement("");
      setOrderDepartmentNumber("");
      setProfessionnalAddress("");
    }
    isValid()
  })

  return (
    <DropdownItem
      id={2}
      title="Le remplacant"
      toggle={props.toggleItem}
      isOpen={(typeof props.items === "function" ? props.items() : props.items).find((i) => i.id === 2)?.isOpen}
      valid={valid()}
    >

      <Show when={loggedIn()}>
        <FitFieldsWithUserData
          fillWithMyInformations={fillWithMyInformationsSubstitute}
        />
      </Show>

      <RadioButtons
        legend="Genre"
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
          setCurrentPDFTool((prev) => {
            if (!prev) return prev
            prev.contractData = {
              ...prev.contractData,
              substituteGender: target.value as GenderEnum,
            };
            return prev
          })
          isValid()
        }}
        value={gender() as GenderEnum}
      />
      <LabeledInput
        id="substitute-name"
        label="Nom, prénom"
        type="text"
        onInput={(e) => { HandlerToUpdateFormInputsAndPDFInputs("name", e.target.value); isValid() }}
        value={name()}
      />
      <LabeledInput
        id="substitute-mail"
        label="Email"
        type="text"
        onInput={(e) => HandlerToUpdateFormInputsAndPDFInputs("email", e.target.value)}
        value={email()}
      />
      <LabeledInput
        id="substitute-birthday"
        label="Née le"
        type="date"
        onInput={(e) => HandlerToUpdateFormInputsAndPDFInputs("birthday", e.target.value)}
        value={birthday()}
      />
      <LabeledInput
        id="substitute-birthday-location"
        label="Née à"
        type="text"
        onInput={(e) => HandlerToUpdateFormInputsAndPDFInputs("birthdayLocation", e.target.value)}
        value={birthdayLocation()}
      />
      <LabeledInput
        id="department-order"
        label="Département d'ordre"
        type="text"
        onInput={(e) => HandlerToUpdateFormInputsAndPDFInputs("orderDepartement", e.target.value)}
        value={orderDepartement()}
      />
      <LabeledInput
        id="department-number-order"
        label="Numéro d'ordre"
        type="number"
        onInput={(e) => HandlerToUpdateFormInputsAndPDFInputs("orderDepartmentNumber", e.target.value)}
        value={orderDepartmentNumber()}
      />
      <LabeledInput
        id="substitute-address"
        label="Adresse"
        type="text"
        onInput={(e) => HandlerToUpdateFormInputsAndPDFInputs("address", e.target.value)}
        value={professionnalAddress()}
      />
    </DropdownItem>
  );
}
