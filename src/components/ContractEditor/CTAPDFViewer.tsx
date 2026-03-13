import { FiSave } from "solid-icons/fi";
import { VsFilePdf } from "solid-icons/vs";
import { Button } from "../buttons/Button";
import { ContractEntity } from "../../models/contract.entity";
import { contractService } from "../../services/contract.service";
import { NotificationService } from "../../utils/notification.service";
import storeService from "../../utils/store.service";
import { PDFViewerPrevisualisationDialog } from "../ContractDialog/PDFPrevisualisation/PDFViewerPrevisualisationDialog";
import { currentPDFTool } from "./PDFEditor";
import { loadContract } from "../../const.data";


export function CTAPDFViewer() {
    async function saveContractInDB() {
        const contractFromPDF: Partial<ContractEntity> = currentPDFTool()!.getContractData()

        if (!loadContract() || loadContract() == undefined) {
            const contract = await contractService.createContract(contractFromPDF);
            currentPDFTool()?.setContractData(contract);
            storeService.proxy.contracts = [...storeService.proxy.contracts!, contract]
            NotificationService.push({
                content: "Contrat sauvegarder",
                type: "info",
            });
        } else {
            const contract = await contractService.update(contractFromPDF);
            currentPDFTool()?.setContractData(contract);
            storeService.proxy.contracts = storeService.proxy.contracts?.map(_contract => {
                if (_contract.id == contract.id) return contract
                return _contract
            })

            NotificationService.push({
                content: "Contrat mis à jour",
                type: "info",
            });
        }

    }

    function downloadPDF() {
        currentPDFTool()!.downloadModifiedPdfWithStoredSignatures(currentPDFTool()!.pdfFile as File)
    }


    return <div class="flex justify-end items-center gap-2 my-2">
        <Button
            onClick={downloadPDF}
            text="Télécharger le PDF modifié"
            size="xs"
            icon={<VsFilePdf size={19} />}
        />

        <Button
            onClick={saveContractInDB}
            text="Sauvegarder le PDF modifié"
            size="xs"
            icon={<FiSave size={19} />}
        />
        <PDFViewerPrevisualisationDialog />
    </div>
}