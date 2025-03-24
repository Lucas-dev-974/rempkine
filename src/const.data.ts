import { createSignal } from "solid-js";
import storeService from "./utils/store.service";

export const [loggedIn, setLoggedIn] = createSignal<boolean>(
  storeService.proxy.isLogin ?? false
);
