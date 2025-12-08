import { Show, JSX } from "solid-js";
import { VsChromeClose } from 'solid-icons/vs';
import { OutlinedButton } from "../buttons/OulinedButton";

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
        <Show when={props.isOpen}>
            <div
                class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
                onClick={props.onCancel}
            >
                <div
                    class="bg-white rounded-lg shadow-xl max-w-md w-[90vw] sm:w-[500px] p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-bold m-0 font-[Nunito] text-gray-800">
                            {props.title}
                        </h3>
                        <button
                            class="bg-none border-none text-2xl cursor-pointer text-gray-500 hover:text-gray-700 bg-transparent"
                            onClick={props.onCancel}
                            aria-label="Fermer"
                        >
                            <VsChromeClose size={24} />
                        </button>
                    </div>

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
                </div>
            </div>
        </Show>
    );
}

