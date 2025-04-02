import { createSignal } from "solid-js";
import storeService from "./utils/store.service";
import { ContractEntity } from "./models/contract.entity";

export const [loggedIn, setLoggedIn] = createSignal<boolean>(
  storeService.proxy.isLogin ?? false
);

// * Contract Signal
export const [loadContract, setLoadContrat] = createSignal<ContractEntity>();
