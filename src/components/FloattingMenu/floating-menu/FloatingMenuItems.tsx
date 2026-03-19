import { setBottomMenuPageValue, BottomMenuPageEnum } from "../bottom-menu-dialog/BottomMenuDialog";
import { ContractIcon } from "../../../icons/ContractIcon";

const menuItems = [
  {
    icon: <ContractIcon size={3} />,
    label: BottomMenuPageEnum.contracts,
    action: () => setBottomMenuPageValue(BottomMenuPageEnum.contracts),
  },
];

export function FloatingMenuItems() {
  return menuItems.map((item) => (
    <button class=" flex flex-col items-center  bg-transparent border-none pb-2 " onClick={item.action}>
      {item.icon}
      <p class="font-[Nunito] font-light text-xs sm:text-sm font-bold text-white absolute -bottom-4">{item.label}</p>
    </button>
  ));
}
