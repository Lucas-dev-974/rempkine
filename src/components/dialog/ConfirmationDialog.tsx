import { Portal } from "solid-js/web";
import { Button } from "../buttons/Button";
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
        <Portal>
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
                    <p class="text-sm sm:text-base text-gray-700 font-[Nunito] m-0 text-center">
                        {props.message}
                    </p>
                </div>

                <div class="flex gap-3 justify-end ">
                    <OutlinedButton
                        text={props.cancelText || "Annuler"}
                        onClick={props.onCancel}
                        size="medium"
                        class="flex-1 sm:flex-none"
                    />
                    <Button
                        text={props.confirmText || "Confirmer"}
                        onClick={props.onConfirm}
                        size="medium"
                        class="flex-1 sm:flex-none"
                        isDanger={true}
                    />
                </div>
            </DialogWrapper>
        </Portal>
    );
}

