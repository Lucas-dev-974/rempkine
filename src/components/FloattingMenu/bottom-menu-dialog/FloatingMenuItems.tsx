import { setBottomMenuPageValue, BottomMenuPageEnum } from "./BottomMenuDialog";
import { FilesOutlineIcon } from "../../../icons/FilesOutlineIcon";

import "./FloatingMenuItems.css";

const menuItems = [
  {
    icon: <FilesOutlineIcon />,
    label: BottomMenuPageEnum.contracts,
    action: () => setBottomMenuPageValue(BottomMenuPageEnum.contracts),
  },
];

export function FloatingMenuItems() {
  return menuItems.map((item) => (
    <button class="floating-menu-item" onClick={item.action}>
      {item.icon}
      <p class="floating-menu-item-text">{item.label}</p>
    </button>
  ));
}
