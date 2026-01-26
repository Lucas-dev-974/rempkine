import { Show } from "solid-js";
import { currentPDFTool, PDFEditor } from "../ContractEditor/PDFEditor";
import { DialogWrapper } from "../dialog/DialogWrapper";
import { ContratInformationsDropdowns } from "./DropdownContratInformations/ContratInformationsDropdowns";
import { PDFTool } from "../../utils/PDFTool";
import { loadContract } from "../../const.data";
import { signeBack } from "../../pages/PageWrapper";


export function EditContractDialog() {
  function title() {
    if (signeBack()) {
      return "Signer un contrat";
    } else if (loadContract()) {
      return "Mettre à jour  un contrat";
    } else {
      return "Edité un nouveau contrat";
    }
  }
  return (
    <DialogWrapper
      btnText="Créer un contrat"
      title={title()}
      dialogClass="w-[90vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] bg-slate-200 rounded-lg"

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
