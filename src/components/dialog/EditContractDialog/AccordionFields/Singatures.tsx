import { createSignal, onCleanup } from "solid-js";
import { AccordionItem } from "../../../Accordion/AccordionItem";
import { AccordionFieldsProps } from "./ReplacedFields";
import { SignatureCanvas } from "./SignatureCanvas";
import { SignatureEditor } from "./SignatureEditor";
import { useSignatureManager } from "./index";
import { SignatureType } from "./types";
import { currentPDFTool } from "../../../contract/editor/PDFEditor";

export function Signatures(props: AccordionFieldsProps) {
    const [valid, setValid] = createSignal(false);
    const [selectedSignatory, setSelectedSignatory] = createSignal<SignatureType>("replaced");
    const [isEditorOpen, setIsEditorOpen] = createSignal(false);

    const {
        canvasSignatureSubstitute,
        setCanvasSignatureSubstitute,
        canvasSignatureReplaced,
        setCanvasSignatureReplaced,
        signatures,
        updateSignature,
    } = useSignatureManager();

    const handleEditSignature = (type: SignatureType) => {
        setSelectedSignatory(type);
        setIsEditorOpen(true);
    };

    const handleSaveSignature = (signatureData: string) => {
        console.log("Sauvegarde de la signature:", selectedSignatory(), signatureData.substring(0, 50) + "...");

        updateSignature(selectedSignatory(), signatureData);

        // Mettre à jour les signatures dans le contrat après avoir mis à jour le signal
        currentPDFTool()!.updateSignaturesInContract(signatures);

        setIsEditorOpen(false);
        isValid()
    };

    const handleCloseEditor = () => {
        setIsEditorOpen(false);
    };

    const getExistingSignature = () => {
        const sigs = signatures();
        return selectedSignatory() === "replaced" ? sigs?.replaced : sigs?.substitute;
    };

    function isValid() {
        if (signatures()?.replaced && signatures()?.substitute) {
            setValid(true);
        } else {
            setValid(false);
        }
    }

    onCleanup(() => {
        useSignatureManager().setSignatures({
            replaced: "",
            substitute: "",
        });
    });
    return (
        <AccordionItem
            id={4}
            title="Signatures"
            toggle={props.toggleItem}
            isOpen={
                (typeof props.items === "function" ? props.items() : props.items).find(
                    (i: { id: number }) => i.id === 4
                )?.isOpen ?? false
            }
            valid={valid()}
        >
            <div class="flex flex-col gap-3">
                <div class="flex justify-center sm:justify-between flex-wrap gap-1">
                    <SignatureCanvas
                        type="replaced"
                        onEdit={handleEditSignature}
                        canvasRef={setCanvasSignatureReplaced}
                    />
                    <SignatureCanvas
                        type="substitute"
                        onEdit={handleEditSignature}
                        canvasRef={setCanvasSignatureSubstitute}
                    />
                </div>
            </div>

            <SignatureEditor
                open={isEditorOpen()}
                onClose={handleCloseEditor}
                selectedType={selectedSignatory()}
                onSave={handleSaveSignature}
                existingSignature={getExistingSignature()}
            />
        </AccordionItem>
    );
}