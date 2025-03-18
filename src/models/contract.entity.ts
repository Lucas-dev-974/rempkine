export type ContractEntity = {
  contractAuthor: string;
  authorEmail: string;

  name: string;
  author: string;
  startDate: string;
  endDate: string;
  percentReturnToSubstitute: string;
  percentReturnToSubstituteBeforeDate: string;
  nonInstallationRadius: string;
  conciliationCDOMK: string;
  doneAtLocation: string;
  doneAt: string;

  // -- ReplacedFields
  replacedGender: string;
  replacedEmail: string;
  replacedName: string;
  replacedBirthday: string;
  replacedBirthdayLocation: string;
  replacedOrderDepartement: string;
  replacedOrderDepartmentNumber: string;
  replacedProfessionnalAddress: string;

  // -- SubstituteFields
  substituteGender: string;
  substituteEmail: string;
  substituteName: string;
  substituteBirthday: string;
  substituteBirthdayLocation: string;
  substituteOrderDepartement: string;
  substituteOrderDepartmentNumber: string;
};
