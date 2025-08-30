import { createEffect, createSignal } from "solid-js";
import { SignatureData, SignatureType } from "./types";

class SignatureManager {
    private _canvasSignatureSubstitute = createSignal<HTMLCanvasElement>();
    private _canvasSignatureReplaced = createSignal<HTMLCanvasElement>();
    private _signatures = createSignal<SignatureData>();

    constructor() {
        // Draw signatures on target canvases when signatures state changes
        createEffect(() => {
            const sigs = this._signatures[0]();
            if (!sigs) return;

            if (sigs.replaced) {
                this.drawSignatureOnCanvas(this._canvasSignatureReplaced[0](), sigs.replaced);
            }

            if (sigs.substitute) {
                this.drawSignatureOnCanvas(this._canvasSignatureSubstitute[0](), sigs.substitute);
            }
        });
    }

    private drawSignatureOnCanvas = (canvas: HTMLCanvasElement | undefined, signatureData: string) => {
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = signatureData;
    };

    updateSignature = (type: SignatureType, signatureData: string) => {
        const currentSignatures = this._signatures[0]() || {};
        const newSignatures = { ...currentSignatures, [type]: signatureData };
        this._signatures[1](newSignatures);
    };

    // Getters pour les signaux
    get canvasSignatureSubstitute() {
        return this._canvasSignatureSubstitute[0];
    }

    get setCanvasSignatureSubstitute() {
        return this._canvasSignatureSubstitute[1];
    }

    get canvasSignatureReplaced() {
        return this._canvasSignatureReplaced[0];
    }

    get setCanvasSignatureReplaced() {
        return this._canvasSignatureReplaced[1];
    }

    get signatures() {
        return this._signatures[0];
    }

    get setSignatures() {
        return this._signatures[1];
    }
}

// Instance singleton
let signatureManagerInstance: SignatureManager | null = null;

// Fonction pour obtenir l'instance singleton
export function getSignatureManager(): SignatureManager {
    if (!signatureManagerInstance) {
        signatureManagerInstance = new SignatureManager();
    }
    return signatureManagerInstance;
}

// Hook pour compatibilité avec l'API existante
export function useSignatureManager() {
    const manager = getSignatureManager();

    return {
        canvasSignatureSubstitute: manager.canvasSignatureSubstitute,
        setCanvasSignatureSubstitute: manager.setCanvasSignatureSubstitute,
        canvasSignatureReplaced: manager.canvasSignatureReplaced,
        setCanvasSignatureReplaced: manager.setCanvasSignatureReplaced,
        signatures: manager.signatures,
        setSignatures: manager.setSignatures,
        updateSignature: manager.updateSignature,
    };
}
