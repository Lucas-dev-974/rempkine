import { createSignal, JSX, Show } from "solid-js";
import { setCurrentPDFTool } from "../ContractEditor/PDFEditor";
import { VsChromeClose } from 'solid-icons/vs'

import { setLoadContrat } from "../../const.data";
import { OutlinedButton } from "../buttons/OulinedButton";

interface DialogWrapperProps {
  children: JSX.Element;
  btnText: string;
  title: string;
  onClose?: () => void;
  onOpen?: () => void;
  dialogClass?: string
}

// ! TODO review this code, if we have multiple use of DialogWrapper this externalised openDialog gonna open them all
const [isOpen, setIsOpen] = createSignal(false);
export const openDialogTool = () => setIsOpen(true);

export function DialogWrapper(props: DialogWrapperProps) {

  function removeSigneBackQuery() {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.delete("signe-back");
    window.history.replaceState({}, "", window.location.pathname + "?" + queryParams.toString());
  }
  async function closeDialogTool() {
    setLoadContrat(undefined);
    setCurrentPDFTool(undefined);
    setIsOpen(false);
    removeSigneBackQuery();
  };

  return (
    <>
      <OutlinedButton text={props.btnText} onClick={openDialogTool} class="w-full" subText="Essayer gratuitement en 2 minutes" />
      <Show when={isOpen()} fallback={null}>
        <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center" onClick={closeDialogTool}>
          <div onClick={(e) => e.stopPropagation()} class={(props.dialogClass ?? "") + " dialog"}>
            <div class="text-white text-lg p-3  font-bold lg:text-2xl items-center flex justify-between bg-primary rounded-t-lg"
              style="background: linear-gradient(190deg,rgba(9, 151, 115, 1) 0%, rgba(67, 182, 146, 1) 100%);">
              <h3 class="text-xl font-bold m-0 font-[Nunito]">{props.title}</h3>
              <button class="bg-none border-none text-3xl cursor-pointer text-red-500 bg-transparent" onClick={closeDialogTool}>
                <VsChromeClose size={24} />
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
