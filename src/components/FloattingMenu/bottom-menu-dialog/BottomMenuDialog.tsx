import { BottomMenuDocs } from "./bottom-menu-page/BottomMenuDocs";
import { createSignal, Match, Switch } from "solid-js";
import { Show } from "solid-js";

import "./BottomMenuDialog.css";

export const [isBottomMenuVisible, setIsBottomMenuVisible] = createSignal(false);
export const toggleDialog = () => setIsBottomMenuVisible(!isBottomMenuVisible());

export const [bottomMenuPage, setBottomMenuPage] = createSignal("");
export enum BottomMenuPageEnum {
  account = "Compte",
  contracts = "Contract",
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
        <div class="overlay" onClick={() => setIsBottomMenuVisible(false)} />
      </Show>
      <div
        class="bottom-menu-dialog"
        classList={{
          "translate-y-full": !isBottomMenuVisible(),
          "translate-y-0": isBottomMenuVisible(),
        }}
      >
        <Switch>
          <Match when={bottomMenuPage() === BottomMenuPageEnum.contracts}>
            <BottomMenuDocs />
          </Match>
        </Switch>
      </div>
    </>
  );
}
