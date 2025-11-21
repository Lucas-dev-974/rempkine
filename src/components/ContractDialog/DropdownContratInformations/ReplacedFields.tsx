import { currentPDFTool, HandlerToUpdateCanvasInputs, setCurrentPDFTool } from "../../ContractEditor/PDFEditor";
import { DorpdownItemType } from "../../Dropdown/DropdownWrapper";
import { RadioButtons } from "../../inputs/DialogToInputRadio";
import { DropdownItem } from "../../Dropdown/DropdownItem";
import { FitFieldsWithUserData } from "./FitFieldsWithUserData";
import { GenderEnum } from "../../ContractEditor/PDFTool";
import { LabeledInput } from "../../inputs/LabeledInput";
import { UserEntity } from "../../../models/user.entity";
import storeService from "../../../utils/store.service";
import { createSignal, Show, onMount } from "solid-js";
import { formatDateForInput } from "./ContratInformationsDropdowns";
import { contractService } from "../../../services/contract.service";
import { loadContract, loggedIn } from "../../../const.data";

export interface AccordionFieldsProps {
  toggleItem: ((id: number) => void) | ((id: number) => void);
  items: DorpdownItemType[] | (() => DorpdownItemType[]);
}

const [professionnalAddress, setProfessionnalAddress] = createSignal<string>("");
const [orderDepartmentNumber, setOrderDepartmentNumber] = createSignal<string>("");
const [birthdayLocation, setBirthdayLocation] = createSignal<string>("");
const [orderDepartement, setOrderDepartement] = createSignal<string>("");
const [gender, setGender] = createSignal<GenderEnum>(GenderEnum.male);
const [birthday, setBirthday] = createSignal<string>("");
const [email, setEmail] = createSignal<string>("");
const [name, setName] = createSignal<string>("");
const [valid, setValid] = createSignal<boolean>(false);

function isValid() {
  if (name() && email() && birthday() && birthdayLocation() && orderDepartement() && orderDepartmentNumber() && professionnalAddress()) {
    setValid(true);
  } else {
    setValid(false);
  }
}

function HandlerToUpdateFormInputsAndPDFInputs(
  field: "name" | "birthday" | "birthdayLocation" | "orderDepartement" | "orderDepartmentNumber" | "professionnalAddress" | "email",
  value: string
) {
  const fieldsIdsByGender = currentPDFTool()?.getReplacedFieldsIds(gender() as GenderEnum)[`${field}`] as unknown as string

  if (field == "name") {
    if (gender() == GenderEnum.male) {
      const fieldIdOfNameForFemaleGender = currentPDFTool()?.getReplacedFieldsIds(GenderEnum.female)[`${field}`] as unknown as string
      HandlerToUpdateCanvasInputs(fieldIdOfNameForFemaleGender, "");
    } else {
      const fieldIdOfNameForMaleGender = currentPDFTool()?.getReplacedFieldsIds(GenderEnum.male)[`${field}`] as unknown as string
      HandlerToUpdateCanvasInputs(fieldIdOfNameForMaleGender, "");
    }
  }

  HandlerToUpdateCanvasInputs(fieldsIdsByGender, value);
  handlerToUpdateFormInputsWithContratData()
  isValid()
}

export function fillWithMyInformationsReplaced() {
  const userDatas: UserEntity = storeService.data.user;

  HandlerToUpdateFormInputsAndPDFInputs("email", userDatas.email);
  HandlerToUpdateFormInputsAndPDFInputs("name", userDatas.fullname);
  HandlerToUpdateFormInputsAndPDFInputs("birthday", userDatas.birthday.toString());
  HandlerToUpdateFormInputsAndPDFInputs("birthdayLocation", userDatas.bornLocation);
  HandlerToUpdateFormInputsAndPDFInputs("orderDepartement", userDatas.department);
  HandlerToUpdateFormInputsAndPDFInputs("orderDepartmentNumber", userDatas.orderNumber ? userDatas.orderNumber.toString() : "");
  HandlerToUpdateFormInputsAndPDFInputs("professionnalAddress", userDatas.officeAdress as string);
}

