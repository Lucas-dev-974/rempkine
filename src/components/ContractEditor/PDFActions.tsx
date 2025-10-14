import { CgChevronLeftO, CgChevronRightO } from "solid-icons/cg";
import { FaSolidChevronLeft, FaSolidChevronRight } from "solid-icons/fa";

interface PDFActionsProps {
    changePage: (index: number) => void;
    currentPage: number;
    numberOfPage: number
}

export function PDFActions(props: PDFActionsProps) {
    return <div class="flex justify-end">
        <div class="flex items-center">
            <button class="bg-transparent flex items-center border-none outline-none" onClick={() => props.changePage(-1)} > <FaSolidChevronLeft size={16} /> </button>
            <p class="mx-4 text-sm"> {props.currentPage} sur {props.numberOfPage as number} </p>
            <button class="bg-transparent flex items-center border-none outline-none" onClick={() => props.changePage(+1)} > <FaSolidChevronRight size={16} /> </button >
        </div>
    </div>
}