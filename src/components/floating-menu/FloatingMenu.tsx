import { FloatingMenuItems } from "./bottom-menu-dialog/FloatingMenuItems";
import { BottomMenuDialog } from "./bottom-menu-dialog/BottomMenuDialog";

import "./FloatingMenu.css";

export function FloatingMenu() {
  return (
    <div class="floating-bottom-menu-container  ">
      <div class="floating-bottom-menu">
        <FloatingMenuItems />
      </div>
      <BottomMenuDialog />
    </div>
  );
}
