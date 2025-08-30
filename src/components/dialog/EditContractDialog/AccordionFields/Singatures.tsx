import SignaturePad from "signature_pad"
import { createEffect, createSignal, on, onMount } from "solid-js"
import { AccordionItem } from "../../../Accordion/AccordionItem";
import { AccordionFieldsProps } from "./ReplacedFields";
import { Button } from "../../../buttons/Button";
import { BottomSlideDialog } from "../../BottomSlideDialog";

export const [canvasSignatureSubstitute, setCanvasSignatureSubstitute] = createSignal<HTMLCanvasElement>()
export const [canvasSignatureReplaced, setCanvasSignatureReplaced] = createSignal<HTMLCanvasElement>()
export const [canvasSignature, setCanvasSignature] = createSignal<HTMLCanvasElement>();

export const [signaturePad, setSignaturePad] = createSignal<SignaturePad>()
export const [signatures, setSignatures] = createSignal<{ replaced?: string, substitute?: string }>()

export function Signatures(props: AccordionFieldsProps) {

    const [selectedSignatory, setSelectedSignatory] = createSignal<"replaced" | "substitute">("replaced")
    const [open, setOpen] = createSignal(false)

    // Keep config minimal and typed to avoid unexpected runtime changes
    const signaturePadConfig: Partial<SignaturePad> & { penColor?: string } = {
        // minWidth: 5,
        // maxWidth: 10,
        penColor: "rgb(66, 133, 244)",
    };

    function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement | undefined) {
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
    }

    function getTargetCanvas() {
        return selectedSignatory() === "replaced" ? canvasSignatureReplaced() : canvasSignatureSubstitute();
    }



    // Initialize/teardown on drawer open state
    createEffect(on(open, () => {
        if (!open()) {
            window.removeEventListener('resize', handleWindowResize);
            return;
        }

        // Ensure the drawing canvas matches its rendered size
        const drawingCanvas = canvasSignature();
        resizeCanvasToDisplaySize(drawingCanvas);

        // Create signature pad tied to the drawing canvas
        if (drawingCanvas) {
            setSignaturePad(new SignaturePad(drawingCanvas, signaturePadConfig));
        }

        // Recalculate after potential layout recalculations
        requestAnimationFrame(() => resizeCanvasToDisplaySize(canvasSignature()));

        // Listen for window resizes while open
        window.addEventListener('resize', handleWindowResize);
    }))

    // Restore signature when selectedSignatory changes or when signaturePad is ready
    createEffect(() => {
        if (!open() || !signaturePad()) return;

        const currentSignature = selectedSignatory() === "replaced"
            ? signatures()?.replaced
            : signatures()?.substitute;

        if (currentSignature) {
            signaturePad()?.fromDataURL(currentSignature);
        }
    })

    // Draw signatures on target canvases when signatures state changes
    createEffect(() => {
        const sigs = signatures();
        if (!sigs) return;

        // Draw replaced signature
        if (sigs.replaced) {
            const canvas = canvasSignatureReplaced();
            const ctx = canvas?.getContext("2d");
            if (canvas && ctx) {
                const img = new Image();
                img.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
                img.src = sigs.replaced;
            }
        }

        // Draw substitute signature
        if (sigs.substitute) {
            const canvas = canvasSignatureSubstitute();
            const ctx = canvas?.getContext("2d");
            if (canvas && ctx) {
                const img = new Image();
                img.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
                img.src = sigs.substitute;
            }
        }
    })


    function handleWindowResize() {
        resizeCanvasToDisplaySize(canvasSignature());
    }

    function transferSignatureToTarget() {
        const pad = signaturePad();

        if (!pad) return;
        const dataURL = pad.toDataURL();
        if (!dataURL) return;

        // Update signatures state while preserving existing signatures
        const currentSignatures = signatures() || {};
        if (selectedSignatory() === "replaced") {
            setSignatures({ ...currentSignatures, replaced: dataURL });
        } else {
            setSignatures({ ...currentSignatures, substitute: dataURL });
        }

        const target = getTargetCanvas();
        const targetContext = target?.getContext("2d");
        if (!target || !targetContext) return;

        const image = new Image();
        image.onload = () => {
            targetContext.clearRect(0, 0, target.width, target.height);
            targetContext.drawImage(image, 0, 0, target.width, target.height);
            setOpen(false);
        };
        image.src = dataURL;
    }

    return <AccordionItem
        id={4}
        title="Signatures"
        toggle={props.toggleItem}
        isOpen={
            (typeof props.items === "function" ? props.items() : props.items).find(
                (i: { id: number }) => i.id === 4
            )?.isOpen ?? false
        }
    >

        <div class="flex flex-col gap-3 ">
            <div class="flex justify-center sm:justify-between flex-wrap gap-1">
                <div class="relative group w-[80vw] sm:w-[48%]">
                    <canvas ref={setCanvasSignatureReplaced} id="replaced-signature" class="bg-slate-300 w-full mx-auto"></canvas>
                    <button
                        class="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40 text-white font-medium"
                        onClick={() => {
                            setSelectedSignatory("replaced")
                            setOpen(true)
                        }}
                    >
                        Éditer
                    </button>
                </div>
                <div class="relative group w-[80vw] sm:w-[48%]">
                    <canvas ref={setCanvasSignatureSubstitute} id="substitute-signature" class="bg-slate-300 w-full mx-auto"></canvas>
                    <button
                        class="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40 text-white font-medium"
                        onClick={() => {
                            setSelectedSignatory("substitute")
                            setOpen(true)
                        }}
                    >
                        Éditer
                    </button>
                </div>
            </div>
        </div>

        <BottomSlideDialog open={open()} onClose={() => setOpen(false)} title={"Ajouter la signature du " + (selectedSignatory() == "replaced" ? "remplacé" : "remplaçant")}>
            <div class="flex flex-col justify-between h-full px-3 pb-3 gap-2 ">
                <canvas id="signature-canvas" ref={setCanvasSignature} class="border border-slate-300 rounded-md w-[80vw] h-[40vh] mx-auto" />

                <div class="flex justify-center md:justify-end gap-3">
                    <Button text="Effacé" onClick={() => signaturePad()?.clear()} />
                    <Button text="Annuler" onClick={() => setOpen(false)} />
                    <Button text="Enregistrer" onClick={transferSignatureToTarget} />
                </div>
            </div>
        </BottomSlideDialog>
    </AccordionItem>
}