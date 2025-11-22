import { currentPDFTool, HandlerToUpdateCanvasInputs } from "../../ContractEditor/PDFEditor";
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

// Mapping des noms de champs UI vers les noms de champs ContractEntity
const FIELD_MAPPING: Record<string, keyof import("../../../models/contract.entity").ContractEntity> = {
  name: "replacedName",
  birthday: "replacedBirthday",
  birthdayLocation: "replacedBirthdayLocation",
  orderDepartement: "replacedOrderDepartement",
  orderDepartmentNumber: "replacedOrderDepartmentNumber",
  professionnalAddress: "replacedProfessionnalAddress",
  email: "replacedEmail",
  gender: "replacedGender",
};

function HandlerToUpdateFormInputsAndPDFInputs(
  field: "name" | "birthday" | "birthdayLocation" | "orderDepartement" | "orderDepartmentNumber" | "professionnalAddress" | "email",
  value: string,
  immediateContractUpdate: boolean = false
) {
  const tool = currentPDFTool();
  if (!tool) return;

  const contractField = FIELD_MAPPING[field];
  if (!contractField) return;

  const currentGender = gender() as GenderEnum;

  // Si c'est le champ name, vider les champs du genre opposé
  // IMPORTANT: Ne pas mettre à jour contractData (updateContractData=false) car on va mettre à jour
  // le bon champ juste après, et cela éviterait d'écraser la valeur avec une chaîne vide
  if (field === "name") {
    const oppositeGender = currentGender === GenderEnum.male ? GenderEnum.female : GenderEnum.male;
    const oppositeIds = tool.getReplacedFieldsIds(oppositeGender)[field] as unknown as string | string[];
    const idsArray = Array.isArray(oppositeIds) ? oppositeIds : [oppositeIds];
    idsArray.forEach(id => HandlerToUpdateCanvasInputs(id, "", false, false));
  }

  // Mettre à jour le champ avec la nouvelle valeur
  const fieldsIdsByGender = tool.getReplacedFieldsIds(currentGender)[field] as unknown as string | string[];
  const idsArray = Array.isArray(fieldsIdsByGender) ? fieldsIdsByGender : [fieldsIdsByGender];

  // Pour l'auto-complétion (immediateContractUpdate=true), on met à jour uniquement l'affichage PDF
  // et on laisse updateField gérer contractData une seule fois à la fin (évite les appels redondants)
  // Pour la saisie normale, on laisse HandlerToUpdateCanvasInputs gérer avec le debounce
  if (immediateContractUpdate) {
    // Mise à jour uniquement de l'affichage PDF, pas de contractData (sera fait par updateField ci-dessous)
    idsArray.forEach(id => {
      HandlerToUpdateCanvasInputs(id, value, false, false);
    });
    // Mettre à jour contractData une seule fois pour tous les IDs PDF
    tool.updateField(contractField, value, { immediate: true, gender: currentGender });
  } else {
    // Pour la saisie normale, laisser HandlerToUpdateCanvasInputs gérer avec le debounce
    idsArray.forEach(id => {
      HandlerToUpdateCanvasInputs(id, value, true, false);
    });
  }

  // Mettre à jour uniquement le signal du champ modifié au lieu de tous les champs
  // Cela évite de réinitialiser le champ en cours de modification avec une valeur obsolète
  switch (field) {
    case "name":
      setName(value);
      break;
    case "email":
      setEmail(value);
      break;
    case "birthday":
      setBirthday(value);
      break;
    case "birthdayLocation":
      setBirthdayLocation(value);
      break;
    case "orderDepartement":
      setOrderDepartement(value);
      break;
    case "orderDepartmentNumber":
      setOrderDepartmentNumber(value);
      break;
    case "professionnalAddress":
      setProfessionnalAddress(value);
      break;
  }

  isValid();
}

export function fillWithMyInformationsReplaced() {
  const userDatas: UserEntity = storeService.data.user;
  const tool = currentPDFTool();
  if (!tool) return;

  // Récupérer le genre depuis le store réactif (pas depuis contractData qui peut être désynchronisé)
  const contractDataFromStore = tool.getContractData();
  const currentGender = contractDataFromStore.replacedGender ?? GenderEnum.male;
  setGender(currentGender);

  // S'assurer que replacedGender est défini dans le store
  if (!contractDataFromStore.replacedGender) {
    tool.updateField("replacedGender", currentGender, { immediate: true });
  }

  // Utiliser immediateContractUpdate=true pour éviter que le debounce n'annule les mises à jour précédentes
  // IMPORTANT: Mettre à jour replacedName en premier pour s'assurer qu'il est bien dans le store
  HandlerToUpdateFormInputsAndPDFInputs("name", userDatas.fullname, true);
  HandlerToUpdateFormInputsAndPDFInputs("email", userDatas.email, true);
  // Formater la date correctement pour l'input de type "date" (YYYY-MM-DD)
  const formattedBirthday = formatDateForInput(userDatas.birthday instanceof Date ? userDatas.birthday.toISOString() : userDatas.birthday);
  HandlerToUpdateFormInputsAndPDFInputs("birthday", formattedBirthday, true);
  HandlerToUpdateFormInputsAndPDFInputs("birthdayLocation", userDatas.bornLocation, true);
  HandlerToUpdateFormInputsAndPDFInputs("orderDepartement", userDatas.department, true);
  HandlerToUpdateFormInputsAndPDFInputs("orderDepartmentNumber", userDatas.orderNumber ? userDatas.orderNumber.toString() : "", true);
  HandlerToUpdateFormInputsAndPDFInputs("professionnalAddress", userDatas.officeAdress as string, true);

  // Debug: vérifier que replacedName est bien dans le store après mise à jour
  if (import.meta.env.DEV) {
    setTimeout(() => {
      const updatedData = tool.getContractData();
      console.log("Après fillWithMyInformationsReplaced:", {
        replacedName: updatedData.replacedName,
        replacedEmail: updatedData.replacedEmail,
        replacedGender: updatedData.replacedGender
      });
    }, 100);
  }
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
          const tool = currentPDFTool();
          if (!tool) return;
          const newGender = target.value as GenderEnum;
          setGender(newGender);
          // Utiliser updateField pour mettre à jour le genre dans contractData
          tool.updateField("replacedGender", newGender, { immediate: true });
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
