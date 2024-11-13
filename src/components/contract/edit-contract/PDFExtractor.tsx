import * as pdfjsLib from "pdfjs-dist";
import { createEffect, createSignal, on, onMount } from "solid-js";
import "pdfjs-dist/web/pdf_viewer.css";
import { RenderParameters } from "pdfjs-dist/types/src/display/api";
import { PDFDocument } from "pdf-lib";
import { user1, user2, UserEntity } from "../../../models/user.entity";

import "./PDFExtractor.css";
import { Button } from "../../buttons/Button";
import { PreviousIcon } from "../../../icons/PreviousIcon";
import { NextIcon } from "../../../icons/NextIcon";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "node_modules/pdfjs-dist/build/pdf.worker.mjs";

type FormFieldsType = {
  page: number;
  fields: {
    id: string;
    type: string;
    name: string;
    value: string;
    rect: string;
    width: number;
    height: number;
    top: number;
    left: number;
  }[];
};

function PDFViewer() {
  const [pdfFile, setPdfFile] = createSignal();
  const [pdfDoc, setPdfDoc] = createSignal<pdfjsLib.PDFDocumentProxy>();
  const [currentPage, setCurrentPage] = createSignal(1);
  const [numPages, setNumPages] = createSignal();
  const [formFields, setFormFields] = createSignal<FormFieldsType[]>([]);
  const [fields, setFields] = createSignal<any[]>([]);

  const PDFurl =
    "http://192.168.1.57:3000/src/assets/contrat-type-de-remplacement-liberal-28-03-2023-.pdf";

  onMount(async () => await loadPdf());

  async function getPagesFields() {
    const pages = pdfDoc()?.numPages;
    const formFields = [];

    for (let i = 0; i != pages; i++) {
      const page = await pdfDoc()!.getPage(i + 1);
      const dimensions = await getDimensions(pdfDoc(), "pdf-canvas");
      const { pdfWidth, pdfHeight, canvasDisplayWidth } = dimensions;
      const scale = canvasDisplayWidth / pdfWidth;

      console.log("scale :", scale);

      const viewport = page.getViewport({ scale });

      const annotations = await page.getAnnotations();

      const fields = annotations
        .filter((annotation) => annotation.subtype === "Widget")
        .map((annotation) => ({
          id: annotation.id as string,
          type: annotation.fieldType as string,
          name: annotation.fieldName as string,
          value: annotation.fieldValue || ("" as string),
          rect: annotation.rect,
          width: ((annotation.rect[2] - annotation.rect[0]) * scale) as number,
          height: ((annotation.rect[3] - annotation.rect[1]) * scale) as number,
          top: (viewport.height - annotation.rect[3] * scale) as number,
          left: (annotation.rect[0] * scale) as number,
        }));

      formFields.push({ page: i + 1, fields: fields });
    }

    setFormFields(formFields);
    console.log(formFields);
  }

  // Fonction pour charger le PDF et initialiser le document
  const loadPdf = async () => {
    const response = await fetch(PDFurl);
    if (!response.ok) throw new Error("Erreur de chargement du PDF");

    // Convertir la réponse en ArrayBuffer puis en Uint8Array
    const arrayBuffer = await response.arrayBuffer();
    const pdfUint8Array = new Uint8Array(arrayBuffer);

    const pdfBlob = new Blob([pdfUint8Array], { type: "application/pdf" });
    const pdfFile = new File([pdfBlob], "document.pdf", {
      type: "application/pdf",
    });
    setPdfFile(pdfFile);

    const loadedPdf = await pdfjsLib.getDocument(pdfUint8Array).promise;

    setPdfDoc(loadedPdf);
    setNumPages(loadedPdf.numPages);
    renderPage(1); // Charge la première page

    await getPagesFields();
    loadSubsituteInformations();
  };

  async function getDimensions(pdfDoc: any, canvasId: any) {
    // Récupère la première page du PDF pour obtenir la taille d'origine
    const page = await pdfDoc.getPage(1);
    const viewport = page.getViewport({ scale: 1 }); // Pas d'échelle pour obtenir la taille réelle

    const pdfWidth = viewport.width;
    const pdfHeight = viewport.height;

    // Récupère les dimensions du canvas en affichage (style CSS appliqué)
    const canvas = document.getElementById(canvasId);
    const canvasDisplayWidth = canvas!.clientWidth;
    const canvasDisplayHeight = canvas!.clientHeight;

    return {
      pdfWidth,
      pdfHeight,
      canvasDisplayWidth,
      canvasDisplayHeight,
    };
  }
  // Fonction pour afficher une page
  const renderPage = async (pageNum: number) => {
    const page = await pdfDoc()!.getPage(pageNum);
    const canvas = document.getElementById("pdf-canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");

    // const scale = getOptimalScale(892.8, 380);
    const dimensions = await getDimensions(pdfDoc(), "pdf-canvas");
    const { pdfWidth, pdfHeight, canvasDisplayWidth } = dimensions;
    const scale = (canvasDisplayWidth / pdfWidth) * 2;
    console.log("scale :", scale);

    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext as RenderParameters).promise;
    setCurrentPage(pageNum);

    // Récupérer les annotations (champs de formulaire)
    const annotations = await page.getAnnotations();
    const fields = annotations
      .filter((annotation) => annotation.subtype === "Widget")
      .map((annotation) => ({
        id: annotation.id,
        type: annotation.fieldType,
        name: annotation.fieldName,
        value: annotation.fieldValue || "",
        rect: annotation.rect,
        width: (annotation.rect[2] - annotation.rect[0]) * scale,
        height: (annotation.rect[3] - annotation.rect[1]) * scale,

        top: viewport.height - annotation.rect[3] * scale,
        left: annotation.rect[0] * scale,
      }));

    const formFields_ = formFields()
      ? formFields().filter((form) => form.page == page.pageNumber)[0]
      : null;

    console.log("check:", formFields_);

    if (formFields_) setFields(formFields_.fields);
    else setFields(fields);
  };

  const handleInputChange = (fieldId: any, newValue: any) => {
    setFormFields((formFields) => {
      if (!formFields) return formFields;
      const onPage = formFields.filter((form) => form.page == currentPage())[0];
      const indexOfPage = formFields.indexOf(onPage);
      formFields[indexOfPage].fields = onPage.fields.map((field) =>
        field.id === fieldId ? { ...field, value: newValue } : field
      );
      return formFields;
    });
  };

  // Fonction pour appliquer les modifications et télécharger le PDF
  const downloadModifiedPdf = async () => {
    const reader = new FileReader();
    reader.onload = async () => {
      const pdfData = new Uint8Array(reader.result as ArrayBufferLike);

      const pdfDoc_ = await PDFDocument.load(pdfData);

      // Récupère et met à jour les champs de formulaire
      const form = pdfDoc_.getForm();

      formFields().forEach((page) => {
        page.fields.forEach((field) => {
          const pdfField = form.getTextField(field.name);
          if (pdfField) {
            pdfField.setText(field.value);
          }
        });
      });
      // formFields()!.fields.forEach((field) => {
      //   const pdfField = form.getTextField(field.name);
      //   if (pdfField) {
      //     pdfField.setText(field.value);
      //   }
      // });

      // Génère les données du PDF modifié
      const modifiedPdfBytes = await pdfDoc_.save();

      // Crée un lien de téléchargement
      const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = "modified.pdf";
      a.click();

      URL.revokeObjectURL(url);
    };
    reader.readAsArrayBuffer(pdfFile() as File);
  };

  function loadSubsituteInformations() {
    console.log("load substitute informations");
    const userIsM = (user: UserEntity) => {
      if (user.gender == "M") return true;
      else return false;
    };

    setFormFields((forms) => {
      if (!forms) return forms;
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      };

      forms.map((form) => {
        form.fields.forEach((field) => {
          switch (field.id) {
            case "98R":
              field.value = userIsM(user1)
                ? ""
                : user1.name + " " + user1.lastName;
              break;

            case "94R":
              field.value = userIsM(user1)
                ? user1.name + " " + user1.lastName
                : "";
              break;

            case "96R":
              const formattedDate = new Intl.DateTimeFormat(
                "fr-FR",
                options
              ).format(user1.birthday);
              field.value = formattedDate;
              break;

            case "95R":
              field.value = user1.bornLocation;
              break;

            case "93R":
              field.value = user1.department;
              break;

            case "97R":
              field.value = user1.odreNumber.toString();
              break;

            case "104R":
              field.value = user1.address;
              break;

            case "100R":
              field.value = user1.email;
              break;

            case "105R":
              field.value = userIsM(user2)
                ? ""
                : user2.name + " " + user2.lastName;
              break;

            case "99R":
              field.value = userIsM(user2)
                ? user2.name + " " + user2.lastName
                : "";
              break;

            case "102R":
              const formattedDate_ = new Intl.DateTimeFormat(
                "fr-FR",
                options
              ).format(user2.birthday);
              field.value = formattedDate_;
              break;

            case "103R":
              field.value = user2.bornLocation;
              break;

            case "109R":
              field.value = user2.department;
              break;

            case "108R":
              field.value = user2.odreNumber.toString();
              break;

            case "112R":
              field.value = user2.address;
              break;

            case "111R":
              field.value = user2.email;
              break;
            // ------- PAGE 3 --------------
            case "116R":
              field.value = userIsM(user1)
                ? ""
                : user1.name + " " + user1.lastName;
              break;

            case "117R":
              field.value = userIsM(user1)
                ? user1.name + " " + user1.lastName
                : "";
              break;

            case "115R":
              field.value = userIsM(user2)
                ? ""
                : user2.name + " " + user2.lastName;
              break;

            case "118R":
              field.value = userIsM(user2)
                ? user2.name + " " + user2.lastName
                : "";
              break;

            case "114R":
              field.value = userIsM(user1)
                ? ""
                : user1.name + " " + user1.lastName;
              break;

            case "125R":
              field.value = userIsM(user1)
                ? user1.name + " " + user1.lastName
                : "";
              break;

            case "124R":
              field.value = userIsM(user1)
                ? ""
                : user1.name + " " + user1.lastName;
              break;

            case "119R":
              field.value = userIsM(user1)
                ? user1.name + " " + user1.lastName
                : "";
              break;

            case "126R":
              field.value = userIsM(user2)
                ? ""
                : user2.name + " " + user2.lastName;
              break;

            case "127R":
              field.value = userIsM(user2)
                ? user2.name + " " + user2.lastName
                : "";
              break;

            case "120R":
              field.value = userIsM(user1)
                ? ""
                : user1.name + " " + user1.lastName;
              break;

            case "121R":
              field.value = userIsM(user1)
                ? user1.name + " " + user1.lastName
                : "";
              break;

            case "138R":
              field.value = new Intl.DateTimeFormat("fr-FR", options).format(
                user1.birthday
              );
              break;
          }
        });
      });
      return forms;
    });
    console.log(formFields());
  }

  return (
    <div>
      <div class="flex gap-2 my-4 justify-between">
        <Button
          onClick={downloadModifiedPdf}
          text="Télécharger le PDF modifié"
        />
        <div class="flex items-center">
          <button
            class="h-3 w-3 rounded-full flex items-center"
            onClick={() => renderPage(currentPage() - 1)}
          >
            <PreviousIcon />
          </button>
          <p class="mx-4">
            Page {currentPage()} sur {numPages() as number}
          </p>
          <button
            class="h-3 w-3 rounded-full flex items-center"
            onClick={() => renderPage(currentPage() + 1)}
          >
            <NextIcon />
          </button>
        </div>
      </div>

      <div style="position: relative;">
        <canvas id="pdf-canvas"></canvas>
        {fields().map((field) => (
          <input
            type="text"
            value={field.value}
            onInput={(e) => handleInputChange(field.id, e.target.value)}
            style={{
              position: "absolute",
              left: `${field.left}px`,
              top: `${field.top}px`,
              width: `${field.width}px`,
              height: `${field.height}px`,
              "font-size": "16px",
              padding: "2px",
              border: "1px solid #ccc",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default PDFViewer;
