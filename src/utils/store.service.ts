// import { UserAttributes } from "../models/User";

import { createSignal } from "solid-js";
import { setContracts } from "../components/FloattingMenu/bottom-menu-dialog/bottom-menu-page/bottom-menu-pages/BottomMenuPageContract";
import { ContractEntity } from "../models/contract.entity";

export const [localeUpdateEnvent, setLocalUpdateEvent] = createSignal<boolean>(false)

type StoreDataType = {
  [key: string]: any;
  isLogin: boolean | undefined;
  contracts?: Partial<ContractEntity>[]
};

class StoreService {
  public data: StoreDataType = {
    isLogin: undefined,
    contracts: []
  };

  public proxy = new Proxy(this.data, {
    get(target, property, receiver) {
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      const toReturn = Reflect.set(target, property, value, receiver);
      if (property === "contracts") {
        setLocalUpdateEvent(!localeUpdateEnvent())
      }
      localStorage.setItem("store", JSON.stringify(target));
      return toReturn;
    },
  });

  constructor() {
    if (!this.getStore()) this.setState();
    const storeData = this.getStore();

    for (const key in storeData) {
      this.proxy[key] = storeData[key];
    }
    this.proxy.isLogin = storeData.isLogin;
  }

  getStore(): StoreDataType {
    return JSON.parse(localStorage.getItem("store") as string) as StoreDataType;
  }

  setState() {
    localStorage.setItem("store", JSON.stringify(this.proxy));
  }
}

export default new StoreService();
