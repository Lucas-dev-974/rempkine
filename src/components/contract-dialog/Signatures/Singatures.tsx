import { createSignal, onCleanup } from "solid-js";
import { DropdownItem } from "../../Dropdown/DropdownItem";
import { AccordionFieldsProps } from "../DropdownContratInformations/ReplacedFields";
import { SignatureCanvas } from "./SignatureCanvas";
import { SignatureEditor } from "./SignatureEditor";
import { SignatureType } from "./types";
import { currentPDFTool } from "../../contract/editor/PDFEditor";
import { signatureManager } from "./SignatureManager";

export function Signatures(props: AccordionFieldsProps) {
    const [valid, setValid] = createSignal(false);
    const [selectedSignatory, setSelectedSignatory] = createSignal<SignatureType>("replaced");
    const [isEditorOpen, setIsEditorOpen] = createSignal(false);


    const handleEditSignature = (type: SignatureType) => {
        setSelectedSignatory(type);
        setIsEditorOpen(true);
    };

    const handleSaveSignature = (signatureData: string) => {
        signatureManager.updateSignature(selectedSignatory(), signatureData);

        // Mettre à jour les signatures dans le contrat après avoir mis à jour le signal
        currentPDFTool()!.updateSignaturesInContract(signatureManager.signatures);

        setIsEditorOpen(false);
        isValid()
    };

    const handleCloseEditor = () => {
        setIsEditorOpen(false);
    };

    const getExistingSignature = () => {
        const sigs = signatureManager.signatures();
        return selectedSignatory() === "replaced" ? sigs?.replaced : sigs?.substitute;
    };

    function isValid() {
        if (signatureManager.signatures()?.replaced && signatureManager.signatures()?.substitute) {
            setValid(true);
        } else {
            setValid(false);
        }
    }

    onCleanup(() => {
        signatureManager.setSignatures({
            replaced: "",
            substitute: "",
        });
    });
    return (
        <DropdownItem
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
                        canvasRef={signatureManager.setCanvasSignatureReplaced}
                    />
                    <SignatureCanvas
                        type="substitute"
                        onEdit={handleEditSignature}
                        canvasRef={signatureManager.setCanvasSignatureSubstitute}
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
        </DropdownItem>
    );
}