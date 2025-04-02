import { AuthorsEnum, GenderEnum } from "../components/contract/editor/PDFTool";

export type UserEntity = {
  id?: number;
  fullname: string;
  email: string;
  orderNumber?: number;
  department: string;
  birthday: Date;
  bornLocation: string;
  password?: string;

  personalAdress: string;
  officeAdress?: string;
  gender?: GenderEnum;
  status: AuthorsEnum;
};
