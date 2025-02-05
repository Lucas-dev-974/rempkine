import * as pdfjsLib from "pdfjs-dist";
import { createSignal, onMount, Show } from "solid-js";
// import "pdfjs-dist/web/pdf_viewer.css";

import { Button } from "../../buttons/Button";
import { PreviousIcon } from "../../../icons/PreviousIcon";
import { NextIcon } from "../../../icons/NextIcon";
import { PDFTool } from "./PDFTool";

import "./PDFExtractor.css";
import { PDFEditor } from "./PDFEditor";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "node_modules/pdfjs-dist/build/pdf.worker.mjs";

function PDFViewer() {
  return (
    <div class="w-1/3">
      <PDFEditor />
    </div>
  );
}

export default PDFViewer;
