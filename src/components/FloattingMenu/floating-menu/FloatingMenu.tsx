import { FloatingMenuItems } from "./FloatingMenuItems";
import { BottomMenuDialog } from "../bottom-menu-dialog/BottomMenuDialog";
import { onPage, PagesEnum } from "../../../router/RouterTypes";
import { Show } from "solid-js";


export function FloatingMenu() {
  return (
    <Show when={onPage() != PagesEnum.login && onPage() != PagesEnum.register}>
      <div class="fixed bottom-0 w-full flex justify-center overflow-visible z-[200]">
        <div class="w-full text-white shadow-2xl px-5 py-2 flex gap-10  justify-center"
          style={{ "background": "linear-gradient(360deg,rgba(9, 151, 115, 1) 0%, rgba(67, 182, 146, 1) 100%)" }}>
          <FloatingMenuItems />
        </div>
        <BottomMenuDialog />
      </div>
    </Show>
  );
}
