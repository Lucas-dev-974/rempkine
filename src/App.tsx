import { Notification } from "./components/notification/Notification";
import { FetcherService } from "./services/fetch.service";
import { FloatingMenu } from "./components/floating-menu/FloatingMenu";

import { createEffect, on, onMount } from "solid-js";
import { Navbar } from "./components/navbar/Navbar";
import storeService from "./utils/store.service";
import { loggedIn } from "./const.data";
import { Router } from "./router/Router";

export function App() {
  const host = location.protocol + "//api." + location.host + "/api "
  onMount(() => FetcherService.setHost(import.meta.env.VITE_HOST ?? host));
  console.log("host:", import.meta.env.VITE_HOST, host);

  createEffect(on(loggedIn, () => (storeService.proxy.isLogin = loggedIn())));

  return (
    <main>
      <Navbar />
      <FloatingMenu />
      <Notification />
      <div class="w-full md:px-20 px-4 ">
        <Router />
      </div>
    </main>
  );
}
