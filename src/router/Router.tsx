import { Route, Router, useNavigate } from "@solidjs/router";
import { Home } from "../views/home/Home";
import { Contracts } from "../views/Contracts";
import PDFViewer from "../components/contract/editor/PDFViewer";
import { Authentication } from "../views/auth/Authentication";
import { For } from "solid-js";

const routes = [
  { path: "/", component: Home },
  { path: "/contracts", component: Contracts },
  { path: "/contract-edit", component: PDFViewer },
  { path: "/register", component: Authentication },
  { path: "/login", component: Authentication },
];

export function RouteManager() {
  return (
    <Router>
      <For each={routes}>
        {(route) => <Route path={route.path} component={route.component} />}
      </For>
    </Router>
  );
}
