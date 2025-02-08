import { PDFEditor } from "../../contract/edit-contract/PDFEditor";
import { DialogWrapper } from "../DialogWrapper";
import { FormFields } from "./FormFields";

import "./DialogTool.css";

export function DialogTool() {
  return (
    <DialogWrapper
      btnText="Tester l'outil d'édition de contrat"
      title="Test de l'outil d'édition de contrat"
    >
      <div class="dialog-tool-content">
        <div class="dialog-tool-pdf-container">
          <div class="dialog-tool-pdf">
            <PDFEditor />
          </div>
        </div>

        <div class="dialog-tool-form">
          <FormFields />
        </div>
      </div>
    </DialogWrapper>
  );
}
