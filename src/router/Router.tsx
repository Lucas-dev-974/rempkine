import { Contracts } from "../views/Contracts";
import { Authentication } from "../views/auth/Authentication";
import { createSignal, For, Match, Switch } from "solid-js";
import HomePage from "../views/home/HomePage";

export const routes = [
  { path: "/", component: HomePage },
  { path: "/contracts", component: Contracts },
  { path: "/auth", component: Authentication },
];

// Dynamically infer the type of all possible paths
type RoutePaths = (typeof routes)[number]["path"];

export const [page, setPage] = createSignal<RoutePaths>("/");
export function navigateTo(path: RoutePaths) {
  setPage(path);
  window.history.pushState({}, "", path);
}
export function RouteManager() {
  return (
    <Switch>
      <For each={routes}>
        {(route) => (
          <Match when={route.path == page()} children={<route.component />} />
        )}
      </For>
    </Switch>
  );
}
