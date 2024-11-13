import Quill from "quill";
import jsPDF from "jspdf";

import "quill/dist/quill.snow.css";
import { createSignal, onMount } from "solid-js";

interface EditContractProps {
  contractModel?: any;
}

const [contractTemplate, setContractTemplate] = createSignal<string>();

export function EditContract() {
  let editorContainer: HTMLDivElement | undefined;
  const [content, setContent] = createSignal<string>("");

  onMount(() => {
    // Initialisation de l'éditeur Quill
    if (editorContainer) {
      const quill = new Quill(editorContainer, {
        theme: "snow",
        placeholder: "Écrivez quelque chose ici...",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            [{ align: [] }],
          ],
        },
      });

      if (contractTemplate())
        quill.root.innerHTML = contractTemplate() as string;

      // Mettre à jour le signal `content` lorsque le contenu change
      quill.on("text-change", () => {
        setContent(quill.root.innerHTML); // Stocke le contenu HTML actuel
      });
    }
  });

  // Fonction pour générer un PDF à partir du contenu HTML
  function generatePDF() {
    const pdf = new jsPDF("p", "pt", "a4");
    pdf.html(document.getElementById("html-render") as HTMLElement, {
      callback: function (pdf) {
        pdf.save("document.pdf");
      },
      x: 10,
      y: 10,
    });
  }

  function saveAsContractModel() {
    localStorage.setItem("contract-templates", JSON.stringify([content()]));
  }

  return (
    <div>
      {/* Conteneur pour l'éditeur Quill */}
      <div
        ref={editorContainer}
        style={{
          "min-height": "200px",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      ></div>

      {/* Affichage du contenu HTML */}
      <h3>Rendu HTML :</h3>
      <div
        id="html-render"
        style={{
          "white-space": "pre-wrap",
          "border-radius": "5px",
        }}
        innerHTML={content()}
      ></div>

      {/* Bouton pour générer le PDF */}
      <button onClick={generatePDF} style={{ "margin-top": "10px" }}>
        Télécharger en PDF
      </button>

      <button onClick={saveAsContractModel} style={{ "margin-top": "10px" }}>
        Save as contract model
      </button>
    </div>
  );
}
