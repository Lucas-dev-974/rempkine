import { FetcherService } from "./services/fetch.service";

import { createEffect, on, onMount } from "solid-js";
import storeService from "./utils/store.service";
import { RouteManager, setPage } from "./router/Router";
import { loggedIn } from "./const.data";
import Layout from "./components/layout/Layout";

export function App() {
  onMount(() => {
    FetcherService.setHost(import.meta.env.VITE_HOST);

    window.addEventListener("popstate", () =>
      setPage(window.location.pathname)
    );
  });
  console.log("host:", import.meta.env.VITE_HOST);
  createEffect(on(loggedIn, () => (storeService.proxy.isLogin = loggedIn())));

  return <Layout children={<RouteManager />} />;
}
