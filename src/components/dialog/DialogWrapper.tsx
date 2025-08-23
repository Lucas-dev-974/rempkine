import { createSignal, JSX, Show } from "solid-js";
import { Button } from "../buttons/Button";
import { setLoadContrat } from "../../const.data";
import { setCurrentPDFTool } from "../contract/editor/PDFEditor";
import { VsChromeClose } from 'solid-icons/vs'

import "./DialogWrapper.css";

interface DialogWrapperProps {
  children: JSX.Element;
  btnText: string;
  title: string;
  onClose?: () => void
}

// ! TODO review this code, if we have multiple use of DialogWrapper this externalised openDialog gonna open them all
const [isOpen, setIsOpen] = createSignal(false);
export const openDialogTool = () => setIsOpen(true);

export function DialogWrapper(props: DialogWrapperProps) {

  async function closeDialogTool() {
    setLoadContrat(undefined);
    setCurrentPDFTool(undefined);
    setIsOpen(false);
  };

  return (
    <>
      <Button text={props.btnText} onClick={openDialogTool} />
      <Show when={isOpen()} fallback={null}>
        <div class="dialog-overlay" onClick={closeDialogTool}>
          <div class="dialog" onClick={(e) => e.stopPropagation()}>
            <div class="dialog-header">
              <h3 class="text-xl font-bold">{props.title}</h3>
              <button class="close-button" onClick={closeDialogTool}>
                <VsChromeClose size={19} />
              </button>
            </div>

            <div class="overflow-y-auto pt-5">
              {props.children}
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}
