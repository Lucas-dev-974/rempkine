import { BottomMenuPageRouter } from "./bottom-menu-page/BottomMenuPageRouter";
import { createSignal, Match, Switch } from "solid-js";
import { Show } from "solid-js";

export const [isBottomMenuVisible, setIsBottomMenuVisible] = createSignal(false);
export const toggleDialog = () => setIsBottomMenuVisible(!isBottomMenuVisible());

export const [bottomMenuPage, setBottomMenuPage] = createSignal("");
export enum BottomMenuPageEnum {
  account = "Compte",
  contracts = "Contrats",
  none = "none",
}

export const setBottomMenuPageValue = (value: BottomMenuPageEnum) => {
  setBottomMenuPage(value);
  setIsBottomMenuVisible(true);
};

export function BottomMenuDialog() {
  return (
    <>
      <Show when={isBottomMenuVisible()}>
        <div class="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsBottomMenuVisible(false)} />
      </Show>
      <div class="fixed bottom-0 left-0 w-full bg-white rounded-t-lg shadow-lg z-50 transform transition-transform duration-1000 h-[600px]"
        classList={{
          "translate-y-full": !isBottomMenuVisible(),
          "translate-y-0": isBottomMenuVisible(),
        }}
      >
        <BottomMenuPageRouter />
      </div>
    </>
  );
}
