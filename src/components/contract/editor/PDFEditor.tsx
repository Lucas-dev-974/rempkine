import { NotificationService } from "../../../utils/notification.service";
import { contractService } from "../../../services/contract.service";
import { ContractEntity } from "../../../models/contract.entity";
import { createEffect, createSignal, onMount } from "solid-js";
import { loadContract, loggedIn } from "../../../const.data";
import { PreviousIcon } from "../../../icons/PreviousIcon";
import storeService from "../../../utils/store.service";
import { NextIcon } from "../../../icons/NextIcon";
import { Button } from "../../buttons/Button";
import SignaturePad from "signature_pad";
import { PDFTool } from "./PDFTool";

import "./PDFEditor.css";

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

export const [canvasSignatureReplaced, setCanvasSignatureReplaced] =
  createSignal<HTMLCanvasElement>();

export const [canvasSignatureSubstitute, setCanvasSignatureSubstitute] =
  createSignal<HTMLCanvasElement>();

export function PDFEditor() {
  const [pdfFile, setPdfFile] = createSignal();
  const [currentPage, setCurrentPage] = createSignal(1);
  const [numPages, setNumPages] = createSignal();

  const PDFurl =
    import.meta.env.VITE_PDF_FILE_PATH ||
    location.origin + "/assets/contrat.pdf";
  const pdfTool = new PDFTool(PDFurl, "pdf-canvas");

  async function saveContractInDB() {
    const contractFromPDF = pdfTool.getContractData();
    const contract = await contractService.createContract(contractFromPDF);
    if (!pdfTool.isValidContract(contractFromPDF)) {
      NotificationService.push({
        content:
          "Le contrat n'est pas valide, il a été sauvegardé vous pourrez le modifier plus tard.",
        type: "error",
      });
    }
    if (!loggedIn()) {
      NotificationService.push({
        content:
          "Le contrat sera supprimmé dans 3 mois, connnectez-vous ou télécharger pour le garder.",
        type: "error",
      });

      console.log(contract);
      if (!storeService.proxy.contractIds) {
        storeService.proxy.contractIds = [contract.id];
      } else {
        storeService.proxy.contractIds = [
          ...storeService.proxy.contractIds,
          contract.id,
        ];
      }
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

    // TODO: refactor
    // Check if the current page is 6
    if (pdfTool.currentPage === 6) {
      const parentCanvas = document.getElementById("pdf-canvas");

      if (parentCanvas) {
        const parentContainer = parentCanvas.parentElement;

        if (parentContainer) {
          // Create the first canvas
          const canvas1 = document.createElement("canvas");
          setCanvasSignatureReplaced(canvas1);
          canvas1.style.position = "absolute";
          canvas1.style.bottom = "12%"; // 5% from the bottom
          canvas1.style.left = "5%"; // 5% from the left
          canvas1.style.width = "40%"; // 40% of parent width
          canvas1.style.height = "13%"; // 20% of parent height
          canvas1.style.border = "1px solid black";

          // Create the second canvas
          const canvas2 = document.createElement("canvas");
          setCanvasSignatureSubstitute(canvas2);
          canvas2.style.position = "absolute";
          canvas2.style.bottom = "12%"; // 5% from the bottom
          canvas2.style.left = "55%"; // Positioned 55% from the left
          canvas2.style.width = "40%"; // 40% of parent width
          canvas2.style.height = "13%"; // 20% of parent height
          canvas2.style.border = "1px solid black";

          // Append the canvases to the parent container
          parentContainer.appendChild(canvas1);
          parentContainer.appendChild(canvas2);

          // Adjust canvas resolution to match their displayed size
          const adjustCanvasResolution = (canvas: HTMLCanvasElement) => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
          };

          adjustCanvasResolution(canvas1);
          adjustCanvasResolution(canvas2);
          // Add a resize observer to make the canvases responsive
          const resizeObserver = new ResizeObserver(() => {
            adjustCanvasResolution(canvas1);
            adjustCanvasResolution(canvas2);
          });

          resizeObserver.observe(parentContainer);
        }
      }
    }
  }

  // Create SignaturePad instances and load signatures when the component mounts if loadContract is available
  createEffect(() => {
    if (canvasSignatureReplaced() && canvasSignatureSubstitute()) {
      const signaturePadConfig = {
        minWidth: 2,
        maxWidth: 4,
        penColor: "rgb(66, 133, 244)",
      };
      const replacedSignaturePad = new SignaturePad(
        canvasSignatureReplaced()!,
        signaturePadConfig
      );

      const substituteSignaturePad = new SignaturePad(
        canvasSignatureSubstitute()!,
        signaturePadConfig
      );

      if (loadContract()) {
        const replacedSignatureDataUrl =
          loadContract()!.replacedSignatureDataUrl;

        const substituteSignatureDataUrl =
          loadContract()!.substituteSignatureDataUrl;

        setTimeout(() => {
          replacedSignaturePad.fromDataURL(replacedSignatureDataUrl);
          substituteSignaturePad.fromDataURL(substituteSignatureDataUrl);
        }, 100);
      }
    }
  });

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
