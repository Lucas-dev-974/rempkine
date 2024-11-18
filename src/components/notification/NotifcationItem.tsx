import { createSignal } from "solid-js";
import { CloseIcon } from "../../icons/CloseIcon";
import { NotificationType } from "../../utils/notification.service";

export function NotifcationItem(props: Partial<NotificationType>) {
  const [ref, setRef] = createSignal<HTMLDivElement>();

  function closeNotif() {
    ref()?.remove();
  }
  return (
    <div
      ref={setRef}
      class="bg-blue-500 px-4 py-3 rounded-md flex justify-around gap-3 items-center text-white "
      classList={{
        "bg-blue-500": props.type == "info",
        "bg-red-500": props.type == "error",
      }}
    >
      <p> {props.content} </p>
      <div>
        <button class="w-3 h-3" onClick={closeNotif}>
          <CloseIcon stroke="white" />
        </button>
      </div>
    </div>
  );
}
