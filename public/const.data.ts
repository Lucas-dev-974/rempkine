import { createSignal } from "solid-js";
import storeService from "../src/utils/store.service";
import { ContractEntity } from "../src/models/contract.entity";

export const [loggedIn, setLoggedIn] = createSignal<boolean>(storeService.proxy.isLogin ?? false);
export const [loadContract, setLoadContrat] = createSignal<Partial<ContractEntity>>();
