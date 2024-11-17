import { createEffect, createSignal, on } from "solid-js";
import storeService from "./utils/store.service";

export const [loggedIn, setLoggedIn] = createSignal<boolean>(
  storeService.proxy.isLogin ?? false
);

export function setEffect() {
  createEffect(on(loggedIn, () => (storeService.proxy.isLogin = loggedIn())));
}
