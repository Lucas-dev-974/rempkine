import { Show } from "solid-js";
import { loadContract } from "../../const.data";
import { currentPDFTool, PDFEditor } from "../ContractEditor/PDFEditor";
import { DialogWrapper } from "../dialog/DialogWrapper";
import { ContratInformationsDropdowns } from "./DropdownContratInformations/ContratInformationsDropdowns";
import { PDFTool } from "../ContractEditor/PDFTool";


export function EditContractDialog() {
  return (
    <DialogWrapper
      btnText="Tester l'outil d'édition de contrat"
      title={loadContract() ? "Mettre à jour  un contrat" : "Edité un nouveau contrat"}
      dialogClass="w-[90vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw]"
    >
      <div class="p-3 max-h-[70vh]">
        <Show when={currentPDFTool() instanceof PDFTool}>
          <ContratInformationsDropdowns />
        </Show>

        <PDFEditor />
      </div>
    </DialogWrapper>
  );
}
