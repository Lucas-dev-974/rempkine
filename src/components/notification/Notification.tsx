import { Portal } from "solid-js/web";
import { notifications } from "../../utils/notification.service";
import { NotifcationItem } from "./NotifcationItem";
import { For, Show } from "solid-js";

export function Notification() {
  return (
    <Portal>
      <Show when={notifications().length > 0}>
        <div class="absolute flex flex-col p-5 gap-2 right-0 z-[500] top-5 ">
          <For each={notifications()}>
            {(notif) => <NotifcationItem {...notif} />}
          </For>
        </div>
      </Show>
    </Portal>
  );
}
