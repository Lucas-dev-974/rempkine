import { NextIcon } from "../../icons/NextIcon";
import { PreviousIcon } from "../../icons/PreviousIcon";
import { createSignal } from "solid-js";
import { currentPDFTool } from "./PDFEditor";

interface PDFActionsProps {
    changePage: (index: number) => void;
    currentPage: number;
    numberOfPage: number
}

export function PDFActions(props: PDFActionsProps) {
    return <div class="flex items-center px-4 justify-between gap-4">
        <div class="flex items-center">
            <button class="h-2 w-2 rounded-full flex items-center" onClick={() => props.changePage(-1)} > <PreviousIcon /> </button>
            <p class="mx-4 text-sm"> {props.currentPage} sur {props.numberOfPage as number} </p>
            <button class="h-2 w-2 rounded-full flex items-center" onClick={() => props.changePage(+1)} > <NextIcon /> </button >
        </div>
    </div>
}