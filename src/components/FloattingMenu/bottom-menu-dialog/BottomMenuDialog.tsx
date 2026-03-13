import { BottomMenuPageRouter } from "./bottom-menu-page/BottomMenuPageRouter";
import { createSignal } from "solid-js";
import { Overlay } from "../../dialog/Overlay";

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
      <Overlay show={isBottomMenuVisible()} onClick={() => setIsBottomMenuVisible(false)} />
      <div class="fixed bottom-0 left-0 w-full bg-white rounded-t-lg shadow-lg transform transition-transform duration-1000 h-[600px] z-[200]"
        classList={{
          "translate-y-full": !isBottomMenuVisible(),
          "translate-y-0": isBottomMenuVisible(),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <BottomMenuPageRouter />
      </div>
    </>
  );
}
