import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

import { formatDate } from "../ContractDialog/DropdownContratInformations/ContractInformationsFields";
import { RenderParameters } from "pdfjs-dist/types/src/display/api";
import { ContractEntity } from "../../models/contract.entity";
import { Accessor, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { loadContract } from "../../const.data";
import { getContractFieldFromPDFId, getPDFIdsForContractField, getPDFIdsForField } from "./pdf-field-mapping.config";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc as unknown as string;

export const [toSendBlob, setToSendBlob] = createSignal<Blob | undefined>()

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
  private static instance: PDFTool | undefined;

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
  private contractDataStore: ReturnType<typeof createStore<Partial<ContractEntity>>>[0];
  private setContractData: ReturnType<typeof createStore<Partial<ContractEntity>>>[1];

  private constructor(url: string, canvasID: string) {
    this.PDFInputsFieldsMetadata = []
    const [contractDataStore, setContractDataStore] = createStore<Partial<ContractEntity>>({});
    this.contractDataStore = contractDataStore;
    this.setContractData = setContractDataStore;
    this.contractData = contractDataStore; // Pour compatibilité avec le code existant
    this.canvasID = canvasID;
    this.url = url;
  }

  /**
   * Obtient l'instance unique du singleton PDFTool.
   * Si l'instance n'existe pas, elle est créée avec les paramètres fournis.
   * Si l'instance existe déjà mais avec des paramètres différents, elle est réinitialisée.
   *
   * @param url URL du fichier PDF
   * @param canvasID ID du canvas HTML
   * @returns L'instance unique de PDFTool
   */
  public static getInstance(url: string, canvasID: string = "pdf-canvas"): PDFTool {
    if (!PDFTool.instance) {
      PDFTool.instance = new PDFTool(url, canvasID);
    } else if (PDFTool.instance.url !== url || PDFTool.instance.canvasID !== canvasID) {
      // Réinitialiser l'instance si les paramètres ont changé
      PDFTool.instance.url = url;
      PDFTool.instance.canvasID = canvasID;
      PDFTool.instance.PDFInputsFieldsMetadata = [];
      const [contractDataStore, setContractDataStore] = createStore<Partial<ContractEntity>>({});
      PDFTool.instance.contractDataStore = contractDataStore;
      PDFTool.instance.setContractData = setContractDataStore;
      PDFTool.instance.contractData = contractDataStore;
      PDFTool.instance.pdfDoc = undefined;
      PDFTool.instance.pdfBlob = undefined;
      PDFTool.instance.pdfFile = undefined;
      PDFTool.instance.numPages = undefined;
      PDFTool.instance.currentPage = 1;
      PDFTool.instance.isRendering = false;
    }
    return PDFTool.instance;
  }

  /**
   * Vérifie si une instance du singleton existe
   * @returns true si une instance existe, false sinon
   */
  public static hasInstance(): boolean {
    return PDFTool.instance !== undefined;
  }

  /**
   * Réinitialise l'instance du singleton (utile pour les tests ou le nettoyage)
   */
  public static resetInstance(): void {
    PDFTool.instance = undefined;
  }

  async initialize() {
    await this.loadPdf();

    if (loadContract()) {
      this.setContractDataToPDFInputsFields(loadContract() as ContractEntity);
      // handlerToUpdateFormInputsWithContratData()
    } else {
      this.updateField("replacedGender", GenderEnum.male, { immediate: true });
      this.updateField("substituteGender", GenderEnum.male, { immediate: true });
    }
  }

  getContractFieldNameFromInputPDFID(id: string): keyof ContractEntity | undefined {
    return getContractFieldFromPDFId(id);
  }

  /**
   * Récupère les données du contrat à jour depuis le store réactif
   * @returns Une copie des données du contrat synchronisées avec le store
   */
  getContractData(): Partial<ContractEntity> {
    // Synchroniser contractData avec le store avant de retourner
    this.contractData = { ...this.contractDataStore };
    return { ...this.contractDataStore };
  }

  /**
   * Méthode unifiée de mise à jour d'un champ
   * @param fieldName Nom du champ dans ContractEntity
   * @param value Nouvelle valeur
   * @param options Options de mise à jour
   */
  public updateField(
    fieldName: keyof ContractEntity,
    value: any,
    options?: {
      immediate?: boolean;
      skipUI?: boolean;
      gender?: GenderEnum;
    }
  ): void {
    // Déterminer le genre en fonction du nom du champ si non spécifié dans les options
    let gender: GenderEnum;
    if (options?.gender) {
      gender = options.gender;
    } else {
      // Si le champ commence par "replaced", utiliser replacedGender
      if (String(fieldName).startsWith("replaced")) {
        gender = (this.contractDataStore.replacedGender as GenderEnum) ?? GenderEnum.male;
      }
      // Si le champ commence par "substitute", utiliser substituteGender
      else if (String(fieldName).startsWith("substitute")) {
        gender = (this.contractDataStore.substituteGender as GenderEnum) ?? GenderEnum.male;
      }
      // Pour les autres champs, utiliser un fallback
      else {
        gender = (this.contractDataStore.replacedGender as GenderEnum) ?? (this.contractDataStore.substituteGender as GenderEnum) ?? GenderEnum.male;
      }
    }
    const pdfIds = getPDFIdsForContractField(fieldName, gender);

    if (pdfIds.length === 0) {
      console.warn(`No PDF IDs found for field: ${fieldName} with gender: ${gender}`);
      // IMPORTANT: Mettre à jour le store même si aucun ID PDF n'est trouvé
      // car certains champs peuvent ne pas avoir de correspondance PDF mais doivent être dans contractData
      this.setContractData(fieldName, value);
      this.setContractData("updatedAt", new Date(Date.now()));
      this.contractData = { ...this.contractDataStore };
      return;
    }

    // Debug en mode développement
    if (import.meta.env.DEV && (fieldName === "replacedName" || fieldName === "substituteName")) {
      console.log(`updateField called for ${fieldName}:`, {
        value,
        gender,
        pdfIds,
        currentStoreValue: this.contractDataStore[fieldName]
      });
    }

    // Mettre à jour contractData (store réactif)
    this.setContractData(fieldName, value);
    this.setContractData("updatedAt", new Date(Date.now()));
    // Synchroniser avec contractData pour compatibilité
    this.contractData = { ...this.contractDataStore };

    // Mettre à jour PDFInputsFieldsMetadata
    pdfIds.forEach((pdfId) => {
      this.PDFInputsFieldsMetadata = this.PDFInputsFieldsMetadata.map((page) => ({
        ...page,
        fields: page.fields.map((field) =>
          field.id === pdfId ? { ...field, value: String(value ?? "") } : field
        ),
      }));
    });
  }

  public setContractDataToPDFInputsFields(contract: Partial<ContractEntity>) {
    // Mettre à jour contractData avec toutes les valeurs du contrat
    Object.keys(contract).forEach((key) => {
      const fieldName = key as keyof ContractEntity;
      const value = contract[fieldName];
      if (value !== undefined) {
        const gender = fieldName.includes("replaced")
          ? (contract.replacedGender as GenderEnum)
          : (contract.substituteGender as GenderEnum);
        this.updateField(fieldName, value, {
          immediate: true,
          gender
        });
      }
    });
    // Synchroniser contractData pour compatibilité
    this.contractData = { ...this.contractDataStore };
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
    this.PDFInputsFieldsMetadata = [];
    if (!this.pdfDoc) throw new Error("PDF not loaded");

    const pages = this.pdfDoc!.numPages;
    const formFields = [];

    for (let i = 0; i != pages; i++) {
      const page = await this.pdfDoc!.getPage(i + 1);
      const dimensions = await this.getDimensions(this.pdfDoc, "pdf-canvas");
      const annotations = await page.getAnnotations();

      if (dimensions) {
        const { pdfWidth, pdfHeight, canvasDisplayWidth } = dimensions;
        const scale = canvasDisplayWidth / pdfWidth;
        const viewport = page.getViewport({ scale });


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
    return {
      canvasDisplayHeight: 299,
      canvasDisplayWidth: 598,
      pdfHeight: 841.68,
      pdfWidth: 595.2,
    }
  }

  async renderPage(pageNum: number, canvasElement: HTMLCanvasElement) {
    await this.getPagesFields();
    if (this.isRendering) return;
    this.isRendering = true;

    const page = await this.pdfDoc!.getPage(pageNum);
    const context = canvasElement!.getContext("2d");
    const dimensions = await this.getDimensions(this.pdfDoc, "pdf-canvas");


    if (dimensions) {
      const { pdfWidth, pdfHeight, canvasDisplayWidth } = dimensions;
      const scale = (canvasDisplayWidth / pdfWidth) * 2;

      const viewport = page.getViewport({ scale });
      if (canvasElement) {
        canvasElement.height = viewport.height;
        canvasElement.width = viewport.width;
      }

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext as RenderParameters).promise;
      this.currentPage = pageNum;
      this.isRendering = false;
    }
  }

  updateContractDataAndPDFFields(fieldId: string, newValue: any, updateContractData: boolean = true) {
    const key = this.getContractFieldNameFromInputPDFID(fieldId);

    if (updateContractData && key) {
      // Utiliser la méthode unifiée updateField
      this.updateField(key, newValue, { immediate: true });
    } else {
      // Mettre à jour uniquement PDFInputsFieldsMetadata sans contractData
      this.PDFInputsFieldsMetadata = this.PDFInputsFieldsMetadata.map((page) => ({
        ...page,
        fields: page.fields.map((field) =>
          field.id === fieldId ? { ...field, value: String(newValue ?? "") } : field
        ),
      }));
    }
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

        } catch (error) {
          if (import.meta.env.DEV) {
            console.error("Erreur lors de l'ajout des signatures:", error);
          }
        }
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
      const blob = new Blob([modifiedPdfBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = "modified.pdf";
      a.click();

      URL.revokeObjectURL(url);
    };

    reader.readAsArrayBuffer(pdfFile as File);
  }


  getReplacedFieldsIds(gender?: GenderEnum) {
    return {
      name: getPDFIdsForField("replacedName", gender),
      birthday: getPDFIdsForField("replacedBirthday", gender),
      birthdayLocation: getPDFIdsForField("replacedBirthdayLocation", gender),
      orderDepartement: getPDFIdsForField("replacedOrderDepartement", gender),
      orderDepartmentNumber: getPDFIdsForField("replacedOrderDepartmentNumber", gender),
      professionnalAddress: getPDFIdsForField("replacedProfessionnalAddress", gender),
      email: getPDFIdsForField("replacedEmail", gender),
    };
  }

  getSubstituteFieldsIds(gender?: GenderEnum) {
    return {
      name: getPDFIdsForField("substituteName", gender),
      birthday: getPDFIdsForField("substituteBirthday", gender),
      birthdayLocation: getPDFIdsForField("substituteBirthdayLocation", gender),
      orderDepartement: getPDFIdsForField("substituteOrderDepartement", gender),
      orderDepartmentNumber: getPDFIdsForField("substituteOrderDepartmentNumber", gender),
      address: getPDFIdsForField("substituteAdress", gender),
      email: getPDFIdsForField("substituteEmail", gender),
    };
  }

  getContractInformationFieldsIds() {
    return {
      startDate: getPDFIdsForField("startDate") as string,
      endDate: getPDFIdsForField("endDate") as string,
      percentReversedToSubstitute: getPDFIdsForField("percentReturnToSubstitute") as string,
      reversedBefore: getPDFIdsForField("percentReturnToSubstituteBeforeDate") as string,
      NonInstallationRadius: getPDFIdsForField("nonInstallationRadius") as string,
      conciliationCDOMK: getPDFIdsForField("conciliationCDOMK") as string,
      doneAtLocation: getPDFIdsForField("doneAtLocation") as string,
      doneAt: getPDFIdsForField("doneAtDate") as string,
    };
  }


  resetContractData() {
    this.setContractData({
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
    });
    this.contractData = { ...this.contractDataStore };
  }

  updateSignaturesInContract(
    signatures: Accessor<{ replaced?: string; substitute?: string } | undefined>
  ) {
    const signatureData = signatures();

    if (signatureData?.replaced) {
      this.updateField("replacedSignatureDataUrl", signatureData.replaced, { immediate: true });
    }

    if (signatureData?.substitute) {
      this.updateField("substituteSignatureDataUrl", signatureData.substitute, { immediate: true });
    }
  }

  // Méthode de débogage pour vérifier l'état des signatures (uniquement en développement)
  debugSignatures() {
    if (!import.meta.env.DEV) return;

    console.log("=== DÉBOGAGE DES SIGNATURES ===");
    console.log("Signatures dans contractData:", {
      replaced: this.contractDataStore.replacedSignatureDataUrl ? "disponible" : "non disponible",
      substitute: this.contractDataStore.substituteSignatureDataUrl ? "disponible" : "non disponible",
      replacedLength: this.contractDataStore.replacedSignatureDataUrl?.length || 0,
      substituteLength: this.contractDataStore.substituteSignatureDataUrl?.length || 0
    });

    if (this.contractDataStore.replacedSignatureDataUrl) {
      console.log("Signature remplacé (début):", this.contractDataStore.replacedSignatureDataUrl.substring(0, 100) + "...");
    }

    if (this.contractDataStore.substituteSignatureDataUrl) {
      console.log("Signature remplaçant (début):", this.contractDataStore.substituteSignatureDataUrl.substring(0, 100) + "...");
    }
    console.log("=== FIN DÉBOGAGE ===");
  }

  // Méthode alternative qui utilise les signatures stockées dans contractData
  async downloadModifiedPdfWithStoredSignatures(pdfFile: File, download: boolean = true) {
    const reader = new FileReader();

    reader.onload = async () => {
      const pdfData = new Uint8Array(reader.result as ArrayBufferLike);
      const pdfDoc_ = await PDFDocument.load(pdfData);

      // Récupérer la dernière page du PDF
      const lastPageIndex = pdfDoc_.getPageCount() - 1;
      const page = pdfDoc_.getPage(lastPageIndex);

      // Déboguer l'état des signatures avant utilisation
      // this.debugSignatures();

      // Utiliser les signatures stockées dans contractData
      const replacedSignatureUrl = this.contractDataStore.replacedSignatureDataUrl;
      const substituteSignatureUrl = this.contractDataStore.substituteSignatureDataUrl;

      // console.log("Signatures stockées dans contractData:", {
      //   replaced: replacedSignatureUrl ? "disponible" : "non disponible",
      //   substitute: substituteSignatureUrl ? "disponible" : "non disponible",
      //   replacedLength: replacedSignatureUrl?.length || 0,
      //   substituteLength: substituteSignatureUrl?.length || 0
      // });

      // Vérifier si les signatures sont valides (commencent par "data:image")
      const isReplacedValid = replacedSignatureUrl && replacedSignatureUrl.startsWith("data:image");
      const isSubstituteValid = substituteSignatureUrl && substituteSignatureUrl.startsWith("data:image");



      const { width, height } = page.getSize();

      if (isReplacedValid) {
        try {
          const canvas1ImageBytes = await fetch(replacedSignatureUrl).then((res) => res.arrayBuffer());

          // Détecter le format de l'image et utiliser la méthode appropriée
          let canvas1ImageEmbed;
          if (replacedSignatureUrl.includes('data:image/png')) {
            canvas1ImageEmbed = await pdfDoc_.embedPng(canvas1ImageBytes);
          } else if (replacedSignatureUrl.includes('data:image/jpeg') || replacedSignatureUrl.includes('data:image/jpg')) {
            canvas1ImageEmbed = await pdfDoc_.embedJpg(canvas1ImageBytes);
          } else {
            // Par défaut, essayer PNG
            canvas1ImageEmbed = await pdfDoc_.embedPng(canvas1ImageBytes);
          }

          // Dessiner les images sur la page avec des positions ajustées
          page.drawImage(canvas1ImageEmbed, {
            x: width * 0.05, // 5% du côté gauche
            y: height * 0.10, // 5% du bas (plus haut que 0.15)
            width: width * 0.35, // 35% de la largeur de la page
            height: height * 0.15, // 15% de la hauteur de la page
          });
        } catch (error) {
          console.error('Erreur lors de l\'embedding de la signature remplacée:', error);
        }
      }

      if (isSubstituteValid) {
        try {
          const canvas2ImageBytes = await fetch(substituteSignatureUrl).then((res) => res.arrayBuffer());

          // Détecter le format de l'image et utiliser la méthode appropriée
          let canvas2ImageEmbed;
          if (substituteSignatureUrl.includes('data:image/png')) {
            canvas2ImageEmbed = await pdfDoc_.embedPng(canvas2ImageBytes);
          } else if (substituteSignatureUrl.includes('data:image/jpeg') || substituteSignatureUrl.includes('data:image/jpg')) {
            canvas2ImageEmbed = await pdfDoc_.embedJpg(canvas2ImageBytes);
          } else {
            // Par défaut, essayer PNG
            canvas2ImageEmbed = await pdfDoc_.embedPng(canvas2ImageBytes);
          }

          page.drawImage(canvas2ImageEmbed, {
            x: width * 0.6, // 60% du côté gauche
            y: height * 0.10, // 5% du bas (plus haut que 0.15)
            width: width * 0.35, // 35% de la largeur de la page
            height: height * 0.15, // 15% de la hauteur de la page
          });
        } catch (error) {
          console.error('Erreur lors de l\'embedding de la signature substitut:', error);
        }
      }

      // Mettre à jour les champs de formulaire
      const form = pdfDoc_.getForm();

      const formatDate_ = (value: string) => {
        try {
          const formatedDate = formatDate(value)
          return formatedDate == "Invalid Date" ? value : formatedDate
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error("Erreur de formatage de date:", error);
          }
          return value
        }
      }

      for (const page of this.PDFInputsFieldsMetadata) {
        for (const field of page.fields) {
          const pdfField = form.getTextField(field.name)
          if (pdfField) {

            pdfField.setText(formatDate_(field.value));
          }
        }
      }

      // Générer et télécharger le PDF
      const modifiedPdfBytes = await pdfDoc_.save();
      const blob = new Blob([modifiedPdfBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      if (download) {

        a.download = "contrat.pdf";
        a.click();

        URL.revokeObjectURL(url);
      } else {
        setToSendBlob(blob)
      }
    };

    reader.readAsArrayBuffer(pdfFile as File);
  }
}
