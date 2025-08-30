import { VsChromeClose } from 'solid-icons/vs'
import { Button } from "../../../buttons/Button";
import { toggleDialog } from "../BottomMenuDialog";

export function BottomMenuSignatures() {
    return (
        <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">Ajouter une signature</h3>
                <button onClick={toggleDialog} aria-label="Fermer">
                    <VsChromeClose />
                </button>
            </div>

            <p class="text-sm text-gray-600">Choisissez comment ajouter une signature.</p>

            <div class="grid grid-cols-1 gap-3">
                <Button text="Dessiner une signature" onClick={() => { }} />
                <Button text="Importer une image" onClick={() => { }} />
            </div>
        </div>
    );
}


