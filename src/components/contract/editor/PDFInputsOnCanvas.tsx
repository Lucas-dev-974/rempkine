import { currentPDFTool } from "./PDFEditor"
import { createSignal, onMount, Setter, onCleanup } from "solid-js"
import { PDFFields } from "./PDFTool";
import { loadContract } from "../../../const.data";

export const [canvasInputs, setCanvasInputs] = createSignal<PDFFields[]>([]);

export function PDFInputsOnCanvas(props: { setPDFInputFieldsRef: Setter<HTMLElement | undefined> }) {
    onMount(() => {
        if (loadContract() && currentPDFTool()) {

        }
    })

    onCleanup(() => setCanvasInputs([]))

    return <div ref={props.setPDFInputFieldsRef} class="text-sm  md:text-sm lg:text-md ">
        {canvasInputs().map((field) => (
            <input
                class="pdf-input"
                type="text"
                value={field.value ?? ""}
                onInput={(e) => currentPDFTool()!.updateContractDataAndPDFFields(field.id, e.target.value)}
                style={{
                    position: "absolute",
                    left: `${field.left}px`,
                    top: `${field.top + 1}px`,
                    width: `${field.width}px`,
                    height: `${field.height}px`,
                }}
            />
        ))}
    </div>
}