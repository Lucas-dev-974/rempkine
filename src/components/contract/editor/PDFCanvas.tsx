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