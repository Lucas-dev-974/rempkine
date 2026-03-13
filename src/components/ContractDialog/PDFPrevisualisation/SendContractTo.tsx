import { createSignal, createEffect, on, Setter } from "solid-js"
import { mailService } from "../../../services/mail.service"
import { Button } from "../../buttons/Button"
import { currentPDFTool } from "../../ContractEditor/PDFEditor"
import { toSendBlob } from "../../../utils/PDFTool"
import { LabeledInput } from "../../inputs/LabeledInput"
import { NotificationService } from "../../../utils/notification.service"
import { LabeledTextarea } from "../../inputs/LabeledTextarea"
import storeService from "../../../utils/store.service"

export function SendContractTo(props: {
    setOpen: Setter<boolean>
}) {
    const [mailFrom, setMailFrom] = createSignal("")
    const [mailTo, setMailTo] = createSignal("")
    const [mailBody, setMailBody] = createSignal("")

    const [isLoading, setIsLoading] = createSignal(false)

    // Validation des emails
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const validateForm = (): boolean => {
        let isValid = true

        if (!mailFrom()) {
            NotificationService.push({
                content: "L'email expéditeur est requis",
                type: "error"
            })
            isValid = false
        } else if (!validateEmail(mailFrom())) {
            NotificationService.push({
                content: "Format d'email invalide",
                type: "error"
            })
            isValid = false
        }

        if (!mailTo()) {
            NotificationService.push({
                content: "L'email destinataire est requis",
                type: "error"
            })
            isValid = false
        } else if (!validateEmail(mailTo())) {
            NotificationService.push({
                content: "Format d'email invalide",
                type: "error"
            })
            isValid = false
        }

        return isValid
    }

    const handleSubmit = async (e?: Event) => {
        // Empêcher le rechargement de la page
        if (e) {
            e.preventDefault()
        }

        if (!validateForm()) {
            return
        }



        try {
            // Générer le PDF avec les signatures
            await currentPDFTool()?.downloadModifiedPdfWithStoredSignatures(currentPDFTool()?.pdfFile as File, false)
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error("Erreur lors de la génération du PDF:", error);
            }
            NotificationService.push({
                content: "Erreur lors de la génération du PDF",
                type: "error"
            })
            setIsLoading(false)
        }
    }

    createEffect(on(toSendBlob, async () => {
        if (toSendBlob() && mailFrom() && mailTo() && validateForm()) {

            try {
                const form = new FormData()
                form.append("contractFile", toSendBlob() as Blob, "contrat.pdf")
                form.append("from", mailFrom())
                form.append("to", mailTo())
                form.append("body", mailBody())

                const contractData = currentPDFTool()?.contractData
                if (contractData !== undefined) {
                    form.append("contractData", JSON.stringify(contractData))
                }

                console.log("contract data", contractData);

                const response: any = await mailService.sendContratTo(form)
                console.log("response", response);

                if (response.creatingContract) {
                    console.log("save contract in store:", response.creatingContract.contract);

                    currentPDFTool()?.setContractData(response.creatingContract.contract)
                    storeService.proxy.contracts = [...storeService.proxy.contracts!, response.creatingContract.contract]

                }
                NotificationService.push({
                    content: "Contrat envoyé.",
                    type: "info"
                })
                props.setOpen(false)
                // Réinitialiser le formulaire après envoi réussi
                setTimeout(() => {
                    setMailFrom("")
                    setMailTo("")
                }, 3000)

            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error("Erreur lors de l'envoi:", error);
                }
                NotificationService.push({
                    content: "Erreur lors de l'envoi du contrat",
                    type: "error"
                })
            } finally {
                setIsLoading(false)
            }
        }
    }))

    return (
        <div class="space-y-6">
            {/* Titre de la section */}
            <div class="text-center">
                <h3 class="text-lg font-medium text-gray-900">Envoyer le contrat par email</h3>
                <p class="text-sm text-gray-600">Remplissez les informations ci-dessous pour envoyer le contrat signé</p>
            </div>

            {/* Formulaire */}
            <div class=" flex flex-col gap-2">
                <LabeledInput
                    id="mailFrom"
                    label="Votre email"
                    type="mail"
                    value={mailFrom()}
                    onInput={(e) => { setMailFrom(e.target.value) }}
                />

                <LabeledInput
                    id="mailTo"
                    label="Email destinataire"
                    type="mail"
                    value={mailTo()}
                    onInput={(e) => { setMailTo(e.target.value) }}
                />

                <LabeledTextarea
                    id="mailBody"
                    label="Corp de l'email"
                    value={mailBody()}
                    onInput={(value) => { setMailBody(value) }}
                />
            </div>

            <div class="flex justify-center pt-4">
                <Button
                    text={isLoading() ? "Envoi en cours..." : "Envoyer le contrat"}
                    onClick={() => handleSubmit()}
                    disabled={isLoading()}
                    class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
        </div>
    )
}