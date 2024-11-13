import { Router } from "@solidjs/router";
import { Home } from "../views/Home";
import { Contracts } from "../views/Contracts";
import { EditContract } from "../components/contract/edit-contract/EditContract";
import PDFViewer from "../components/contract/edit-contract/PDFExtractor";

const routes = [
  { path: "/", component: Home },
  { path: "/contracts", component: Contracts },
  { path: "/contract-edit", component: PDFViewer },
];

export function RouteManager() {
  return <Router>{routes}</Router>;
}
