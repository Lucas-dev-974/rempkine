import { createEffect, createSignal, JSX, Match, Show, Switch } from "solid-js";
import { setCurrentPDFTool } from "../ContractEditor/PDFEditor";
import { VsChromeClose } from 'solid-icons/vs'

import { setLoadContrat } from "../../const.data";
import { OutlinedButton } from "../buttons/OulinedButton";

interface DialogWrapperProps {
  children: JSX.Element;
  name: string;
  btnText: string;
  title: string;
  isInNavbar?: boolean;
}

export const DIALOG_NAMES = {
  none: "none",
  registerInformations: "registerInformations",
  editContract: "editContract",
} as const;

// ! TODO review this code, if we have multiple use of DialogWrapper this externalised openDialog gonna open them all
// const [isOpen, setIsOpen] = createSignal(false);

const [openDialogs, setOpenDialogs] = createSignal<string>(DIALOG_NAMES.none);
const [closeDialog, setCloseDialog] = createSignal<string>(DIALOG_NAMES.none);

export const openDialogTool = (dialog: string) => {
  setOpenDialogs(dialog);
};

export const closeDialogTool = (dialog: string) => {
  setCloseDialog(dialog);
};

export function DialogWrapper(props: DialogWrapperProps) {
  const [isOpen, setIsOpen] = createSignal(false);

  function removeSigneBackQuery() {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.delete("signe-back");
    window.history.replaceState({}, "", window.location.pathname + "?" + queryParams.toString());
  }

  async function closeDialogTool() {
    setOpenDialogs(DIALOG_NAMES.none);
    setLoadContrat(undefined);
    setCurrentPDFTool(undefined);
    setIsOpen(false);
    removeSigneBackQuery();
  };

  createEffect(() => {
    openDialogs() === props.name ? setIsOpen(true) : null;
    closeDialog() === props.name ? closeDialogTool() : null;
  });

  return (
    <>
      <Switch>
        <Match when={!props.isInNavbar}>
          <OutlinedButton text={props.btnText} onClick={() => setIsOpen(true)} class="w-full" />
        </Match>

        <Match when={props.isInNavbar}>
          <button onClick={() => setIsOpen(true)} class={"flex flex-col items-center justify-center" +
            " font-[Nunito] text-sm  px-4 py-2 rounded-lg cursor-pointer duration-200 " +
            " bg-transparent border-none text-white shadow-none hover:shadow-none "}>
            {props.btnText}
          </button>
        </Match>
      </Switch>
      <Show when={isOpen()} fallback={null}>
        <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closeDialogTool}>

          <div onClick={(e) => e.stopPropagation()} class="w-[90vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] bg-slate-200 rounded-lg">
            <div class="text-white text-lg p-3  font-bold lg:text-2xl items-center flex justify-between bg-primary rounded-t-lg"
              style="background: linear-gradient(190deg,rgba(9, 151, 115, 1) 0%, rgba(67, 182, 146, 1) 100%);">
              <h3 class="text-xl font-bold m-0 font-[Nunito]">{props.title}</h3>

              <button class="bg-none border-none text-3xl cursor-pointer text-red-500 bg-transparent" onClick={closeDialogTool}>
                <VsChromeClose size={24} />
              </button>
            </div>

            <div class="overflow-y-auto pt-5" style={{ "-webkit-overflow-scrolling": "touch" }}>
              {props.children}
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}
