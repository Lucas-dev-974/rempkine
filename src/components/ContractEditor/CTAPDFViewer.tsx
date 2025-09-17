import { FiSave } from "solid-icons/fi";
import { VsFilePdf } from "solid-icons/vs";
import { Button } from "../buttons/Button";
import { loggedIn, loadContract, setLoadContrat } from "../../const.data";
import { ContractEntity } from "../../models/contract.entity";
import { contractService } from "../../services/contract.service";
import { NotificationService } from "../../utils/notification.service";
import storeService from "../../utils/store.service";
import { PDFViewerPrevisualisationDialog } from "../ContractDialog/PDFPrevisualisation/PDFViewerPrevisualisationDialog";
import { currentPDFTool } from "./PDFEditor";

function createContractID(): string {
    // Génère un ID unique basé sur timestamp et random
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `contract_${timestamp}_${randomPart}`;
}

export function CTAPDFViewer() {
    async function saveContractInDB() {
        const contractFromPDF: Partial<ContractEntity> = currentPDFTool()!.contractData

        //  * If Logged in then create or update contract
        if (loggedIn()) {
            if (!loadContract()) {

                const contract = await contractService.createContract(contractFromPDF);
                contract.updatedAt = new Date(Date.now())
                storeService.proxy.contracts = [...storeService.proxy.contracts!, contract]
                NotificationService.push({
                    content: "Contrat sauvegarder comme brouillon",
                    type: "info",
                });
            } else {
                const contract = await contractService.upadte(contractFromPDF);

                storeService.proxy.contracts = storeService.proxy.contracts?.map(_contract => {
                    if (_contract.id == contract.id) {
                        console.log("update local:", contract);

                        return contract
                    }
                    return _contract
                })

                NotificationService.push({
                    content: "Contrat mis à jour",
                    type: "info",
                });
            }

        } else {
            if (!storeService.proxy.contracts) storeService.proxy.contracts = []

            if (!loadContract()) {
                storeService.proxy.contracts = [
                    ...storeService.proxy.contracts,
                    {
                        id: createContractID(),
                        logoutCreate: true,
                        ...contractFromPDF,
                    },
                ];

                setLoadContrat(contractFromPDF)

                NotificationService.push({
                    content: "Contrat sauvegarder comme brouillon",
                    type: "info",
                });

            } else {
                let contracts: Partial<ContractEntity>[] = storeService.proxy.contracts
                storeService.proxy.contracts = contracts.map(contract => {
                    if (contract.id == contractFromPDF.id) {
                        contract = contractFromPDF
                    }
                    return contract
                })

                NotificationService.push({
                    content: "Contrat mis à jour",
                    type: "info",
                });
            }
        }
    }

    function downloadPDF() {
        console.log("download PDF", currentPDFTool()!.pdfFile);
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