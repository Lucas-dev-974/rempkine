import { createSignal, JSX, Show } from "solid-js";
import "./DialogWrapper.css";

type DialogWrapperProps = {
  children: JSX.Element;
};

export function DialogWrapper(props: DialogWrapperProps) {
  const [isOpen, setIsOpen] = createSignal(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <>
      <button onClick={openDialog}>Open Dialog</button>
      <Show when={isOpen()} fallback={null}>
        <div class="dialog-overlay" onClick={closeDialog}>
          <div class="dialog-content" onClick={(e) => e.stopPropagation()}>
            <button class="close-button" onClick={closeDialog}>
              &times;
            </button>
            {props.children}
          </div>
        </div>
      </Show>
    </>
  );
}
