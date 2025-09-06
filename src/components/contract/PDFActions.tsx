import { NextIcon } from "../../icons/NextIcon";
import { PreviousIcon } from "../../icons/PreviousIcon";
import { createSignal } from "solid-js";
import { currentPDFTool } from "./editor/PDFEditor";

interface PDFActionsProps {
    changePage: (index: number) => void;
    currentPage: number;
    numberOfPage: number
}

export function PDFActions(props: PDFActionsProps) {
    // const [to, setTo] = createSignal("");
    // const [subject, setSubject] = createSignal("Contrat modifié");
    // const [body, setBody] = createSignal("Bonjour,\n\nVeuillez trouver ci-joint le contrat modifié.\n\nCordialement,");

    // async function handleSendMailto() {
    //     // Construire l'URL mailto en premier (certaines plateformes perdent le « user gesture » après await)
    //     const toValue = to().trim();
    //     if (!toValue) return;
    //     const encodedSubject = encodeURIComponent(subject());
    //     const hint = "\n\n(Le fichier 'modified.pdf' vient d'être enregistré sur votre appareil. Joignez-le à ce message.)";
    //     const encodedBody = encodeURIComponent(`${body()}${hint}`);
    //     const mailtoUrl = `mailto:${encodeURIComponent(toValue)}?subject=${encodedSubject}&body=${encodedBody}`;

    //     // Ouvre le client mail tout de suite pour garder le geste utilisateur
    //     window.open(mailtoUrl, "_self");

    //     // Ensuite, lance la génération/téléchargement du PDF en arrière-plan
    //     const tool = currentPDFTool?.();
    //     if (tool && tool.pdfFile) {
    //         try {
    //             void tool.downloadModifiedPdfWithStoredSignatures(tool.pdfFile);
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     }
    // }

    return <div class="flex items-center px-4 justify-between gap-4">
        <div class="flex items-center">
            <button class="h-2 w-2 rounded-full flex items-center" onClick={() => props.changePage(-1)} > <PreviousIcon /> </button>
            <p class="mx-4 text-sm"> {props.currentPage} sur {props.numberOfPage as number} </p>
            <button class="h-2 w-2 rounded-full flex items-center" onClick={() => props.changePage(+1)} > <NextIcon /> </button >
        </div>

        {/* <form class="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); handleSendMailto(); }}>
            <input
                type="email"
                required
                placeholder="destinataire@example.com"
                class="border rounded px-2 py-1 text-sm"
                value={to()}
                onInput={(e) => setTo(e.currentTarget.value)}
            />
            <input
                type="text"
                placeholder="Sujet"
                class="border rounded px-2 py-1 text-sm"
                value={subject()}
                onInput={(e) => setSubject(e.currentTarget.value)}
            />
            <input
                type="text"
                placeholder="Message"
                class="border rounded px-2 py-1 text-sm w-64"
                value={body()}
                onInput={(e) => setBody(e.currentTarget.value)}
            />
            <button type="submit" class="bg-blue-600 text-white text-sm rounded px-3 py-1">Envoyer</button>
        </form> */}
    </div>
}