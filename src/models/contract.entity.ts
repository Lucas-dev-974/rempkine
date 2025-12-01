import { AuthorsEnum, GenderEnum } from "../utils/PDFTool";

export type ContractEntity = {
  id: string | number;
  // authorEmail: string;
  // authorName: string;

  startDate: string;
  endDate: string;
  percentReturnToSubstitute: number;
  percentReturnToSubstituteBeforeDate: string;
  nonInstallationRadius: number;
  conciliationCDOMK: string;
  doneAtLocation: string;
  doneAt: string;

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
  deleted?: boolean

  updatedAt?: Date
};
