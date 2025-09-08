import { FiSave } from "solid-icons/fi";
import { VsFilePdf } from "solid-icons/vs";
import { Button } from "../buttons/Button";
import { createSignal, createUniqueId } from "solid-js";
import { loggedIn, loadContract, setLoadContrat } from "../../const.data";
import { ContractEntity } from "../../models/contract.entity";
import { contractService } from "../../services/contract.service";
import { NotificationService } from "../../utils/notification.service";
import storeService from "../../utils/store.service";
import { PDFViewerPrevisualisationDialog } from "../ContractDialog/PDFPrevisualisation/PDFViewerPrevisualisationDialog";
import { currentPDFTool } from "./PDFEditor";
import { LabeledSelect } from "../inputs/LabeledSelect";
import { FiSend } from 'solid-icons/fi'

export function CTAPDFViewer() {
    // const [replacedEmail, setReplacedEmail] = createSignal("")
    // const [substituteEmail, setSubstituteEmail] = createSignal("")
    const [selectedSentTo, selectedSendTo] = createSignal<"replaced" | "substitute" | "other">("other")

    async function saveContractInDB() {
        const contractFromPDF: Partial<ContractEntity> = currentPDFTool()!.contractData

        //  * If Logged in then create or update contract
        if (loggedIn()) {
            if (!loadContract()) {
                await contractService.createContract(contractFromPDF);
                NotificationService.push({
                    content: "Contrat sauvegarder comme brouillon",
                    type: "info",
                });
            } else {
                await contractService.upadte(contractFromPDF);
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
                        id: createUniqueId(),
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
        currentPDFTool()!.downloadModifiedPdfWithStoredSignatures(currentPDFTool()!.pdfFile as File)
    }

    function getReplacedEmail() {
        console.log("get replaced email");

        if (!currentPDFTool()?.contractData.replacedEmail) {
            NotificationService.push({
                content: "Veuillez entrer l'email du remplacé",
                type: "info"
            })
        }
        return currentPDFTool()?.contractData.replacedEmail!
    }

    function getSubstituteEmail() {
        if (!currentPDFTool()?.contractData.substituteEmail) {
            NotificationService.push({
                content: "Veuillez entrer l'email du remplaçant",
                type: "info"
            })
            return ""
        }
        return currentPDFTool()?.contractData.substituteEmail!
    }


    return <div class="flex justify-between items-center gap-2 my-2">
        {/* <div>
            <LabeledSelect id="sendTo" label="Envoyé à" options={[
                { label: "Remplacé", value: "replaced" },
                { label: "Remplaçant", value: "substitute" },
            ]} />

            <Button onClick={() => { }} icon={<FiSend />} text="envoyé" />
        </div> */}

        <div>
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
    </div>
}