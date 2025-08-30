import { NextIcon } from "../../icons/NextIcon";
import { PreviousIcon } from "../../icons/PreviousIcon";

interface PDFPaginationProps {
    changePage: (index: number) => void;
    currentPage: number;
    numberOfPage: number
}

export function PDFPagination(props: PDFPaginationProps) {
    return <div class="flex items-center px-2">


        <div class="flex items-center">
            <button class="h-2 w-2 rounded-full flex items-center" onClick={() => props.changePage(-1)} > <PreviousIcon /> </button>
            <p class="mx-4 text-sm"> {props.currentPage} sur {props.numberOfPage as number} </p>
            <button class="h-2 w-2 rounded-full flex items-center" onClick={() => props.changePage(+1)} > <NextIcon /> </button >
        </div >
    </div>
}