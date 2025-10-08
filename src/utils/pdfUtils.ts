import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configuration de pdfjs-dist: utiliser le worker embarqué correspondant à la même version
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc as unknown as string;

export interface PDFPage {
  pageNumber: number;
  width: number;
  height: number;
  text: string;
}

export class PDFManager {
  private pdfDoc: PDFDocument | null = null;
  private pdfjsDoc: pdfjsLib.PDFDocumentProxy | null = null;

  /**
   * Charger un PDF depuis une URL ou un ArrayBuffer
   */
  async loadPDF(source: string | ArrayBuffer): Promise<void> {
    if (typeof source === 'string') {
      // Charger depuis une URL
      const response = await fetch(source);
      const arrayBuffer = await response.arrayBuffer();
      this.pdfDoc = await PDFDocument.load(arrayBuffer);
      this.pdfjsDoc = await pdfjsLib.getDocument(arrayBuffer).promise;
    } else {
      // Charger depuis un ArrayBuffer
      this.pdfDoc = await PDFDocument.load(source);
      this.pdfjsDoc = await pdfjsLib.getDocument(source).promise;
    }
  }

  /**
   * Créer un nouveau PDF vide
   */
  async createNewPDF(): Promise<void> {
    this.pdfDoc = await PDFDocument.create();
  }

  /**
   * Obtenir les informations d'une page
   */
  async getPageInfo(pageNumber: number): Promise<PDFPage> {
    if (!this.pdfjsDoc) throw new Error('PDF non chargé');

    const page = await this.pdfjsDoc.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item: any) => item.str).join(' ');

    return {
      pageNumber,
      width: page.view[2],
      height: page.view[3],
      text
    };
  }

  /**
   * Ajouter du texte à une page
   */
  async addTextToPage(pageNumber: number, text: string, x: number, y: number, options?: {
    fontSize?: number;
    color?: [number, number, number];
    font?: any;
  }): Promise<void> {
    if (!this.pdfDoc) throw new Error('PDF non chargé');

    const pages = this.pdfDoc.getPages();
    const page = pages[pageNumber - 1];

    if (!page) throw new Error(`Page ${pageNumber} non trouvée`);

    const {
      fontSize = 12,
      color = [0, 0, 0] as [number, number, number],
      font = await this.pdfDoc.embedFont(StandardFonts.Helvetica)
    } = options || {};

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      color: rgb(color[0], color[1], color[2]),
      font
    });
  }

  /**
   * Ajouter une nouvelle page
   */
  async addPage(width: number = 595, height: number = 842): Promise<number> {
    if (!this.pdfDoc) throw new Error('PDF non chargé');

    const page = this.pdfDoc.addPage([width, height]);
    return this.pdfDoc.getPageCount();
  }

  /**
   * Supprimer une page
   */
  async removePage(pageNumber: number): Promise<void> {
    if (!this.pdfDoc) throw new Error('PDF non chargé');

    this.pdfDoc.removePage(pageNumber - 1);
  }

  /**
   * Fusionner plusieurs PDFs
   */
  async mergePDFs(pdfSources: (string | ArrayBuffer)[]): Promise<void> {
    if (!this.pdfDoc) {
      await this.createNewPDF();
    }

    for (const source of pdfSources) {
      const pdfToMerge = await PDFDocument.load(source);
      const pages = await this.pdfDoc!.copyPages(pdfToMerge, pdfToMerge.getPageIndices());

      pages.forEach((page) => {
        this.pdfDoc!.addPage(page);
      });
    }
  }

  /**
   * Diviser un PDF en plusieurs pages
   */
  async splitPDF(): Promise<PDFDocument[]> {
    if (!this.pdfDoc) throw new Error('PDF non chargé');

    const results: PDFDocument[] = [];
    const pageCount = this.pdfDoc.getPageCount();

    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(this.pdfDoc, [i]);
      newPdf.addPage(copiedPage);
      results.push(newPdf);
    }

    return results;
  }

  /**
   * Sauvegarder le PDF
   */
  async savePDF(): Promise<Uint8Array> {
    if (!this.pdfDoc) throw new Error('PDF non chargé');

    return await this.pdfDoc.save();
  }

  /**
   * Obtenir le PDF en base64
   */
  async getPDFAsBase64(): Promise<string> {
    const pdfBytes = await this.savePDF();
    const base64 = btoa(String.fromCharCode(...pdfBytes));
    return `data:application/pdf;base64,${base64}`;
  }

  /**
   * Obtenir le nombre de pages
   */
  getPageCount(): number {
    if (!this.pdfDoc) return 0;
    return this.pdfDoc.getPageCount();
  }

  /**
   * Obtenir les métadonnées du PDF
   */
  getMetadata(): { title?: string; author?: string; subject?: string; creator?: string } {
    if (!this.pdfDoc) return {};

    return {
      title: this.pdfDoc.getTitle(),
      author: this.pdfDoc.getAuthor(),
      subject: this.pdfDoc.getSubject(),
      creator: this.pdfDoc.getCreator()
    };
  }

  /**
   * Définir les métadonnées du PDF
   */
  async setMetadata(metadata: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
  }): Promise<void> {
    if (!this.pdfDoc) throw new Error('PDF non chargé');

    if (metadata.title) this.pdfDoc.setTitle(metadata.title);
    if (metadata.author) this.pdfDoc.setAuthor(metadata.author);
    if (metadata.subject) this.pdfDoc.setSubject(metadata.subject);
    if (metadata.creator) this.pdfDoc.setCreator(metadata.creator);
  }
}

// Instance globale du gestionnaire PDF
export const pdfManager = new PDFManager();

// Utilitaires pour l'affichage des PDFs
export const createPDFViewer = (container: HTMLElement, pdfUrl: string) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.appendChild(canvas);

  const renderPage = async (pageNumber: number) => {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.5 });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctx!,
      viewport: viewport
    };

    await page.render(renderContext).promise;
  };

  return {
    renderPage,
    canvas
  };
};

