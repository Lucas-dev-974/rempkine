import { notifications } from "../../utils/notification.service";
import { NotifcationItem } from "./NotifcationItem";
import { For } from "solid-js";

export function Notification() {
  return (
    <div class="absolute flex flex-col p-5 gap-2 right-0 z-50">
      <For each={notifications()}>
        {(notif) => <NotifcationItem {...notif} />}
      </For>
    </div>
  );
}
