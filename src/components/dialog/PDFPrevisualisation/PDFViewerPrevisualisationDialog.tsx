import { createSignal, Show } from "solid-js"
import { Button } from "../../buttons/Button"
import { AiTwotoneEye } from 'solid-icons/ai'
import { PDFCanvas } from "../../contract/editor/PDFCanvas"

export function PDFViewerPrevisualisationDialog() {
    const [open, setOpen] = createSignal(false)

    return <>
        <Button onClick={() => setOpen(!open())} icon={<AiTwotoneEye />} text="ouvrir" />

        <Show when={open()}>
            <div class="overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setOpen(false)}>
                <div class="dialog bg-slate-200 rounded-lg relative overflow-auto z-50 max-w-[98vw]" onClick={(e) => e.stopPropagation()}>
                    <PDFCanvas />
                </div>
            </div>
        </Show>
    </>
}