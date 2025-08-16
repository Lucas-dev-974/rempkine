import { Accessor, createEffect, Setter } from "solid-js";
import { PDFInputsOnCanvas } from "./PDFInputsOnCanvas";
import { PDFTool } from "./PDFTool";

export function PDFCanvas(props: { setPDFInputFieldsRef: Setter<HTMLElement | undefined> }) {
    return <div class="relative mx-auto">
        <canvas id="pdf-canvas" class=" border border-gray-400 rounded-lg" />
        <PDFInputsOnCanvas setPDFInputFieldsRef={props.setPDFInputFieldsRef} />
    </div>
}