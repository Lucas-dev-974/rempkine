import { BottomMenuDocs } from "./bottom-menu-page/BottomMenuDocs";
import { createSignal, Match, Switch } from "solid-js";
import { Show } from "solid-js";

import "./BottomMenuDialog.css";

const [bottomMenuDialog, setBottomMenuDialog] = createSignal(false);
export const toggleDialog = () => setBottomMenuDialog(!bottomMenuDialog());

export const [bottomMenuPage, setBottomMenuPage] = createSignal("");
export enum BottomMenuPageEnum {
  account = "Compte",
  docs = "Docs",
  none = "none",
}

export const setBottomMenuPageValue = (value: BottomMenuPageEnum) => {
  setBottomMenuPage(value);
  setBottomMenuDialog(true);
};

export function BottomMenuDialog() {
  return (
    <>
      <Show when={bottomMenuDialog()}>
        <div class="overlay" onClick={() => setBottomMenuDialog(false)} />
      </Show>
      <div
        class="bottom-menu-dialog"
        classList={{
          "translate-y-full": !bottomMenuDialog(),
          "translate-y-0": bottomMenuDialog(),
        }}
      >
        <Switch>
          <Match when={bottomMenuPage() === BottomMenuPageEnum.docs}>
            <BottomMenuDocs />
          </Match>
        </Switch>
      </div>
    </>
  );
}
