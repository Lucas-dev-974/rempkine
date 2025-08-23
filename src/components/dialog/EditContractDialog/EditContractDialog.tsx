import { Show } from "solid-js";
import { loadContract } from "../../../const.data";
import { currentPDFTool, PDFEditor } from "../../contract/editor/PDFEditor";
import { DialogWrapper } from "../DialogWrapper";
import { AccordionInputsForm } from "./AccordionFields/FormFields";
import { PDFTool } from "../../contract/editor/PDFTool";


export function EditContractDialog() {
  return (
    <DialogWrapper
      btnText="Tester l'outil d'édition de contrat"
      title={loadContract() ? "Mettre à jour  un contrat" : "Edité un nouveau contrat"}
    >
      <div class="lg:w-[80vw] w-full flex flex-wrap max-h-[80vh]">
        <div class="lg:w-[60%] w-full px-5 overflow-y-auto max-h-[80vh] my-3">
          <Show when={currentPDFTool() instanceof PDFTool}>
            <AccordionInputsForm />
          </Show>
        </div>

        <div class="lg:w-[40%] w-full flex justify-center items-center">
          <PDFEditor />
        </div>
      </div>
    </DialogWrapper>
  );
}
