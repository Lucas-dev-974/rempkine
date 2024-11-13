import { createSignal, For } from "solid-js";

const [contracts, setContracts] = createSignal<Partial<ContractEntity>[]>([]);

type ContractEntity = {
  replacedName: string;
  replacedLicenceNumber: number;
  replacedRegionalCouncil: string;

  substituteName: string;
  substituteLicenseNumber: number;
  substituteRegionalCouncil: string;
  substituteBirthday: Date;
  substituteBornLocation: string;
  substituteEmail: string;

  startDateContract: Date;
  endDateContract: Date;
  retrosession: number;
  limitDatePaiment: Date;
  ScopeOfNonCompeteClause: any;

  contractDate: Date;
  contractLocation: string;
};

export function ContractList() {
  return <For each={contracts()}>{(contract) => <div></div>}</For>;
}
