import { JSX, Show } from "solid-js";

interface BottomSlideDialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: JSX.Element;
}

export function BottomSlideDialog(props: BottomSlideDialogProps) {
    return (
        <div class="fixed inset-0 z-50 pointer-events-none">
            <Show when={props.open}>
                <div class="fixed inset-0 bg-black bg-opacity-50 pointer-events-auto" onClick={props.onClose} />
            </Show>
            <div
                class="fixed bottom-0 left-0 w-[100vw] h-[60vh] bg-white rounded-t-xl shadow-xl p-4 transform transition-transform duration-500 pointer-events-auto"
                classList={{
                    "translate-y-full": !props.open,
                    "translate-y-0": props.open,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">{props.title}</h3>
                    <button aria-label="Fermer" class="p-1" onClick={props.onClose}> ✕ </button>
                </div>
                <div class="mt-4 h-[calc(60vh-56px)] overflow-auto">
                    {props.children}
                </div>
            </div>
        </div>
    );
}


