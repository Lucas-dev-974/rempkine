import { AuthorsEnum, GenderEnum } from "../components/contract/editor/PDFTool";

export type ContractEntity = {
  id: string;
  authorEmail: string;
  authorName: string;

  startDate: string;
  endDate: string;
  percentReturnToSubstitute: number;
  percentReturnToSubstituteBeforeDate: string;
  nonInstallationRadius: number;
  conciliationCDOMK: string;
  doneAtLocation: string;
  doneAtDate: string;

  // -- ReplacedFields
  replacedGender: GenderEnum;
  replacedEmail: string;
  replacedName: string;
  replacedBirthday: string;
  replacedBirthdayLocation: string;
  replacedOrderDepartement: string;
  replacedOrderDepartmentNumber: number;
  replacedProfessionnalAddress: string;

  // -- SubstituteFields
  substituteGender: GenderEnum;
  substituteEmail: string;
  substituteName: string;
  substituteBirthday: string;
  substituteBirthdayLocation: string;
  substituteOrderDepartement: string;
  substituteOrderDepartmentNumber: number;
  substituteAdress: string

  replacedSignatureDataUrl: string;
  substituteSignatureDataUrl: string;

  logoutCreate?: boolean
};
