import { PDFEditor } from "../../contract/editor/PDFEditor";
import { FormFields } from "./inputs-accordion-fields/FormFields";

export function DialogContentContratEditorTool() {
  return (
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
  );
}
