import { Notification } from "./components/notification/Notification";
import { FetcherService } from "./services/fetch.service";
import { Navbar } from "./components/navbar/Navbar";
import { RouteManager } from "./router/Router";
import { createEffect, on, onMount } from "solid-js";
import { loggedIn } from "./const.data";
import storeService from "./utils/store.service";

export function App() {
  onMount(() => FetcherService.setHost(import.meta.env.VITE_HOST));
  createEffect(on(loggedIn, () => (storeService.proxy.isLogin = loggedIn())));

  return (
    <main>
      <Navbar />
      <Notification />
      <div class="w-full md:px-20 px-4 ">
        <RouteManager />
      </div>
    </main>
  );
}
