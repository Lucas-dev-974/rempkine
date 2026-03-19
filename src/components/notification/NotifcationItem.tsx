import { createSignal, mergeProps, onCleanup, onMount } from "solid-js";
import { VsChromeClose } from 'solid-icons/vs'
import { NotificationType, NotificationService } from "../../utils/notification.service";

const DURATION_MS = 7000;

export function NotifcationItem(props: Partial<NotificationType>) {
  const mergedProps = mergeProps({ type: "info" }, props);
  const [remainingPercent, setRemainingPercent] = createSignal(100);

  function closeNotif() {
    if (props.id !== undefined) {
      NotificationService.remove(props.id);
    }
  }

  onMount(() => {
    const start = Date.now();
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.max(0, 100 - (elapsed / DURATION_MS) * 100);
      setRemainingPercent(percent);
    }, 50);

    const timeoutId = window.setTimeout(() => {
      closeNotif();
    }, DURATION_MS);

    onCleanup(() => {
      clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    });
  });

  return (
    <div
      class="relative overflow-hidden px-4 py-3 rounded-md flex justify-around gap-3 items-center text-white "
      classList={{
        "bg-[#099773]": mergedProps.type == "info",
        "bg-red-500": mergedProps.type == "error",
      }}
    >
      <div
        class="absolute top-0 left-0 right-0 h-0.5 bg-white/40"
        role="progressbar"
        aria-valuenow={remainingPercent()}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          class="h-full bg-white transition-[width] duration-75 ease-linear"
          style={{ width: `${remainingPercent()}%` }}
        />
      </div>
      <p> {props.content} </p>
      <div>
        <button class="w-3 h-3 border-none bg-transparent cursor-pointer" onClick={closeNotif}>
          <VsChromeClose stroke="white" color="white" />
        </button>
      </div>
    </div>
  );
}
