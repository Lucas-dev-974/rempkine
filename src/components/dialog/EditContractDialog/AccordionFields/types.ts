export type SignatureType = "replaced" | "substitute";

export interface SignatureData {
    replaced?: string;
    substitute?: string;
}

export interface SignatureCanvasProps {
    type: SignatureType;
    onEdit: (type: SignatureType) => void;
    canvasRef: (canvas: HTMLCanvasElement) => void;
}

export interface SignatureEditorProps {
    open: boolean;
    onClose: () => void;
    selectedType: SignatureType;
    onSave: (signatureData: string) => void;
    existingSignature?: string;
}
