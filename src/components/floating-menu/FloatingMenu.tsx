import { FloatingMenuItems } from "./bottom-menu-dialog/FloatingMenuItems";
import { BottomMenuDialog } from "./bottom-menu-dialog/BottomMenuDialog";
import { onPage, PagesEnum } from "../../router/RouterTypes";
import { Show } from "solid-js";

import "./FloatingMenu.css";

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
