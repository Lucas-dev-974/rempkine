import { FiSave } from "solid-icons/fi";
import { VsFilePdf } from "solid-icons/vs";
import { Button } from "../../buttons/Button";
import { PDFPagination } from "../PDFPagination";
import { PDFTool } from "./PDFTool";

export function CTAPDFViewer(props: {
    pdfTool: PDFTool,
    pdfFile: () => unknown,
    saveContractInDB: () => void,
    changePage: (nb: number) => void,
    currentPage: () => number
    numPages: () => unknown

}) {
    return <div class="flex justify-between mb-4">
        <div class="flex gap-2">
            <Button
                onClick={() => props.pdfTool.downloadModifiedPdf(props.pdfFile() as File)}
                text="Télécharger le PDF modifié"
                size="xs"
                icon={<VsFilePdf size={19} />}
            />

            <Button
                onClick={props.saveContractInDB}
                text="Sauvegarder le PDF modifié"
                size="xs"
                icon={<FiSave size={19} />}
            />
        </div>

        <PDFPagination changePage={props.changePage} currentPage={props.currentPage()} numberOfPage={props.numPages() as number} />
    </div>
}