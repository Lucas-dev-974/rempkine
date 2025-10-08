import { CgChevronLeftO, CgChevronRightO } from "solid-icons/cg";

interface PDFActionsProps {
    changePage: (index: number) => void;
    currentPage: number;
    numberOfPage: number
}

export function PDFActions(props: PDFActionsProps) {
    return <div class="flex items-center px-4 justify-end gap-4">
        <div class="flex items-center">
            <button class="h-2 w-2 rounded-full flex items-center" onClick={() => props.changePage(-1)} > <CgChevronLeftO /> </button>
            <p class="mx-4 text-sm"> {props.currentPage} sur {props.numberOfPage as number} </p>
            <button class="h-2 w-2 rounded-full flex items-center" onClick={() => props.changePage(+1)} > <CgChevronRightO /> </button >
        </div>
    </div>
}