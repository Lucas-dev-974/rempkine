import { PDFEditor } from "../../contract/editor/PDFEditor";
import { DialogWrapper } from "../DialogWrapper";
import { FormFields } from "./AccordionFields/FormFields";

import "./DialogTool.css";

export function DialogTool() {
  return (
    <DialogWrapper
      btnText="Tester l'outil d'édition de contrat"
      title="Edition contrat"
    >
      <div class="dialog-tool-content">
        <div class="dialog-tool-form">
          <FormFields />
        </div>

        <div class="dialog-tool-pdf-container">
          <div class="dialog-tool-pdf">
            <PDFEditor />
          </div>
        </div>
      </div>
    </DialogWrapper>
  );
}
