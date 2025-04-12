import { PDFDocument, values } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { RenderParameters } from "pdfjs-dist/types/src/display/api";
import { ContractEntity } from "../../../models/contract.entity";
import { contractService } from "../../../services/contract.service";
import {
  canvasSignatureReplaced,
  canvasSubstituted,
  HandlerInputChangePDFEditor,
} from "./PDFEditor";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "node_modules/pdfjs-dist/build/pdf.worker.mjs";

export enum GenderEnum {
  male = "male",
  female = "female",
}

export enum AuthorsEnum {
  student = "student",
  professional = "professionnal",
}

export type OtherContractDataType = {
  replacedGender: GenderEnum;
  substituteGender: GenderEnum;

  authorName: string;
  authorEmail: string;
  authorStatus: AuthorsEnum;
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

  public contractData: Partial<ContractEntity>;

  constructor(url: string, canvasID: string) {
    this.url = url;
    this.canvasID = canvasID;

    this.loadPdf();

    this.OCD = {
      authorStatus: AuthorsEnum.professional,
      authorName: "",
      authorEmail: "",

      replacedGender: GenderEnum.male,
      substituteGender: GenderEnum.male,
    };

    this.contractData = {};
  }

  public setContractDataToPDFFields(contract: Partial<ContractEntity>) {
    const replacedFields = this.getReplacedFields(contract.replacedGender);
    const substituteFields = this.getSubstituteFields(
      contract.substituteGender
    );
    const contractInformationFields = this.getContractInformationFields();

    const contractFieldsLink = {
      startDate: {
        field: contractInformationFields.startDate,
        value: contract.startDate,
      },
      endDate: {
        field: contractInformationFields.endDate,
        value: contract.endDate,
      },
      percentReturnToSubstitute: {
        field: contractInformationFields.percentReversedToSubstitute,
        value: contract.percentReturnToSubstitute,
      },
      percentReturnToSubstituteBeforeDate: {
        field: contractInformationFields.reversedBefore,
        value: contract.percentReturnToSubstituteBeforeDate,
      },
      nonInstallationRadius: {
        field: contractInformationFields.NonInstallationRadius,
        value: contract.nonInstallationRadius,
      },
      conciliationCDOMK: {
        field: contractInformationFields.conciliationCDOMK,
        value: contract.conciliationCDOMK,
      },
      doneAtLocation: {
        field: contractInformationFields.doneAtLocation,
        value: contract.doneAtLocation,
      },
      doneAtDate: {
        field: contractInformationFields.doneAt,
        value: contract.doneAtDate,
      },

      replacedEmail: {
        field: replacedFields.email,
        value: contract.replacedEmail,
      },

      replacedName: {
        field: replacedFields.name,
        value: contract.replacedName,
      },

      replacedBirthday: {
        field: replacedFields.birthday,
        value: contract.replacedBirthday,
      },

      replacedBirthdayLocation: {
        field: replacedFields.birthdayLocation,
        value: contract.replacedBirthdayLocation,
      },

      replacedOrderDepartement: {
        field: replacedFields.orderDepartement,
        value: contract.replacedOrderDepartement,
      },
      replacedOrderDepartmentNumber: {
        field: replacedFields.orderDepartmentNumber,
        value: contract.replacedOrderDepartmentNumber,
      },
      replacedProfessionnalAddress: {
        field: replacedFields.professionnalAddress,
        value: contract.replacedProfessionnalAddress,
      },

      substituteEmail: {
        field: substituteFields.email,
        value: contract.substituteEmail,
      },

      substituteName: {
        field: substituteFields.name,
        value: contract.substituteName,
      },
      substituteBirthday: {
        field: substituteFields.birthday,
        value: contract.substituteBirthday,
      },
      substituteBirthdayLocation: {
        field: substituteFields.birthdayLoction,
        value: contract.substituteBirthdayLocation,
      },
      substituteOrderDepartement: {
        field: substituteFields.orderDepartement,
        value: contract.substituteOrderDepartement,
      },
      substituteOrderDepartmentNumber: {
        field: substituteFields.orderDepartmentNumber,
        value: contract.substituteOrderDepartmentNumber,
      },
    };

    Object.keys(contractFieldsLink).forEach((key) => {
      const field =
        contractFieldsLink[key as keyof typeof contractFieldsLink].field;
      const value =
        contractFieldsLink[key as keyof typeof contractFieldsLink].value;
      HandlerInputChangePDFEditor(field, value as string);
      if (Array.isArray(field)) {
        field.forEach((field) => this.handleInputChange(field, value));
      } else {
        this.handleInputChange(field, value);
      }
    });
  }

  getContractData() {
    const contract: Omit<ContractEntity, "id"> = {
      authorName: this.OCD.authorName,
      authorEmail: this.OCD.authorEmail,
      authorStatut: this.OCD.authorStatus,

      startDate: this.getFieldValue("122R"),
      endDate: this.getFieldValue("123R"),
      percentReturnToSubstitute: +this.getFieldValue("130R"),
      percentReturnToSubstituteBeforeDate: new Date(this.getFieldValue("131R")),
      nonInstallationRadius: +this.getFieldValue("134R"),
      conciliationCDOMK: this.getFieldValue("137R"),
      doneAtLocation: this.getFieldValue("139R"),
      doneAtDate: new Date(this.getFieldValue("138R")),

      replacedGender: this.OCD.replacedGender,
      replacedEmail: this.getFieldValue("100R"),
      replacedName: this.getFieldValue("94R") || this.getFieldValue("98R"),
      replacedBirthday: new Date(this.getFieldValue("96R")),
      replacedBirthdayLocation: this.getFieldValue("95R"),
      replacedOrderDepartement: this.getFieldValue("93R"),
      replacedOrderDepartmentNumber: +this.getFieldValue("97R"),
      replacedProfessionnalAddress: this.getFieldValue("104R"),

      substituteGender: this.OCD.substituteGender,
      substituteEmail: this.getFieldValue("100R"),
      substituteName: this.getFieldValue("99R") || this.getFieldValue("105R"),
      substituteBirthday: new Date(this.getFieldValue("102R")),
      substituteBirthdayLocation: this.getFieldValue("103R"),
      substituteOrderDepartement: this.getFieldValue("109R"),
      substituteOrderDepartmentNumber: +this.getFieldValue("108R"),

      replacedSignatureDataUrl: canvasSignatureReplaced()
        ? canvasSignatureReplaced()!.toDataURL("image/png")
        : "",

      substituteSignatureDataUrl: canvasSubstituted()
        ? canvasSubstituted()!.toDataURL("image/png")
        : "",
    };
    return contract;
  }

  isValidContract(contract: Partial<ContractEntity>) {
    if (!contract.authorEmail) return false;
    if (!contract.authorName) return false;
    if (!contract.startDate) return false;
    if (!contract.endDate) return false;
    if (!contract.percentReturnToSubstitute) return false;
    if (!contract.percentReturnToSubstituteBeforeDate) return false;
    if (!contract.nonInstallationRadius) return false;
    if (!contract.conciliationCDOMK) return false;
    if (!contract.doneAtLocation) return false;
    if (!contract.doneAtDate) return false;
    if (!contract.replacedEmail) return false;
    if (!contract.replacedName) return false;
    if (!contract.replacedBirthday) return false;
    if (!contract.replacedBirthdayLocation) return false;
    if (!contract.replacedOrderDepartement) return false;
    if (!contract.replacedOrderDepartmentNumber) return false;
    if (!contract.replacedProfessionnalAddress) return false;
    if (!contract.substituteEmail) return false;
    if (!contract.substituteName) return false;
    if (!contract.substituteBirthday) return false;
    if (!contract.substituteBirthdayLocation) return false;
    if (!contract.substituteOrderDepartement) return false;
    if (!contract.substituteOrderDepartmentNumber) return false;
    return true;
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

      // Récupérer la page où les canvases doivent être ajoutés (par exemple, page 6)
      const page = pdfDoc_.getPage(5); // Les pages sont indexées à partir de 0

      if (canvasSignatureReplaced() && canvasSubstituted()) {
        // Convertir les canvases en images
        const canvas1Image = canvasSignatureReplaced()!.toDataURL("image/png");
        const canvas2Image = canvasSubstituted()!.toDataURL("image/png");

        // Intégrer les images dans le PDF
        const canvas1ImageBytes = await fetch(canvas1Image).then((res) =>
          res.arrayBuffer()
        );
        const canvas2ImageBytes = await fetch(canvas2Image).then((res) =>
          res.arrayBuffer()
        );

        const canvas1ImageEmbed = await pdfDoc_.embedPng(canvas1ImageBytes);
        const canvas2ImageEmbed = await pdfDoc_.embedPng(canvas2ImageBytes);

        // Obtenir les dimensions de la page
        const { width, height } = page.getSize();

        // Dessiner les images sur la page
        page.drawImage(canvas1ImageEmbed, {
          x: width * 0.05, // 5% du côté gauche
          y: height * 0.12, // 15% du bas
          width: width * 0.4, // 40% de la largeur de la page
          height: height * 0.2, // 20% de la hauteur de la page
        });

        page.drawImage(canvas2ImageEmbed, {
          x: width * 0.55, // 55% du côté gauche
          y: height * 0.12, // 15% du bas
          width: width * 0.4, // 40% de la largeur de la page
          height: height * 0.2, // 20% de la hauteur de la page
        });
      }

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
      endDate: "123R",
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
