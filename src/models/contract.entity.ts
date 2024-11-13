export type ContractEntity = {
  name: string;
  pages: {
    pageNumber: number;
    fields: {
      id: string;
      type: string;
      name: string;
      value: string;
    }[];
  }[];
};
