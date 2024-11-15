export type UserEntity = {
  id?: number;
  name: string;
  lastName: string;
  address: string;
  email: string;
  odreNumber: number;
  department: string;
  birthday: Date;
  bornLocation: string;
  password?: string;

  officeAddress?: string;
  gender?: "M" | "F";
};

export const user1: UserEntity = {
  address: "5 rue du maine",
  name: "lucas",
  lastName: "lvn",
  email: "lcs.lvn@gmail.com",
  odreNumber: 123,
  department: "Réunion",
  birthday: new Date("18 march 2002"),
  bornLocation: "Saint benoit",
  gender: "M",
};

export const user2: UserEntity = {
  address: "10 rue du maine",
  name: "Sandrine",
  lastName: "hoareau",
  email: "sandrine.h@gmail.com",
  odreNumber: 456,
  department: "Réunion",
  birthday: new Date("28 march 2002"),
  bornLocation: "Saint Denis",
  gender: "F",
};

export const users = [user1, user2];
