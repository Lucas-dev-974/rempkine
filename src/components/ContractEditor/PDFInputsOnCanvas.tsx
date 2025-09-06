import { createSignal, onMount, Setter, onCleanup } from "solid-js"
import { loadContract } from "../../const.data";
import { currentPDFTool } from "./PDFEditor"
import { PDFFields } from "./PDFTool";
import { formatDate } from "../ContractDialog/DropdownContratInformations/ContractInformationsFields";

export const [canvasInputs, setCanvasInputs] = createSignal<PDFFields[]>([]);

export function PDFInputsOnCanvas() {
    onCleanup(() => setCanvasInputs([]))

    function parseDisplayData(fields: PDFFields): string {
        const dateFields = ["96R", "102R", "122R", "123R", "131R", "138R"]
        if (dateFields.includes(fields.id)) {
            const dateFormat = formatDate(fields.value)
            return dateFormat
        }
        return fields.value ?? ""
    }

    return <div class="text-sm  md:text-sm lg:text-md ">
        {canvasInputs().map((field) => (
            <input
                class={"pdf-input"}
                type="text"
                value={parseDisplayData(field)}
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