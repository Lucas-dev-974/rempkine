export const SIGNATURE_CONFIG = {
    PEN_COLOR: "rgb(66, 133, 244)",
    CANVAS_CLASSES: {
        DISPLAY: "bg-slate-300 w-full mx-auto",
        EDITOR: "border border-slate-300 rounded-md w-[80vw] h-[40vh] mx-auto",
    },
    CONTAINER_CLASSES: {
        CANVAS: "relative group w-[80vw] sm:w-[48%]",
        BUTTON: "absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40 text-white font-medium",
    },
} as const;

export const SIGNATURE_LABELS = {
    REPLACED: "remplacé",
    SUBSTITUTE: "remplaçant",
    EDIT: "Éditer",
    CLEAR: "Effacer",
    CANCEL: "Annuler",
    SAVE: "Enregistrer",
} as const;

export const SIGNATURE_TITLES = {
    ADD_REPLACED: "Ajouter la signature du remplacé",
    ADD_SUBSTITUTE: "Ajouter la signature du remplaçant",
} as const;
