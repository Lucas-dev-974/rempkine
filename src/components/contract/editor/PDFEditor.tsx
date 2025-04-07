import { ContractEntity } from "../../../models/contract.entity";
import { loadContract, loggedIn } from "../../../const.data";
import { PreviousIcon } from "../../../icons/PreviousIcon";
import { createSignal, onMount, Show } from "solid-js";
import { NextIcon } from "../../../icons/NextIcon";
import { Button } from "../../buttons/Button";
import { PDFTool } from "./PDFTool";

import "./PDFEditor.css";
import { contractService } from "../../../services/contract.service";
import { NotificationService } from "../../../utils/notification.service";

export const [currentPDF, setCurrentPDF] = createSignal<PDFTool>();

const [fields, setFields] = createSignal<any[]>([]);

export function HandlerInputChangePDFEditor(
  fieldID: string | string[],
  value: string
) {
  if (Array.isArray(fieldID)) {
    fieldID.forEach((id) => {
      setFields((prev) => {
        if (!prev) return prev;
        const field = prev.find((f) => f.id === id);
        if (!field) return prev;
        field.value = value;
        return [...prev];
      });

      currentPDF()?.handleInputChange(id, value);
    });
  } else {
    setFields((prev) => {
      if (!prev) return prev;
      const field = prev.find((f) => f.id === fieldID);
      if (!field) return prev;
      field.value = value;
      return [...prev];
    });

    currentPDF()?.handleInputChange(fieldID, value);
  }
}

export function PDFEditor() {
  const [pdfFile, setPdfFile] = createSignal();
  const [currentPage, setCurrentPage] = createSignal(1);
  const [numPages, setNumPages] = createSignal();

  const PDFurl = import.meta.env.VITE_PDF_FILE_PATH;
  const pdfTool = new PDFTool(PDFurl, "pdf-canvas");

  async function saveContractInDB() {
    const contract = pdfTool.saveModifiedPdf();
    await contractService.createContract(contract);
    if (!pdfTool.isValidContract(contract)) {
      NotificationService.push({
        content:
          "Le contrat n'est pas valide, il a été sauvegardé vous pourrez le modifier plus tard.",
        type: "error",
      });
    }
  }

  onMount(async () => {
    await pdfTool.loadPdf();
    if (loadContract()) {
      pdfTool.setContractDataToPDFFields(loadContract() as ContractEntity);
    }

    setPdfFile(pdfTool.pdfFile);
    setCurrentPage(pdfTool.currentPage);
    setNumPages(pdfTool.numPages);
    setCurrentPDF(pdfTool);
  });

  async function changePage(page: number) {
    if (page === -1 && pdfTool.currentPage == 1) return 1;
    if (page === +1 && pdfTool.currentPage == 6) return 6;

    await pdfTool.renderPage(pdfTool.currentPage + page);
    const fieldsFromForm = pdfTool.getCurrentPageFieldsFromFormFields();
    if (fieldsFromForm) {
      setFields(fieldsFromForm);
    }
    setCurrentPage(pdfTool.currentPage);
    setNumPages(pdfTool.numPages);
  }

  return (
    <div>
      <div class="flex gap-2 my-4 justify-between">
        <div class="flex gap-2">
          <Button
            onClick={() => pdfTool.downloadModifiedPdf(pdfFile() as File)}
            text="Télécharger le PDF modifié"
            size="small"
          />

          <Button
            onClick={saveContractInDB}
            text="Sauvegarder le PDF modifié"
            size="small"
          />
        </div>
        <div class="flex items-center">
          <button
            class="h-2 w-2 rounded-full flex items-center"
            onClick={() => changePage(-1)}
          >
            <PreviousIcon />
          </button>
          <p class="mx-4 text-sm">
            {currentPage()} sur {numPages() as number}
          </p>
          <button
            class="h-2 w-2 rounded-full flex items-center"
            onClick={() => changePage(+1)}
          >
            <NextIcon />
          </button>
        </div>
      </div>

      <div style="position: relative;">
        <canvas
          id="pdf-canvas"
          class=" border border-gray-400 rounded-lg"
        ></canvas>

        {fields().map((field) => (
          <input
            class="pdf-input"
            type="text"
            value={field.value}
            onInput={(e) => pdfTool.handleInputChange(field.id, e.target.value)}
            style={{
              position: "absolute",
              left: `${field.left}px`,
              top: `${field.top}px`,
              width: `${field.width}px`,
              height: `${field.height}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
