import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { RenderParameters } from "pdfjs-dist/types/src/display/api";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "node_modules/pdfjs-dist/build/pdf.worker.mjs";

export enum GenderEnum {
  male = "male",
  female = "female",
}

export enum AuthorsEnum {
  student,
  professional,
  none,
}

export type OtherContractDataType = {
  replacedGender: GenderEnum;
  substituteGender: GenderEnum;

  contractAuthor: AuthorsEnum;
  authorEmail: string;
};

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
  public OCD: OtherContractDataType;

  constructor(url: string, canvasID: string) {
    this.url = url;
    this.canvasID = canvasID;

    this.loadPdf();

    this.OCD = {
      contractAuthor: AuthorsEnum.none,
      authorEmail: "",

      replacedGender: GenderEnum.male,
      substituteGender: GenderEnum.male,
    };
  }

  async loadPdf() {
    const response = await fetch(this.url!);
    if (!response.ok) throw new Error("Erreur de chargement du PDF");

    const arrayBuffer = await response.arrayBuffer();
    const pdfUint8Array = new Uint8Array(arrayBuffer);

    this.pdfBlob = new Blob([pdfUint8Array], { type: "application/pdf" });
    this.pdfFile = new File([this.pdfBlob], "document.pdf", {
      type: "application/pdf",
    });

    this.pdfDoc = await pdfjsLib.getDocument(pdfUint8Array).promise;
    this.numPages = this.pdfDoc.numPages;

    this.renderPage(1);
    await this.getPagesFields();
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

  getCurrentPageFieldsFromFormFields() {
    return this.formFields!.find((form) => form.page === this.currentPage)
      ?.fields;
  }

  handleInputChange(fieldId: any, newValue: any) {
    // console.log(fieldId);

    this.formFields = this.formFields?.map((page) => {
      return {
        ...page,
        fields: page.fields.map((field) => {
          if (field.id === fieldId) {
            return {
              ...field,
              value: newValue,
            };
          }
          return field;
        }),
      };
    });

    this.renderPage(this.currentPage);
  }

  // Fonction pour appliquer les modifications et télécharger le PDF
  async downloadModifiedPdf(pdfFile: File) {
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

  getFieldValue(field: string): string {
    let value = "";

    this.formFields?.forEach((fields) => {
      fields.fields.forEach((_field) => {
        if (_field.id == field) {
          value = _field.value;
        }
      });
    });

    return value;
  }

  getReplacedFields(gender?: GenderEnum) {
    return {
      name:
        gender === GenderEnum.male
          ? ["94R", "117R", "125R", "119R", "121R"]
          : ["98R", "116R", "114R", "124R", "120R"],
      birthday: "96R",
      birthdayLocation: "95R",
      orderDepartement: "93R",
      orderDepartmentNumber: "97R",
      professionnalAddress: "104R",
      email: "100R",
    };
  }

  getSubstituteFields(gender?: GenderEnum) {
    return {
      name:
        gender === GenderEnum.male
          ? ["99R", "118R", "127R"]
          : ["105R", "115R", "126R"],
      birthday: "102R",
      birthdayLoction: "103R",
      orderDepartement: "109R",
      orderDepartmentNumber: "108R",
      address: "112R",
      email: "111R",
    };
  }

  getContractInformationFields() {
    return {
      startDate: "122R",
      enDate: "123R",
      percentReversedToSubstitute: "130R",
      reversedBefore: "131R",
      NonInstallationRadius: "134R",
      conciliationCDOMK: "137R",
      doneAtLocation: "139R",
      doneAt: "138R",
    };
  }

  updateOCD(ocd: Partial<OtherContractDataType>) {
    this.OCD = {
      ...this.OCD,
      ...ocd,
    };
  }
}
