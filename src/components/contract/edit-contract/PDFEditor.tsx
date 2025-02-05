import { createSignal, onMount } from "solid-js";
import { NextIcon } from "../../../icons/NextIcon";
import { PreviousIcon } from "../../../icons/PreviousIcon";
import { Button } from "../../buttons/Button";
import { PDFTool } from "./PDFTool";

import "./PDFEditor.css";

export function PDFEditor() {
  const [pdfFile, setPdfFile] = createSignal();
  const [currentPage, setCurrentPage] = createSignal(1);
  const [numPages, setNumPages] = createSignal();
  const [fields, setFields] = createSignal<any[]>([]);

  const PDFurl =
    "http://localhost:3000/src/assets/contrat-type-de-remplacement-liberal-28-03-2023-.pdf";

  const pdfTool = new PDFTool(PDFurl, "pdf-canvas");
  onMount(async () => {
    await pdfTool.loadPdf();
    setPdfFile(pdfTool.pdfFile);
    setCurrentPage(pdfTool.currentPage);
    setNumPages(pdfTool.numPages);
  });

  async function changePage(page: number) {
    await pdfTool.renderPage(pdfTool.currentPage + page);
    setFields(pdfTool.fields!);
    setCurrentPage(pdfTool.currentPage);
    setNumPages(pdfTool.numPages);
  }
  return (
    <div>
      <div class="flex gap-2 my-4 justify-between">
        <Button
          onClick={() => pdfTool.downloadModifiedPdf(pdfFile() as File)}
          text="Télécharger le PDF modifié"
        />
        <div class="flex items-center">
          <button
            class="h-3 w-3 rounded-full flex items-center"
            onClick={() => changePage(-1)}
          >
            <PreviousIcon />
          </button>
          <p class="mx-4">
            Page {currentPage()} sur {numPages() as number}
          </p>
          <button
            class="h-3 w-3 rounded-full flex items-center"
            onClick={() => changePage(+1)}
          >
            <NextIcon />
          </button>
        </div>
      </div>

      <div style="position: relative;">
        <canvas id="pdf-canvas"></canvas>

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
              // "font-size": "16px",
              padding: "2px",
            }}
          />
        ))}
      </div>
    </div>
  );
}
