import { onMount, createEffect, createSignal } from "solid-js";
import { currentPage, currentPDFTool, numPages, setCurrentPage, setNumPages, signaturePad1, signaturePad2, updateCanvasInput as updateCanvasInputField } from "./PDFEditor";
import { PDFInputsOnCanvas, setCanvasInputs } from "./PDFInputsOnCanvas";
import { PDFActions } from "../PDFActions";
import { PDFFields } from "./PDFTool";
import { signatureManager } from "../../contract-dialog/Signatures";

export function PDFCanvas() {
    createEffect(async () => {
        const tool = currentPDFTool();
        if (!tool) return;
        const canvas = document.getElementById("pdf-canvas") as HTMLCanvasElement | null;
        if (!canvas) return;
        await tool.renderPage(1, canvas);
        setCurrentPage(tool.currentPage);
        setNumPages(tool.numPages);
        updateCanvasInputsFromTool();
        if (tool.currentPage === 6) {
            displaySigsPage6();
        } else {
            removeSigsCanvases();
        }
    })

    async function pagination(page: number) {
        const canvas = document.getElementById("pdf-canvas") as HTMLCanvasElement

        if (page === +1 && currentPDFTool()!.currentPage == 6) return 6;
        if (page === -1 && currentPDFTool()!.currentPage == 1) return 1;

        await currentPDFTool()!.renderPage(currentPDFTool()!.currentPage + page, canvas);

        setCurrentPage(currentPDFTool()!.currentPage);
        setNumPages(currentPDFTool()!.numPages);
        updateCanvasInputsFromTool()

        // Manage signature canvases visibility per page
        if (currentPDFTool()!.currentPage === 6) {
            displaySigsPage6();
        } else {
            removeSigsCanvases();
        }
    }


    function updateCanvasInputsFromTool() {
        currentPDFTool()?.setContractDataToPDFInputsFields(currentPDFTool()?.contractData!)
        const fields = currentPDFTool()?.PDFInputsFieldsMetadata?.filter(page => page.page == currentPage())[0].fields

        // ! necessary to update canvas inputs fields with the data contract
        setCanvasInputs(prev => {
            if (!prev) return prev
            prev = [...fields as PDFFields[]]
            return prev
        })
    }

    function displaySigsPage6() {
        // Only display on page 6
        if (currentPDFTool()?.currentPage !== 6) return;

        const pdfCanvas = document.getElementById("pdf-canvas") as HTMLCanvasElement | null;
        if (!pdfCanvas || !pdfCanvas.parentElement) return;

        const container = pdfCanvas.parentElement as HTMLElement; // Parent is relative positioned

        // Reuse if already present, otherwise create
        let replacedCanvas = container.querySelector('canvas[data-sig="replaced"]') as HTMLCanvasElement | null;
        let substituteCanvas = container.querySelector('canvas[data-sig="substitute"]') as HTMLCanvasElement | null;

        const ensureCanvas = (existing: HTMLCanvasElement | null, dataAttr: string) => {
            if (existing) return existing;
            const c = document.createElement("canvas");

            c.setAttribute("data-sig", dataAttr);
            c.width = 220;
            c.height = 120;
            c.style.background = "transparent"
            c.style.position = "absolute";
            c.style.pointerEvents = "none";
            container.append(c);
            return c;
        };

        replacedCanvas = ensureCanvas(replacedCanvas, "replaced");
        substituteCanvas = ensureCanvas(substituteCanvas, "substitute");

        // Positioning relative to the PDF canvas size
        // Adjust these values as needed to match the signature boxes on page 6
        const baseWidth = 600; // matches max PDF canvas width in UI
        const scale = pdfCanvas.clientWidth / baseWidth;

        // Example target positions (in px for a 600px wide PDF canvas)
        const replacedPos = { left: 80, top: 620 };
        const substitutePos = { left: 340, top: 620 };

        replacedCanvas.style.left = `${Math.round(replacedPos.left * scale)}px`;
        replacedCanvas.style.top = `${Math.round(replacedPos.top * scale)}px`;
        replacedCanvas.style.width = `${Math.round(replacedCanvas.width * scale)}px`;
        replacedCanvas.style.height = `${Math.round(replacedCanvas.height * scale)}px`;

        substituteCanvas.style.left = `${Math.round(substitutePos.left * scale)}px`;
        substituteCanvas.style.top = `${Math.round(substitutePos.top * scale)}px`;
        substituteCanvas.style.width = `${Math.round(substituteCanvas.width * scale)}px`;
        substituteCanvas.style.height = `${Math.round(substituteCanvas.height * scale)}px`;

        // Register canvases so the signature manager can draw when signatures change
        signatureManager.setCanvasSignatureReplaced(replacedCanvas);
        signatureManager.setCanvasSignatureSubstitute(substituteCanvas);

        // If signatures already exist, draw them immediately
        const drawSig = (canvas: HTMLCanvasElement | undefined, data?: string) => {
            if (!canvas || !data) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = data;
        };

        const sigs = signatureManager.signatures();
        if (sigs) {
            console.log("draw sigs");

            drawSig(replacedCanvas, sigs.replaced);
            drawSig(substituteCanvas, sigs.substitute);
        }
    }

    function removeSigsCanvases() {
        const pdfCanvas = document.getElementById("pdf-canvas") as HTMLCanvasElement | null;
        if (!pdfCanvas || !pdfCanvas.parentElement) return;
        const container = pdfCanvas.parentElement as HTMLElement;
        const canvases = container.querySelectorAll('canvas[data-sig]');
        canvases.forEach((c) => c.remove());
        signatureManager.setCanvasSignatureReplaced(undefined as unknown as HTMLCanvasElement);
        signatureManager.setCanvasSignatureSubstitute(undefined as unknown as HTMLCanvasElement);
    }


    return <div class="relative mx-auto flex flex-col gap-2 pb-2 ">
        <canvas id="pdf-canvas" class="max-w-[600px] lg:w-[600px] w-full border border-gray-400 rounded-lg mx-auto" />
        <PDFInputsOnCanvas />
        <PDFActions changePage={pagination} currentPage={currentPage()} numberOfPage={numPages() as number} />
    </div >
}