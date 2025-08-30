import { PDFDocument, values } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { RenderParameters } from "pdfjs-dist/types/src/display/api";
import { ContractEntity } from "../../../models/contract.entity";
import { loadContract } from "../../../const.data";
import { Accessor } from "solid-js";

pdfjsLib.GlobalWorkerOptions.workerSrc = location.origin + "/assets/pdf.worker.mjs";

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

export type PDFFields = {
  id: string;
  type: string;
  name: string;
  value: string;
  rect: number[];
  width: number;
  height: number;
  top: number;
  left: number;
}

export type PDFFieldsOfPages = {
  page: number;
  fields: PDFFields[]
}

export class PDFTool {
  canvasID: string = "pdf-canvas";
  pdfDoc: pdfjsLib.PDFDocumentProxy | undefined;
  pdfBlob: Blob | undefined;
  url: string | undefined;
  isRendering: boolean = false;


  public pdfFile: File | undefined;
  public numPages: number | undefined;
  public currentPage: number = 1;

  public PDFInputsFieldsMetadata: PDFFieldsOfPages[];
  public contractData: Partial<ContractEntity>;

  private canvasElement?: HTMLCanvasElement

  constructor(url: string, canvasID: string) {
    this.PDFInputsFieldsMetadata = []
    this.contractData = {};
    this.canvasID = canvasID;
    this.url = url;
  }

  async initialize(render = true) {
    await this.loadPdf();

    if (loadContract()) {
      this.setContractDataToPDFInputsFields(loadContract() as ContractEntity);
    } else {
      this.contractData.replacedGender = GenderEnum.male
      this.contractData.substituteGender = GenderEnum.male
    }
  }

  getContractFieldNameFromInputPDFID(id: string): keyof ContractEntity | undefined {
    switch (id) {
      case "122R":
        return "startDate";
      case "123R":
        return "endDate";
      case "130R":
        return "percentReturnToSubstitute";
      case "131R":
        return "percentReturnToSubstituteBeforeDate";
      case "134R":
        return "nonInstallationRadius";
      case "137R":
        return "conciliationCDOMK";
      case "139R":
        return "doneAtLocation";
      case "138R":
        return "doneAtDate";

      case "100R":
        return "replacedEmail";
      case "94R":
      case "117R":
      case "125R":
      case "119R":
      case "121R":
        return "replacedName";
      case "96R":
        return "replacedBirthday";
      case "95R":
        return "replacedBirthdayLocation";
      case "93R":
        return "replacedOrderDepartement";
      case "97R":
        return "replacedOrderDepartmentNumber";
      case "104R":
        return "replacedProfessionnalAddress";

      case "111R":
        return "substituteEmail";

      case "99R":
      case "118R":
      case "127R":
      case "105R":
      case "115R":
      case "126R":
        return "substituteName";

      case "102R":
        return "substituteBirthday";
      case "103R":
        return "substituteBirthdayLocation";
      case "109R":
        return "substituteOrderDepartement";
      case "108R":
        return "substituteOrderDepartmentNumber";
      case "112R":
        return "substituteAdress";

      default:
        return undefined;
    }
  }

  public setContractDataToPDFInputsFields(contract: Partial<ContractEntity>) {
    this.contractData = contract

    const replacedFields = this.getReplacedFieldsIds(contract.replacedGender);
    const substituteFields = this.getSubstituteFieldsIds(contract.substituteGender);
    const contractInformationFields = this.getContractInformationFieldsIds();

    const contractPDFIdsAndTheyValues = {
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
        field: substituteFields.birthdayLocation,
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
      substituteAdress: {
        field: substituteFields.address,
        value: contract.substituteAdress
      }
    };

    // Upodate canvas inputs with contract datas  
    Object.keys(contractPDFIdsAndTheyValues).forEach((key) => {
      const field = contractPDFIdsAndTheyValues[key as keyof typeof contractPDFIdsAndTheyValues].field;
      const value = contractPDFIdsAndTheyValues[key as keyof typeof contractPDFIdsAndTheyValues].value;

      if (Array.isArray(field)) {
        field.forEach((field) => this.updateContractDataAndPDFFields(field, value));
      } else {
        this.updateContractDataAndPDFFields(field, value);
      }
    });
  }

  isValidContract(contract: Partial<ContractEntity>) {
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
    this.pdfFile = new File([this.pdfBlob], "document.pdf", { type: "application/pdf" });

    this.pdfDoc = await pdfjsLib.getDocument(pdfUint8Array).promise;
    this.numPages = this.pdfDoc.numPages;

    await this.getPagesFields();
  }

