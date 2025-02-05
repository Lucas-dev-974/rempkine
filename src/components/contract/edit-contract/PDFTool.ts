import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { RenderParameters } from "pdfjs-dist/types/src/display/api";
import { user1, user2, UserEntity } from "../../../models/user.entity";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "node_modules/pdfjs-dist/build/pdf.worker.mjs";

export type FormFieldsType = {
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

export class PDFTool {
  canvasID: string = "pdf-canvas";
  pdfDoc: pdfjsLib.PDFDocumentProxy | undefined;
  pdfBlob: Blob | undefined;
  url: string | undefined;
  isRendering: boolean = false;

  public pdfFile: File | undefined;
  public numPages: number | undefined;
  public currentPage: number = 1;
  public formFields: FormFieldsType[] | undefined;
  public fields: any[] | undefined;

  constructor(url: string, canvasID: string) {
    this.url = url;
    this.canvasID = canvasID;

    this.loadPdf();
  }

  async loadPdf() {
    const response = await fetch(this.url!);
    if (!response.ok) throw new Error("Erreur de chargement du PDF");

    // Convertir la réponse en ArrayBuffer puis en Uint8Array
    const arrayBuffer = await response.arrayBuffer();
    const pdfUint8Array = new Uint8Array(arrayBuffer);

    this.pdfBlob = new Blob([pdfUint8Array], { type: "application/pdf" });
    this.pdfFile = new File([this.pdfBlob], "document.pdf", {
      type: "application/pdf",
    });

    this.pdfDoc = await pdfjsLib.getDocument(pdfUint8Array).promise;
    this.numPages = this.pdfDoc.numPages;

    this.renderPage(1); // Charge la première page
    await this.getPagesFields();

    this.loadSubsituteInformations();
  }

  async getPagesFields() {
    if (!this.pdfDoc) throw new Error("PDF not loaded");

    const pages = this.pdfDoc!.numPages;
    const formFields = [];

    for (let i = 0; i != pages; i++) {
      const page = await this.pdfDoc!.getPage(i + 1);
      const dimensions = await this.getDimensions(this.pdfDoc, "pdf-canvas");
      const { pdfWidth, pdfHeight, canvasDisplayWidth } = dimensions;
      const scale = canvasDisplayWidth / pdfWidth;

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

    this.formFields = formFields;
  }

  async getDimensions(pdfDoc: any, canvasId: any) {
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

  async renderPage(pageNum: number) {
    if (this.isRendering) return;
    this.isRendering = true;

    const page = await this.pdfDoc!.getPage(pageNum);
    const canvas = document.getElementById(this.canvasID) as HTMLCanvasElement;
    const context = canvas.getContext("2d");

    // const scale = getOptimalScale(892.8, 380);
    const dimensions = await this.getDimensions(this.pdfDoc, "pdf-canvas");
    const { pdfWidth, pdfHeight, canvasDisplayWidth } = dimensions;
    const scale = (canvasDisplayWidth / pdfWidth) * 2;

    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext as RenderParameters).promise;
    this.isRendering = false;
    this.currentPage = pageNum;

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

    const formFields_ = this.formFields
      ? this.formFields.filter((form) => form.page == page.pageNumber)[0]
      : null;

    if (formFields_) this.fields = formFields_?.fields;
    else this.fields = fields;
  }

  loadSubsituteInformations() {
    const userIsM = (user: UserEntity) => {
      if (user.gender == "M") return true;
      else return false;
    };

    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    };

    this.formFields!.map((field) => {
      field.fields.forEach((field) => {
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

    this.renderPage(this.currentPage!);
  }

  handleInputChange(fieldId: any, newValue: any) {
    const onPage = this.formFields!.filter(
      (form) => form.page == this.currentPage
    )[0];
    const indexOfPage = this.formFields!.indexOf(onPage);
    this.formFields![indexOfPage].fields = onPage.fields.map((field) =>
      field.id === fieldId ? { ...field, value: newValue } : field
    );
    this.renderPage(this.currentPage);
  }

  // Fonction pour appliquer les modifications et télécharger le PDF
  async downloadModifiedPdf(pdfFile: File) {
    console.log("PDF FILE", pdfFile);

    const reader = new FileReader();

    reader.onload = async () => {
      const pdfData = new Uint8Array(reader.result as ArrayBufferLike);

      const pdfDoc_ = await PDFDocument.load(pdfData);

      // Récupère et met à jour les champs de formulaire
      const form = pdfDoc_.getForm();

      this.formFields!.forEach((page) => {
        page.fields.forEach((field) => {
          const pdfField = form.getTextField(field.name);
          if (pdfField) {
            pdfField.setText(field.value);
          }
        });
      });

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

    reader.readAsArrayBuffer(pdfFile as File);
  }
}
