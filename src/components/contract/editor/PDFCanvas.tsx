import { onMount } from "solid-js";
import { currentPage, currentPDFTool, numPages, setCurrentPage, setNumPages, signaturePad1, signaturePad2, updateCanvasInput } from "./PDFEditor";
import { canvasInputs, PDFInputsOnCanvas, setCanvasInputs } from "./PDFInputsOnCanvas";
import { PDFPagination } from "../PDFPagination";
import { PDFFields } from "./PDFTool";

export function PDFCanvas() {
    onMount(() => {
        const canvas = document.getElementById("pdf-canvas") as HTMLCanvasElement
        currentPDFTool()!.getPagesFields()
        currentPDFTool()!.renderPage(1, canvas)
    })

    async function pagination(page: number) {
        const canvas = document.getElementById("pdf-canvas") as HTMLCanvasElement

        if (page === +1 && currentPDFTool()!.currentPage == 6) return 6;
        if (page === -1 && currentPDFTool()!.currentPage == 1) return 1;


        await currentPDFTool()!.renderPage(currentPDFTool()!.currentPage + page, canvas);


        setCurrentPage(currentPDFTool()!.currentPage);
        setNumPages(currentPDFTool()!.numPages);
        updateCanvasInput()
        initSignaturPad()
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
                setCanvasProperties(canvas1)

                // Create the second canvas
                const canvas2 = document.createElement("canvas");
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


    return <div class="relative mx-auto flex flex-col gap-2 pb-2 ">
        <canvas id="pdf-canvas" class="max-w-[600px] lg:w-[600px] w-full border border-gray-400 rounded-lg mx-auto" />
        <PDFInputsOnCanvas />
        <PDFPagination changePage={pagination} currentPage={currentPage()} numberOfPage={numPages() as number} />
    </div>
}