export function handlerToUpdateFormInputsWithContratData() {
  setGender(currentPDFTool()?.contractData.replacedGender ?? GenderEnum.male);
  setEmail(currentPDFTool()?.contractData.replacedEmail!);
  setName(currentPDFTool()?.contractData.replacedName!);
  setBirthday(formatDateForInput(currentPDFTool()?.contractData.replacedBirthday!))
  setBirthdayLocation(currentPDFTool()?.contractData.replacedBirthdayLocation!);
  setOrderDepartement(currentPDFTool()?.contractData.replacedOrderDepartement!);
  setOrderDepartmentNumber(currentPDFTool()?.contractData.replacedOrderDepartmentNumber?.toString()!);
  setProfessionnalAddress(currentPDFTool()?.contractData.replacedProfessionnalAddress!);
}

export function ReplacedFields(props: AccordionFieldsProps) {
  onMount(() => {
    if (loadContract()) {
      handlerToUpdateFormInputsWithContratData()
    } else {
      setGender(GenderEnum.male);
      setEmail("");
      setName("");
      setBirthday("")
      setBirthdayLocation("");
      setOrderDepartement("");
      setOrderDepartmentNumber("");
      setProfessionnalAddress("");
    }
    isValid()
  })


  return (
    <DropdownItem
      id={1}
      title="Le remplacé"
      toggle={props.toggleItem}
      isOpen={
        (typeof props.items === "function" ? props.items() : props.items).find(
          (i: { id: number }) => i.id === 1
        )?.isOpen ?? false
      }
      valid={valid()}
    >
      <Show when={loggedIn()}>
        <FitFieldsWithUserData fillWithMyInformations={fillWithMyInformationsReplaced} />
      </Show>

      <RadioButtons
        legend="Genre"
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
          setCurrentPDFTool((prev) => {
            if (!prev) return prev
            prev.contractData = {
              ...prev.contractData,
              replacedGender: target.value as GenderEnum,
            };
            return prev
          })
        }}
        value={gender()}
      />

      <LabeledInput
        id="replaced-name"
        label="Nom, prénom"
        type="text"
        onInput={(e) => {
          HandlerToUpdateFormInputsAndPDFInputs("name", e.target.value);
        }}
        value={name()}
      />
      <LabeledInput
        id="replaced-mail"
        label="Email"
        type="text"
        onInput={(e) => {
          HandlerToUpdateFormInputsAndPDFInputs("email", e.target.value);
        }}
        value={email()}
      />
      <LabeledInput
        id="birthday"
        label="Née le"
        type="date"
        onInput={(e) => {
          HandlerToUpdateFormInputsAndPDFInputs("birthday", e.target.value);
        }}
        value={birthday()}
      />
      <LabeledInput
        id="birthday-location"
        label="Née à"
        type="text"
        onInput={(e) => {
          HandlerToUpdateFormInputsAndPDFInputs("birthdayLocation", e.target.value);

        }}
        value={birthdayLocation()}
      />
      <LabeledInput
        id="department-order"
        label="Département d'ordre"
        type="text"
        onInput={(e) => {
          HandlerToUpdateFormInputsAndPDFInputs("orderDepartement", e.target.value);

        }}
        value={orderDepartement()}
      />
      <LabeledInput
        id="department-number-order"
        label="Numéro d'ordre"
        type="text"
        onInput={(e) => {
          HandlerToUpdateFormInputsAndPDFInputs("orderDepartmentNumber", e.target.value);

        }}
        value={orderDepartmentNumber()}
      />
      <LabeledInput
        id="professional-address"
        label="Adresse profesionnel"
        type="text"
        onInput={(e) => {
          HandlerToUpdateFormInputsAndPDFInputs("professionnalAddress", e.target.value);

        }}
        value={professionnalAddress()}
      />
    </DropdownItem>
  );
}
