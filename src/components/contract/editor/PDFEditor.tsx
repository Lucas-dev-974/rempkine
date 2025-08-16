import { createEffect, createSignal, onMount, onCleanup } from "solid-js";
import { NotificationService } from "../../../utils/notification.service";
import { contractService } from "../../../services/contract.service";
import { ContractEntity } from "../../../models/contract.entity";
import storeService from "../../../utils/store.service";
import { loadContract, loggedIn, setLoadContrat } from "../../../const.data";
import { CTAPDFViewer } from "./CTAPDFViewer";
import SignaturePad from "signature_pad";
import { PDFFields, PDFTool } from "./PDFTool";
import { PDFCanvas } from "./PDFCanvas";

import "./PDFEditor.css";
import { setCanvasInputs } from "./PDFInputsOnCanvas";

/**
 * Génère un identifiant unique basé sur timestamp et nombre aléatoire
 * @returns string - Identifiant unique
 */
function createUniqueId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomPart}`;
}

export const [canvasSignatureReplaced, setCanvasSignatureReplaced] = createSignal<HTMLCanvasElement>();
export const [canvasSignatureSubstitute, setCanvasSignatureSubstitute] = createSignal<HTMLCanvasElement>();

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

export function PDFEditor() {
  const [pdfFile, setPdfFile] = createSignal<File>();
  const [currentPage, setCurrentPage] = createSignal(1);
  const [numPages, setNumPages] = createSignal();

  // Todo: remove ?
  const [PDFInputFieldsRef, setPDFInputFieldsRef] = createSignal<HTMLElement>()

  const [signaturePad1, setSignaturePad1] = createSignal<SignaturePad>()
  const [signaturePad2, setSignaturePad2] = createSignal<SignaturePad>()

  const PDFurl = import.meta.env.VITE_PDF_FILE_PATH || location.origin + "/assets/contrat.pdf";

  onMount(async () => {
    const pdfTool = new PDFTool(PDFurl, "pdf-canvas")
    await pdfTool.initialize();

    setCurrentPDFTool(pdfTool)
    setPdfFile(currentPDFTool()!.pdfFile);
    setCurrentPage(currentPDFTool()!.currentPage);
    setNumPages(currentPDFTool()!.numPages);
  });

  onCleanup(() => {
    if (currentPDFTool()) currentPDFTool()?.resetContractData
  })

  async function saveContract() {
    const contractFromPDF: Partial<ContractEntity> = currentPDFTool()!.contractData
    console.log("contract from pdf", contractFromPDF);

    //  * If Logged in then create or update contract
    if (loggedIn()) {
      if (!loadContract()) {
        await contractService.createContract(contractFromPDF);
        NotificationService.push({
          content: "Contrat sauvegarder comme brouillon",
          type: "info",
        });
      } else {
        await contractService.upadte(contractFromPDF);
        NotificationService.push({
          content: "Contrat mis à jour",
          type: "info",
        });
      }

    } else {
      if (!storeService.proxy.contracts) storeService.proxy.contracts = []

      if (!loadContract()) {
        storeService.proxy.contracts = [
          ...storeService.proxy.contracts,
          {
            id: createUniqueId(),
            logoutCreate: true,
            ...contractFromPDF,
          },
        ];

        setLoadContrat(contractFromPDF)

        NotificationService.push({
          content: "Contrat sauvegarder comme brouillon",
          type: "info",
        });

      } else {
        let contracts: Partial<ContractEntity>[] = storeService.proxy.contracts
        storeService.proxy.contracts = contracts.map(contract => {
          if (contract.id == contractFromPDF.id) {
            contract = contractFromPDF
          }
          return contract
        })

        NotificationService.push({
          content: "Contrat mis à jour",
          type: "info",
        });
      }
    }

  }

  function updateCanvasInput() {
    currentPDFTool()?.setContractDataToPDFInputsFields(currentPDFTool()?.contractData!)
    const fields = currentPDFTool()?.PDFInputsFieldsMetadata?.filter(page => page.page == currentPage())[0].fields

    // ! necessary to update canvas inputs fields with the data contract
    setCanvasInputs(prev => {
      if (!prev) return prev
      prev = [...fields as PDFFields[]]
      return prev
    })
  }

  function setUpOfCanvasDomProps() {
    const parentCanvas = document.getElementById("pdf-canvas");
    const parentContainer = parentCanvas!.parentElement;

    // Check if the current page is 6 and if canvas is not set then setup the canvas properties and they signals
    if (currentPDFTool()!.currentPage === 6 && !signaturePad1()) {
      if (parentCanvas && parentContainer) {
        const setCanvasProperties = (canvas: HTMLCanvasElement, left55?: boolean) => {
          canvas.style.position = "absolute";
          canvas.style.bottom = "12%";
          canvas.style.left = left55 ? "55%" : "5%";
          canvas.style.width = "40%";
          canvas.style.height = "13%";
          canvas.style.border = "1px solid black";
        }

        // Create the first canvas
        const canvas1 = document.createElement("canvas");
        setCanvasSignatureReplaced(canvas1);
        setCanvasProperties(canvas1)

        // Create the second canvas
        const canvas2 = document.createElement("canvas");
        setCanvasSignatureSubstitute(canvas2);
        setCanvasProperties(canvas2, true)

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

        // TODO: review this is not working currently
        // Add a resize observer to make the canvases responsive
        const resizeObserver = new ResizeObserver(() => {
          adjustCanvasResolution(canvas1);
          adjustCanvasResolution(canvas2);
        });

        resizeObserver.observe(parentContainer);

      }
    } else if (currentPDFTool()!.currentPage === 6 && signaturePad1()) {
      const canvas1 = parentContainer?.childNodes[2] as HTMLElement;
      const canvas2 = parentContainer?.childNodes[3] as HTMLElement;

      if (canvas1) canvas1.style.setProperty("display", 'block')
      if (canvas2) canvas2.style.setProperty("display", 'block')
    }
  }

  function initSignaturPad() {
    const parentCanvas = document.getElementById("pdf-canvas");
    const parentContainer = parentCanvas!.parentElement;

    // If signaturePads is defined then  get they node and hide them
    if (signaturePad1() || signaturePad2()) {
      const canvas1 = parentContainer?.childNodes[2] as HTMLElement;
      const canvas2 = parentContainer?.childNodes[3] as HTMLElement;

      if (canvas1) canvas1.style.setProperty("display", 'none')
      if (canvas2) canvas2.style.setProperty("display", 'none')
    }

    setUpOfCanvasDomProps()
  }

  async function pagination(page: number) {
    if (page === -1 && currentPDFTool()!.currentPage == 1) return 1;
    if (page === +1 && currentPDFTool()!.currentPage == 6) return 6;

    await currentPDFTool()!.renderPage(currentPDFTool()!.currentPage + page);

    setCurrentPage(currentPDFTool()!.currentPage);
    setNumPages(currentPDFTool()!.numPages);

    updateCanvasInput()
    initSignaturPad()
  }

  // Create SignaturePad instances and load signatures when the component is mounted & if loadContract is available
  createEffect(() => {
    if (canvasSignatureReplaced() && canvasSignatureSubstitute()) {
      const signaturePadConfig = {
        minWidth: 2,
        maxWidth: 4,
        penColor: "rgb(66, 133, 244)",
      };

      setSignaturePad1(new SignaturePad(canvasSignatureReplaced()!, signaturePadConfig))
      setSignaturePad2(new SignaturePad(canvasSignatureSubstitute()!, signaturePadConfig))

      if (loadContract()) {
        const replacedSignatureDataUrl = loadContract()!.replacedSignatureDataUrl;
        const substituteSignatureDataUrl = loadContract()!.substituteSignatureDataUrl;

        setTimeout(() => {
          signaturePad1()?.fromDataURL(replacedSignatureDataUrl!);
          signaturePad2()?.fromDataURL(substituteSignatureDataUrl!);
        }, 100);
      }
    }
  });


  return (
    <div class="mx-auto flex flex-col gap-3 w-[90%]">
      <CTAPDFViewer changePage={pagination} currentPage={currentPage} numPages={numPages} pdfFile={pdfFile} pdfTool={currentPDFTool()!} saveContractInDB={saveContract} />
      <PDFCanvas setPDFInputFieldsRef={setPDFInputFieldsRef} />
    </div>
  );
}
