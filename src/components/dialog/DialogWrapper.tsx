import { createSignal, JSX, Show } from "solid-js";
import { Button } from "../buttons/Button";

import "./DialogWrapper.css";
type DialogWrapperProps = {
  children: JSX.Element;
  btnText: string;
  title: string;
};

export function DialogWrapper(props: DialogWrapperProps) {
  const [isOpen, setIsOpen] = createSignal(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <>
      <Button text={props.btnText} onClick={openDialog} />
      <Show when={isOpen()} fallback={null}>
        <div class="dialog-overlay" onClick={closeDialog}>
          <div class="dialog" onClick={(e) => e.stopPropagation()}>
            <div class="dialog-header">
              <h3>{props.title}</h3>
              <button class="close-button" onClick={closeDialog}>
                &times;
              </button>
            </div>

            {props.children}
          </div>
        </div>
      </Show>
    </>
  );
}
