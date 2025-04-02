import { createSignal, JSX, Show } from "solid-js";
import { Button } from "../buttons/Button";

import "./DialogWrapper.css";

interface DialogWrapperProps {
  children: JSX.Element;
  btnText: string;
  title: string;
}

// ! TODO review this code, if we have multiple use of DialogWrapper this externalised openDialog gonna open them all
const [isOpen, setIsOpen] = createSignal(false);
export const openDialogTool = () => setIsOpen(true);
const closeDialogTool = () => setIsOpen(false);

export function DialogWrapper(props: DialogWrapperProps) {
  return (
    <>
      <Button text={props.btnText} onClick={openDialogTool} />
      <Show when={isOpen()} fallback={null}>
        <div class="dialog-overlay" onClick={closeDialogTool}>
          <div class="dialog" onClick={(e) => e.stopPropagation()}>
            <div class="dialog-header">
              <h3>{props.title}</h3>
              <button class="close-button" onClick={closeDialogTool}>
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
