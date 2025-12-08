import { createSignal } from "solid-js";
import { ContractEntity } from "../models/contract.entity";

export const [localeUpdateEvent, setLocalUpdateEvent] = createSignal<boolean>(false)

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
        setLocalUpdateEvent(!localeUpdateEvent())
      }
      localStorage.setItem("store", JSON.stringify(target));
      return toReturn;
    },
  });

  constructor() {
    const storeData = this.getStore();
    if (!storeData) {
      this.setState();
      return;
    }

    for (const key in storeData) {
      this.proxy[key] = storeData[key];
    }
    this.proxy.isLogin = storeData.isLogin;
  }

  getStore(): StoreDataType | null {
    const stored = localStorage.getItem("store");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as StoreDataType;
    } catch {
      return null;
    }
  }

  setState() {
    localStorage.setItem("store", JSON.stringify(this.proxy));
  }

  /**
   * Vide toutes les données utilisateur du localStorage et réinitialise le store
   */
  clearUserData() {
    // Réinitialiser les données utilisateur dans le proxy
    this.proxy.isLogin = false;
    this.proxy.token = "";
    this.proxy.user = {};
    this.proxy.contracts = [];

    // Vider complètement le localStorage
    localStorage.removeItem("store");

    // Réinitialiser l'état par défaut
    this.data = {
      isLogin: undefined,
      contracts: []
    };
  }
}

export default new StoreService();
