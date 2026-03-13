import SignaturePad from "signature_pad";
import { Component, createEffect, createSignal, on } from "solid-js";
import { Portal } from "solid-js/web";
import { Button } from "../../buttons/Button";
import { BottomSlideDialog } from "../../dialog/BottomSlideDialog";
import { SignatureEditorProps } from "./types";
import { SIGNATURE_CONFIG, SIGNATURE_LABELS, SIGNATURE_TITLES } from "./constants";

export const SignatureEditor: Component<SignatureEditorProps> = (props) => {
    const [canvasRef, setCanvasRef] = createSignal<HTMLCanvasElement>();
    const [signaturePad, setSignaturePad] = createSignal<SignaturePad>();

    const signaturePadConfig = {
        penColor: SIGNATURE_CONFIG.PEN_COLOR,
    };

    const resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement | undefined) => {
        if (!canvas) return;
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;
        if (displayWidth === 0 || displayHeight === 0) return;
        const context = canvas.getContext("2d");
        if (!context) return;
        canvas.width = Math.floor(displayWidth * ratio);
        canvas.height = Math.floor(displayHeight * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const handleWindowResize = () => {
        resizeCanvasToDisplaySize(canvasRef());
    };

    // Initialize/teardown on dialog open state
    createEffect(on(() => props.open, (isOpen) => {
        if (!isOpen) {
            window.removeEventListener('resize', handleWindowResize);
            return;
        }

        const drawingCanvas = canvasRef();
        resizeCanvasToDisplaySize(drawingCanvas);

        if (drawingCanvas) {
            setSignaturePad(new SignaturePad(drawingCanvas, signaturePadConfig));
        }

        requestAnimationFrame(() => resizeCanvasToDisplaySize(canvasRef()));
        window.addEventListener('resize', handleWindowResize);
    }));

    // Restore existing signature when dialog opens
    createEffect(() => {
        if (!props.open || !signaturePad() || !props.existingSignature) return;
        signaturePad()?.fromDataURL(props.existingSignature);
    });

    const handleClear = () => {
        signaturePad()?.clear();
    };

    const handleSave = () => {
        const pad = signaturePad();
        if (!pad) return;

        const dataURL = pad.toDataURL('image/png');
        if (!dataURL) return;

        props.onSave(dataURL);
    };

    const getTitle = () => {
        return props.selectedType === "replaced"
            ? SIGNATURE_TITLES.ADD_REPLACED
            : SIGNATURE_TITLES.ADD_SUBSTITUTE;
    };

    return (
        <Portal>
            <BottomSlideDialog
                open={props.open}
                onClose={props.onClose}
                title={getTitle()}
            >
                <div class="flex flex-col justify-between h-full px-3 pb-3 gap-2">
                    <canvas
                        id="signature-canvas"
                        ref={setCanvasRef}
                        class={SIGNATURE_CONFIG.CANVAS_CLASSES.EDITOR}
                    />

                    <div class="flex justify-center md:justify-end gap-3">
                        <Button text={SIGNATURE_LABELS.CLEAR} onClick={handleClear} />
                        <Button text={SIGNATURE_LABELS.CANCEL} onClick={props.onClose} />
                        <Button text={SIGNATURE_LABELS.SAVE} onClick={handleSave} />
                    </div>
                </div>
            </BottomSlideDialog>
        </Portal>
    );
};
