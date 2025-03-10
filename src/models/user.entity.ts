import { GenderEnum } from "../components/contract/editor/PDFTool";

export type UserEntity = {
  id?: number;
  name: string;
  lastName: string;
  email: string;
  orderNumber?: number;
  department: string;
  birthday: Date;
  bornLocation: string;
  password?: string;

  personalAddress: string;
  officeAddress?: string;
  gender?: GenderEnum;
};
