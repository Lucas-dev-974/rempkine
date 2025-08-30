import { Component, createSignal } from "solid-js";
import { SignatureCanvasProps } from "./types";
import { SIGNATURE_CONFIG, SIGNATURE_LABELS } from "./constants";

export const SignatureCanvas: Component<SignatureCanvasProps> = (props) => {
    const [isHovered, setIsHovered] = createSignal(false);

    const getSignatureTypeLabel = () => {
        return props.type === "replaced" ? SIGNATURE_LABELS.REPLACED : SIGNATURE_LABELS.SUBSTITUTE;
    };

    return (
        <div
            class={SIGNATURE_CONFIG.CONTAINER_CLASSES.CANVAS}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <canvas
                ref={props.canvasRef}
                id={`${props.type}-signature`}
                class={SIGNATURE_CONFIG.CANVAS_CLASSES.DISPLAY}
            />
            <button
                class={SIGNATURE_CONFIG.CONTAINER_CLASSES.BUTTON}
                onClick={() => props.onEdit(props.type)}
            >
                {SIGNATURE_LABELS.EDIT}
            </button>
        </div>
    );
};