  async getPagesFields() {
    if (!this.pdfDoc) throw new Error("PDF not loaded");

    const pages = this.pdfDoc!.numPages;
    const formFields = [];

    for (let i = 0; i != pages; i++) {
      const page = await this.pdfDoc!.getPage(i + 1);
      const dimensions = await this.getDimensions(this.pdfDoc, "pdf-canvas");
      if (dimensions) {
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
    }

    this.PDFInputsFieldsMetadata = [...this.PDFInputsFieldsMetadata, ...formFields];
  }

  async getDimensions(pdfDoc: any, canvasId: any) {
    // Récupère la première page du PDF pour obtenir la taille d'origine
    const page = await pdfDoc.getPage(1);
    const viewport = page.getViewport({ scale: 1 }); // Pas d'échelle pour obtenir la taille réelle

    const pdfWidth = viewport.width;
    const pdfHeight = viewport.height;

    // Récupère les dimensions du canvas en affichage (style CSS appliqué)
    const canvas = document.getElementById(canvasId);
    if (canvas) {
      const canvasDisplayWidth = canvas!.clientWidth;
      const canvasDisplayHeight = canvas!.clientHeight;
      const data = {
        pdfWidth,
        pdfHeight,
        canvasDisplayWidth,
        canvasDisplayHeight,
      }

      return data
    }
    return null
  }

  async renderPage(pageNum: number, canvasElement?: HTMLCanvasElement) {

    if (this.isRendering) return;
    this.isRendering = true;

    if (!this.canvasElement && canvasElement) {
      this.canvasElement = canvasElement
    }

    if (!this.canvasElement && !canvasElement) {
      throw new Error("Impossible de traité le rendue")
    }

    const page = await this.pdfDoc!.getPage(pageNum);
    const context = this.canvasElement!.getContext("2d");
    const dimensions = await this.getDimensions(this.pdfDoc, "pdf-canvas");

    if (dimensions) {
      const { pdfWidth, pdfHeight, canvasDisplayWidth } = dimensions;
      const scale = (canvasDisplayWidth / pdfWidth) * 2;

      const viewport = page.getViewport({ scale });
      if (this.canvasElement) {
        this.canvasElement.height = viewport.height;
        this.canvasElement.width = viewport.width;
      }

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext as RenderParameters).promise;
      this.isRendering = false;
      this.currentPage = pageNum;
    }
  }

  getCurrentPageFieldsFromFormFields() {
    return this.PDFInputsFieldsMetadata!.find((form) => form.page === this.currentPage)?.fields;
  }

  updateContractDataAndPDFFields(fieldId: any, newValue: any, updateContractData: boolean = true) {
    const key = this.getContractFieldNameFromInputPDFID(fieldId);
    if (updateContractData && key) {
      this.contractData = { ...this.contractData, [key]: newValue } as Partial<ContractEntity>;
    }

    this.PDFInputsFieldsMetadata = this.PDFInputsFieldsMetadata.map((page) => {
      return {
        ...page, fields: page.fields.map((field) => {
          if (field.id === fieldId) {
            return { ...field, value: newValue, };
          }
          return field;
        }),
      };
    });
  }

