import { createSignal, createEffect, on, Setter } from "solid-js"
import { mailService } from "../../../services/mail.service"
import { Button } from "../../buttons/Button"
import { currentPDFTool } from "../../ContractEditor/PDFEditor"
import { toSendBlob } from "../../ContractEditor/PDFTool"
import { LabeledInput } from "../../inputs/LabeledInput"
import { NotificationService } from "../../../utils/notification.service"

export function SendContractTo(props: {
    setOpen: Setter<boolean>
}) {
    const [mailFrom, setMailFrom] = createSignal("")
    const [mailTo, setMailTo] = createSignal("")
    const [isLoading, setIsLoading] = createSignal(false)
    const [errors, setErrors] = createSignal<{ mailFrom?: string, mailTo?: string }>({})

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

        setIsLoading(true)
        setErrors({})

        try {
            // Générer le PDF avec les signatures
            await currentPDFTool()?.downloadModifiedPdfWithStoredSignatures(currentPDFTool()?.pdfFile as File, false)
        } catch (error) {
            console.error("Erreur lors de la génération du PDF:", error)
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

                await mailService.sendContratTo(form)
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
                console.error("Erreur lors de l'envoi:", error)
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
                <h3 class="text-lg font-medium text-gray-900 mb-2">Envoyer le contrat par email</h3>
                <p class="text-sm text-gray-600">Remplissez les informations ci-dessous pour envoyer le contrat signé</p>
            </div>

            {/* Formulaire */}
            <div class="space-y-5">
                <div class="space-y-2">
                    <LabeledInput
                        id="mailFrom"
                        label="Votre email"
                        type="mail"
                        value={mailFrom()}
                        onInput={(e) => {
                            setMailFrom(e.target.value)
                            // Effacer l'erreur quand l'utilisateur tape
                            if (errors().mailFrom) {
                                setErrors({ ...errors(), mailFrom: undefined })
                            }
                        }}
                    />
                    {errors().mailFrom && (
                        <p class="text-red-500 text-sm mt-1">{errors().mailFrom}</p>
                    )}
                </div>

                <div class="space-y-2">
                    <LabeledInput
                        id="mailTo"
                        label="Email destinataire"
                        type="mail"
                        value={mailTo()}
                        onInput={(e) => {
                            setMailTo(e.target.value)
                            // Effacer l'erreur quand l'utilisateur tape
                            if (errors().mailTo) {
                                setErrors({ ...errors(), mailTo: undefined })
                            }
                        }}
                    />
                    {errors().mailTo && (
                        <p class="text-red-500 text-sm mt-1">{errors().mailTo}</p>
                    )}
                </div>
            </div>

            {/* Bouton d'envoi */}
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