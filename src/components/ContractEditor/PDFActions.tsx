import { FaSolidChevronLeft, FaSolidChevronRight } from "solid-icons/fa";
import { currentPDFTool } from "./PDFEditor";
import { createSignal } from "solid-js";

interface PDFActionsProps {
    changePage: (index: number) => void;
}

export function PDFActions(props: PDFActionsProps) {
    const [currentPage, setCurrentPage] = createSignal(currentPDFTool()?.currentPage as number);

    function pagination(page: number) {
        props.changePage(page);
        setCurrentPage(currentPDFTool()?.currentPage as number);
    }


    return <div class="flex justify-end">
        <div class="flex items-center">
            <button class="bg-transparent flex items-center border-none outline-none" onClick={() => pagination(-1)} > <FaSolidChevronLeft size={16} /> </button>
            <p class="mx-4 text-sm"> {currentPage()} sur {currentPDFTool()?.numPages as number} </p>
            <button class="bg-transparent flex items-center border-none outline-none" onClick={() => pagination(+1)} > <FaSolidChevronRight size={16} /> </button >
        </div>
    </div>
}