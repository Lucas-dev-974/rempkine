import { Portal } from "solid-js/web";
import { notifications } from "../../utils/notification.service";
import { NotifcationItem } from "./NotifcationItem";
import { For, Show } from "solid-js";

export function Notification() {
  return (
    <Portal>
      <Show when={notifications().length > 0}>
        <div class="fixed sm:absolute flex flex-col p-3 sm:p-5 gap-2 left-2 right-2 sm:left-auto sm:right-0 sm:top-5 top-16 z-[500] max-w-[calc(100vw-1rem)] sm:max-w-sm">
          <For each={notifications()}>
            {(notif) => <NotifcationItem {...notif} />}
          </For>
        </div>
      </Show>
    </Portal>
  );
}
