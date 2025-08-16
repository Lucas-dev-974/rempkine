import { FloatingMenuItems } from "./bottom-menu-dialog/FloatingMenuItems";
import { BottomMenuDialog } from "./bottom-menu-dialog/BottomMenuDialog";

import "./FloatingMenu.css";
import { Show } from "solid-js";
import { onPage, PagesEnum } from "../../router/router";

export function FloatingMenu() {
  return (
    <Show when={onPage() != PagesEnum.login && onPage() != PagesEnum.register}>
      <div class="floating-bottom-menu-container  ">
        <div class="floating-bottom-menu">
          <FloatingMenuItems />
        </div>
        <BottomMenuDialog />
      </div>
    </Show>
  );
}
