// import { UserAttributes } from "../models/User";

type StoreDataType = {
  [key: string]: any;
  isLogin: boolean | undefined;
};

class StoreService {
  public data: StoreDataType = {
    // user: undefined,
    isLogin: undefined,
  };

  public proxy = new Proxy(this.data, {
    get(target, property, receiver) {
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      const toReturn = Reflect.set(target, property, value, receiver);
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
