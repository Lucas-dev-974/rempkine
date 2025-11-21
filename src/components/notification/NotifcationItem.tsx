import { createSignal, mergeProps } from "solid-js";
import { VsChromeClose } from 'solid-icons/vs'
import { NotificationType, NotificationService } from "../../utils/notification.service";

export function NotifcationItem(props: Partial<NotificationType>) {
  const [ref, setRef] = createSignal<HTMLDivElement>();

  const mergedProps = mergeProps({ type: "info" }, props);
  function closeNotif() {
    if (props.id !== undefined) {
      NotificationService.remove(props.id);
    }
  }
  return (
    <div
      ref={setRef}
      class="bg-blue-500 px-4 py-3 rounded-md flex justify-around gap-3 items-center text-white "
      classList={{
        "bg-blue-500": mergedProps.type == "info",
        "bg-red-500": mergedProps.type == "error",
      }}
    >
      <p> {props.content} </p>
      <div>
        <button class="w-3 h-3 border-none bg-transparent cursor-pointer" onClick={closeNotif}>
          <VsChromeClose stroke="white" color="white" />
        </button>
      </div>
    </div>
  );
}
