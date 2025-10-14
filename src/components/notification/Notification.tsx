import { notifications } from "../../utils/notification.service";
import { NotifcationItem } from "./NotifcationItem";
import { For, onMount, Show } from "solid-js";

export function Notification() {
  onMount(() => {
    console.log(notifications());
  });

  return (
    <Show when={notifications().length > 0}>
      <div class="absolute flex flex-col p-5 gap-2 right-0 z-50 top-2">
        <For each={notifications()}>
          {(notif) => <NotifcationItem {...notif} />}
        </For>
      </div>
    </Show>
  );
}
