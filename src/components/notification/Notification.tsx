import { For } from "solid-js";
import { notifications } from "../../utils/notification.service";
import { CloseIcon } from "../../icons/CloseIcon";
import { NotifcationItem } from "./NotifcationItem";

export function Notification() {
  return (
    <div class="absolute flex flex-col p-5 gap-2 right-0">
      <For each={notifications()}>
        {(notif) => <NotifcationItem {...notif} />}
      </For>
    </div>
  );
}
