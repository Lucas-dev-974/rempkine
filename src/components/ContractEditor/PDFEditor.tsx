import { createEffect, createSignal, onMount, onCleanup, Setter } from "solid-js";
import { loadContract } from "../../const.data";
import { CTAPDFViewer } from "./CTAPDFViewer";
import SignaturePad from "signature_pad";
import { PDFTool } from "./PDFTool";

import "./PDFEditor.css";
import { setCanvasInputs } from "./PDFInputsOnCanvas";


// export const [canvasSignatureReplaced, setCanvasSignatureReplaced] = createSignal<HTMLCanvasElement>();
// export const [canvasSignatureSubstitute, setCanvasSignatureSubstitute] = createSignal<HTMLCanvasElement>();

export const [currentPDFTool, setCurrentPDFTool] = createSignal<PDFTool>();


/**
 * Updates both the on-canvas PDF input overlays and the underlying PDFTool fields.
 * - If `fieldID` is an array, updates each corresponding field.
 * - Synchronizes Solid state (`canvasInputs`) and the PDF model (`PDFTool.handlerToUpdatePDFFields`).
 *
 * @param fieldID The PDF input id or a list of ids to update (string or string[])
 * @param value The new value to set for the input(s)
 */

export function updateCanvasInput(id: string, value: string) {
  setCanvasInputs(prev => {
    if (!prev) return prev
    prev = [...prev.map(input => {
      if (input.id == id) {
        input.value = value
      }
      return input
    })]
    return prev
  })
}

export function HandlerToUpdateCanvasInputs(fieldID: string | string[], value: string, updateContractData: boolean = true) {

  console.log("update field:", fieldID, value);

  if (Array.isArray(fieldID)) {
    fieldID.forEach((id) => {
      currentPDFTool()?.updateContractDataAndPDFFields(id, value, updateContractData)
      updateCanvasInput(id, value)
    });
  } else {
    currentPDFTool()?.updateContractDataAndPDFFields(fieldID, value, updateContractData);
    updateCanvasInput(fieldID, value)
  }
}

export const [currentPage, setCurrentPage] = createSignal(1);
export const [numPages, setNumPages] = createSignal();

export const [signaturePad1, setSignaturePad1] = createSignal<SignaturePad>()
export const [signaturePad2, setSignaturePad2] = createSignal<SignaturePad>()

export function PDFEditor() {
  const PDFurl = import.meta.env.VITE_PDF_FILE_PATH || location.origin + "/assets/contrat.pdf";

  onMount(async () => {
    const pdfTool = new PDFTool(PDFurl, "pdf-canvas")
    await pdfTool.initialize();

    setCurrentPDFTool(pdfTool)
    setCurrentPage(currentPDFTool()!.currentPage);
    setNumPages(currentPDFTool()!.numPages);
  });

  onCleanup(() => currentPDFTool()?.resetContractData)

  return <CTAPDFViewer />;
}
