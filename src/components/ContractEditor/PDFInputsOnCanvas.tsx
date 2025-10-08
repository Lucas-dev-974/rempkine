import { createSignal, onCleanup } from "solid-js"
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

    function getInputOfset() {
        if (window.innerWidth < 768) {
            return 10
        } else {
            return 18
        }
    }

    function getFontSize() {
        if (window.innerWidth < 768) {
            return 10
        } else {
            return 14
        }
    }

    return <div class="text-xs md:text-sm lg:text-md ">
        {canvasInputs().map((field) => (
            <input
                class={" border-none inset-0 overflow-visible outline-none"}
                type="text"
                value={parseDisplayData(field)}
                onInput={(e) => currentPDFTool()!.updateContractDataAndPDFFields(field.id, e.target.value)}
                style={{
                    "font-size": `${getFontSize()}px`,
                    position: "absolute",
                    left: `${field.left + getInputOfset()}px`,
                    top: `${field.top}px`,
                    width: `${field.width}px`,
                    height: `${field.height}px`,
                }}
            />
        ))}
    </div>
}