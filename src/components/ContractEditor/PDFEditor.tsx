import { createSignal, onMount, onCleanup } from "solid-js";
import { CTAPDFViewer } from "./CTAPDFViewer";
import { PDFTool } from "../../utils/PDFTool";

export const [currentPDFTool, setCurrentPDFTool] = createSignal<PDFTool>();


export function PDFEditor() {
  const PDFurl = import.meta.env.VITE_PDF_FILE_PATH || location.origin + "/assets/contrat.pdf";

  onMount(async () => {
    const pdfTool = PDFTool.getInstance(PDFurl, "pdf-canvas")
    await pdfTool.initialize();

    setCurrentPDFTool(pdfTool)
  });

  onCleanup(() => currentPDFTool()?.resetContractData)

  return <CTAPDFViewer />;
}
