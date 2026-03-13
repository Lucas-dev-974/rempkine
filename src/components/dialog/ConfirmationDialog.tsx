import { OutlinedButton } from "../buttons/OulinedButton";
import { DialogWrapper } from "./DialogWrapper";

interface ConfirmationDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmationDialog(props: ConfirmationDialogProps) {
    return (
        <DialogWrapper
            name="confirmationDialog"
            btnText=""
            title={props.title}
            isInNavbar={false}
            isOpen={props.isOpen}
            onClose={props.onCancel}
            hideTriggerButton
        >
            <div class="mb-6">
                <p class="text-gray-700 font-[Nunito] m-0">
                    {props.message}
                </p>
            </div>

            <div class="flex gap-3 justify-end">
                <OutlinedButton
                    text={props.cancelText || "Annuler"}
                    onClick={props.onCancel}
                    size="medium"
                    class="flex-1 sm:flex-none"
                />
                <button
                    class="font-[Nunito] text-base px-4 py-2 rounded-lg cursor-pointer text-white duration-700 hover:shadow-lg border-none flex-1 sm:flex-none bg-red-600 hover:bg-red-700"
                    onClick={props.onConfirm}
                >
                    {props.confirmText || "Confirmer"}
                </button>
            </div>
        </DialogWrapper>
    );
}

