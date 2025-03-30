import { Notification } from "./components/notification/Notification";
import { FetcherService } from "./services/fetch.service";
import { createEffect, on, onMount } from "solid-js";
import { Navbar } from "./components/navbar/Navbar";
import storeService from "./utils/store.service";
import { RouteManager } from "./router/Router";
import { loggedIn } from "./const.data";
import { FloatingMenu } from "./components/floating-menu/FloatingMenu";

export function App() {
  onMount(() => FetcherService.setHost(import.meta.env.VITE_HOST));
  createEffect(on(loggedIn, () => (storeService.proxy.isLogin = loggedIn())));

  return (
    <main>
      <Navbar />
      <Notification />
      <FloatingMenu />
      <div class="w-full md:px-20 px-4 ">
        <RouteManager />
      </div>
    </main>
  );
}
