import { Component, createSignal, onMount, onCleanup } from 'solid-js';
import { pdfManager, createPDFViewer, PDFPage } from '../utils/pdfUtils';
import * as pdfjsLib from 'pdfjs-dist';

interface PDFViewerProps {
  pdfUrl?: string;
  pdfFile?: File;
  onPageChange?: (page: PDFPage) => void;
  onTextExtract?: (text: string) => void;
}

export const PDFViewer: Component<PDFViewerProps> = (props) => {
  const [currentPage, setCurrentPage] = createSignal(1);
  const [totalPages, setTotalPages] = createSignal(0);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [pdfText, setPdfText] = createSignal<string>('');
  const [scale, setScale] = createSignal(1.5);
  
  let canvasRef: HTMLCanvasElement | undefined;
  let containerRef: HTMLDivElement | undefined;

  onMount(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (props.pdfUrl) {
        await pdfManager.loadPDF(props.pdfUrl);
      } else if (props.pdfFile) {
        const arrayBuffer = await props.pdfFile.arrayBuffer();
        await pdfManager.loadPDF(arrayBuffer);
      } else {
        throw new Error('Aucun PDF fourni');
      }

      const pageCount = pdfManager.getPageCount();
      setTotalPages(pageCount);

      if (pageCount > 0) {
        await renderPage(1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du PDF');
    } finally {
      setIsLoading(false);
    }
  });

  const renderPage = async (pageNumber: number) => {
    if (!canvasRef || !containerRef) return;

    try {
      const pdf = await pdfjsLib.getDocument(props.pdfUrl || '').promise;
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: scale() });
      
      canvasRef.height = viewport.height;
      canvasRef.width = viewport.width;
      
      const ctx = canvasRef.getContext('2d');
      if (!ctx) return;
      
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      
      // Extraire le texte de la page
      const textContent = await page.getTextContent();
      const text = textContent.items.map((item: any) => item.str).join(' ');
      setPdfText(text);
      
      // Notifier le parent
      const pageInfo: PDFPage = {
        pageNumber,
        width: viewport.width,
        height: viewport.height,
        text
      };
      
      props.onPageChange?.(pageInfo);
      props.onTextExtract?.(text);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du rendu de la page');
    }
  };

  const goToPage = async (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages()) return;
    
    setCurrentPage(pageNumber);
    await renderPage(pageNumber);
  };

  const nextPage = () => {
    if (currentPage() < totalPages()) {
      goToPage(currentPage() + 1);
    }
  };

  const prevPage = () => {
    if (currentPage() > 1) {
      goToPage(currentPage() - 1);
    }
  };

  const zoomIn = () => {
    setScale(scale() + 0.2);
    renderPage(currentPage());
  };

  const zoomOut = () => {
    if (scale() > 0.5) {
      setScale(scale() - 0.2);
      renderPage(currentPage());
    }
  };

  const downloadPDF = async () => {
    try {
      const pdfBytes = await pdfManager.savePDF();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du téléchargement');
    }
  };

  return (
    <div class="pdf-viewer bg-white rounded-lg shadow-lg p-4">
      {/* Contrôles */}
      <div class="flex justify-between items-center mb-4 p-2 bg-gray-100 rounded">
        <div class="flex items-center gap-2">
          <button 
            onClick={prevPage}
            disabled={currentPage() <= 1}
            class="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            ← Précédent
          </button>
          
          <span class="text-sm">
            Page {currentPage()} sur {totalPages()}
          </span>
          
          <button 
            onClick={nextPage}
            disabled={currentPage() >= totalPages()}
            class="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Suivant →
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button 
            onClick={zoomOut}
            class="px-2 py-1 bg-gray-500 text-white rounded"
          >
            -
          </button>
          <span class="text-sm">{Math.round(scale() * 100)}%</span>
          <button 
            onClick={zoomIn}
            class="px-2 py-1 bg-gray-500 text-white rounded"
          >
            +
          </button>
          
          <button 
            onClick={downloadPDF}
            class="px-3 py-1 bg-green-500 text-white rounded"
          >
            📥 Télécharger
          </button>
        </div>
      </div>

      {/* Zone d'affichage */}
      <div 
        ref={containerRef}
        class="pdf-container border border-gray-300 rounded overflow-auto max-h-96"
      >
        {isLoading() && (
          <div class="flex justify-center items-center h-64">
            <div class="text-lg">Chargement du PDF...</div>
          </div>
        )}
        
        {error() && (
          <div class="flex justify-center items-center h-64 text-red-500">
            <div class="text-center">
              <div class="text-lg font-bold">Erreur</div>
              <div class="text-sm">{error()}</div>
            </div>
          </div>
        )}
        
        <canvas 
          ref={canvasRef}
          class="mx-auto"
          style={{ display: isLoading() || error() ? 'none' : 'block' }}
        />
      </div>

      {/* Texte extrait */}
      {pdfText() && (
        <div class="mt-4 p-3 bg-gray-50 rounded">
          <h3 class="font-bold mb-2">Texte extrait :</h3>
          <div class="text-sm text-gray-700 max-h-32 overflow-y-auto">
            {pdfText()}
          </div>
        </div>
      )}
    </div>
  );
};