  async downloadModifiedPdf(pdfFile: File, signatures: Accessor<{ replaced?: string; substitute?: string } | undefined>) {
    const reader = new FileReader();
    reader.onload = async () => {
      const pdfData = new Uint8Array(reader.result as ArrayBufferLike);

      const pdfDoc_ = await PDFDocument.load(pdfData);

      // Récupérer la dernière page du PDF (page 6)
      const lastPageIndex = pdfDoc_.getPageCount() - 1;
      const page = pdfDoc_.getPage(lastPageIndex);

      const signatureData = signatures();
      const replacedSignatureDataUrl = signatureData?.replaced;
      const substituteSignatureDataUrl = signatureData?.substitute;

      console.log("Signatures DataURL récupérées:", {
        replaced: replacedSignatureDataUrl ? "disponible" : "non disponible",
        substitute: substituteSignatureDataUrl ? "disponible" : "non disponible"
      });

      if (replacedSignatureDataUrl && substituteSignatureDataUrl) {
        try {
          // Intégrer les images dans le PDF directement depuis les DataURL
          const canvas1ImageBytes = await fetch(replacedSignatureDataUrl).then((res) =>
            res.arrayBuffer()
          );
          const canvas2ImageBytes = await fetch(substituteSignatureDataUrl).then((res) =>
            res.arrayBuffer()
          );

          const canvas1ImageEmbed = await pdfDoc_.embedPng(canvas1ImageBytes);
          const canvas2ImageEmbed = await pdfDoc_.embedPng(canvas2ImageBytes);

          // Obtenir les dimensions de la page
          const { width, height } = page.getSize();

          console.log("Dimensions de la page:", { width, height });

          // Dessiner les images sur la page avec des dimensions ajustées
          page.drawImage(canvas1ImageEmbed, {
            x: width * 0.05, // 5% du côté gauche
            y: height * 0.15, // 15% du bas
            width: width * 0.35, // 35% de la largeur de la page
            height: height * 0.15, // 15% de la hauteur de la page
          });

          page.drawImage(canvas2ImageEmbed, {
            x: width * 0.6, // 60% du côté gauche
            y: height * 0.15, // 15% du bas
            width: width * 0.35, // 35% de la largeur de la page
            height: height * 0.15, // 15% de la hauteur de la page
          });

          console.log("Signatures ajoutées au PDF depuis les DataURL");
        } catch (error) {
          console.error("Erreur lors de l'ajout des signatures:", error);
        }
      } else {
        console.warn("Signatures DataURL non disponibles:", { replacedSignatureDataUrl, substituteSignatureDataUrl });
      }

      // Récupère et met à jour les champs de formulaire
      const form = pdfDoc_.getForm();

      this.PDFInputsFieldsMetadata!.forEach((page) => {
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

    this.PDFInputsFieldsMetadata?.forEach((fields) => {
      fields.fields.forEach((_field) => {
        if (_field.id == field) {
          value = _field.value;
        }
      });
    });

    return value;
  }

  getReplacedFieldsIds(gender?: GenderEnum) {
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

  getSubstituteFieldsIds(gender?: GenderEnum) {
    return {
      name:
        gender === GenderEnum.male
          ? ["99R", "118R", "127R"]
          : ["105R", "115R", "126R"],
      birthday: "102R",
      birthdayLocation: "103R",
      orderDepartement: "109R",
      orderDepartmentNumber: "108R",
      address: "112R",
      email: "111R",
    };
  }

  getContractInformationFieldsIds() {
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


  resetContractData() {
    this.contractData = {
      id: "",
      conciliationCDOMK: "",
      doneAtDate: "",
      doneAtLocation: "",
      endDate: "",
      nonInstallationRadius: 0,
      percentReturnToSubstitute: 0,
      percentReturnToSubstituteBeforeDate: "",
      replacedBirthday: "",
      replacedBirthdayLocation: "",
      replacedEmail: "",
      replacedGender: GenderEnum.male,
      replacedName: "",
      replacedOrderDepartement: "",
      replacedOrderDepartmentNumber: 0,
      replacedProfessionnalAddress: "",
      replacedSignatureDataUrl: "",
      startDate: "",
      substituteAdress: "",
      substituteBirthday: "",
      substituteBirthdayLocation: "",
      substituteEmail: "",
      substituteGender: GenderEnum.male,
      substituteName: "",
      substituteOrderDepartement: "",
      substituteOrderDepartmentNumber: 0
    }
  }

  updateSignaturesInContract(
    signatures: Accessor<{ replaced?: string; substitute?: string } | undefined>
  ) {
    const signatureData = signatures();

    console.log("Mise à jour des signatures dans le contrat:", {
      hasReplaced: !!signatureData?.replaced,
      hasSubstitute: !!signatureData?.substitute,
      replacedLength: signatureData?.replaced?.length || 0,
      substituteLength: signatureData?.substitute?.length || 0
    });

    if (signatureData?.replaced) {
      this.contractData.replacedSignatureDataUrl = signatureData.replaced;
      console.log("Signature remplacé mise à jour:", signatureData.replaced.substring(0, 50) + "...");
    }

    if (signatureData?.substitute) {
      this.contractData.substituteSignatureDataUrl = signatureData.substitute;
      console.log("Signature remplaçant mise à jour:", signatureData.substitute.substring(0, 50) + "...");
    }

    // Vérification après mise à jour
    console.log("État du contrat après mise à jour:", {
      replacedInContract: !!this.contractData.replacedSignatureDataUrl,
      substituteInContract: !!this.contractData.substituteSignatureDataUrl,
      replacedContractLength: this.contractData.replacedSignatureDataUrl?.length || 0,
      substituteContractLength: this.contractData.substituteSignatureDataUrl?.length || 0
    });
  }

  // Méthode de débogage pour vérifier l'état des signatures
  debugSignatures() {
    console.log("=== DÉBOGAGE DES SIGNATURES ===");
    console.log("Signatures dans contractData:", {
      replaced: this.contractData.replacedSignatureDataUrl ? "disponible" : "non disponible",
      substitute: this.contractData.substituteSignatureDataUrl ? "disponible" : "non disponible",
      replacedLength: this.contractData.replacedSignatureDataUrl?.length || 0,
      substituteLength: this.contractData.substituteSignatureDataUrl?.length || 0
    });

    if (this.contractData.replacedSignatureDataUrl) {
      console.log("Signature remplacé (début):", this.contractData.replacedSignatureDataUrl.substring(0, 100) + "...");
    }

    if (this.contractData.substituteSignatureDataUrl) {
      console.log("Signature remplaçant (début):", this.contractData.substituteSignatureDataUrl.substring(0, 100) + "...");
    }
    console.log("=== FIN DÉBOGAGE ===");
  }

  // Méthode alternative qui utilise les signatures stockées dans contractData
  async downloadModifiedPdfWithStoredSignatures(pdfFile: File) {
    const reader = new FileReader();
    reader.onload = async () => {
      const pdfData = new Uint8Array(reader.result as ArrayBufferLike);
      const pdfDoc_ = await PDFDocument.load(pdfData);

      // Récupérer la dernière page du PDF
      const lastPageIndex = pdfDoc_.getPageCount() - 1;
      const page = pdfDoc_.getPage(lastPageIndex);

      console.log("Page cible pour les signatures:", { lastPageIndex, totalPages: pdfDoc_.getPageCount() });

      // Déboguer l'état des signatures avant utilisation
      // this.debugSignatures();

      // Utiliser les signatures stockées dans contractData
      const replacedSignatureUrl = this.contractData.replacedSignatureDataUrl;
      const substituteSignatureUrl = this.contractData.substituteSignatureDataUrl;

      console.log("Signatures stockées dans contractData:", {
        replaced: replacedSignatureUrl ? "disponible" : "non disponible",
        substitute: substituteSignatureUrl ? "disponible" : "non disponible",
        replacedLength: replacedSignatureUrl?.length || 0,
        substituteLength: substituteSignatureUrl?.length || 0
      });

      // Vérifier si les signatures sont valides (commencent par "data:image")
      const isReplacedValid = replacedSignatureUrl && replacedSignatureUrl.startsWith("data:image");
      const isSubstituteValid = substituteSignatureUrl && substituteSignatureUrl.startsWith("data:image");

      console.log("Validation des signatures:", {
        isReplacedValid,
        isSubstituteValid
      });

      const { width, height } = page.getSize();

      if (isReplacedValid) {
        const canvas1ImageBytes = await fetch(replacedSignatureUrl).then((res) => res.arrayBuffer());
        const canvas1ImageEmbed = await pdfDoc_.embedPng(canvas1ImageBytes);

        // Dessiner les images sur la page avec des positions ajustées
        page.drawImage(canvas1ImageEmbed, {
          x: width * 0.05, // 5% du côté gauche
          y: height * 0.10, // 5% du bas (plus haut que 0.15)
          width: width * 0.35, // 35% de la largeur de la page
          height: height * 0.15, // 15% de la hauteur de la page
        });

      }
      if (isSubstituteValid) {
        const canvas2ImageBytes = await fetch(substituteSignatureUrl).then((res) => res.arrayBuffer());
        const canvas2ImageEmbed = await pdfDoc_.embedPng(canvas2ImageBytes);

        page.drawImage(canvas2ImageEmbed, {
          x: width * 0.6, // 60% du côté gauche
          y: height * 0.10, // 5% du bas (plus haut que 0.15)
          width: width * 0.35, // 35% de la largeur de la page
          height: height * 0.15, // 15% de la hauteur de la page
        });
      }

      // Mettre à jour les champs de formulaire
      const form = pdfDoc_.getForm();
      this.PDFInputsFieldsMetadata!.forEach((page) => {
        page.fields.forEach((field) => {
          const pdfField = form.getTextField(field.name);
          if (pdfField) {
            pdfField.setText(field.value);
          }
        });
      });

      // Générer et télécharger le PDF
      const modifiedPdfBytes = await pdfDoc_.save();
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
