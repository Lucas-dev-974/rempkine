import { FloatingMenuItems } from "./bottom-menu-dialog/FloatingMenuItems";
import { BottomMenuDialog } from "./bottom-menu-dialog/BottomMenuDialog";
import { loggedIn } from "../../const.data";
import { Show } from "solid-js";

import "./FloatingMenu.css";

export function FloatingMenu() {
  return (
    <Show when={loggedIn()}>
      <div class="floating-bottom-menu-container  ">
        <div class="floating-bottom-menu">
          <FloatingMenuItems />
        </div>
        <BottomMenuDialog />
      </div>
    </Show>
  );
}
