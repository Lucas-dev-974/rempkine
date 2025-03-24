import { AuthorsEnum, GenderEnum } from "../components/contract/editor/PDFTool";

export type ContractEntity = {
  authorEmail: string;
  authorName: string;
  authorStatus: AuthorsEnum;
  startDate: string;
  endDate: string;
  percentReturnToSubstitute: number;
  percentReturnToSubstituteBeforeDate: Date;
  nonInstallationRadius: number;
  conciliationCDOMK: string;
  doneAtLocation: string;
  doneAtDate: Date;

  // -- ReplacedFields
  replacedGender: GenderEnum;
  replacedEmail: string;
  replacedName: string;
  replacedBirthday: Date;
  replacedBirthdayLocation: string;
  replacedOrderDepartement: string;
  replacedOrderDepartmentNumber: number;
  replacedProfessionnalAddress: string;

  // -- SubstituteFields
  substituteGender: GenderEnum;
  substituteEmail: string;
  substituteName: string;
  substituteBirthday: Date;
  substituteBirthdayLocation: string;
  substituteOrderDepartement: string;
  substituteOrderDepartmentNumber: number;
};
