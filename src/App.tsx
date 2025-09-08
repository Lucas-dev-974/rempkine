import { Notification } from "./components/notification/Notification";
import { FetcherService } from "./services/fetch.service";

import { createEffect, on, onMount } from "solid-js";
import { Navbar } from "./components/navbar/Navbar";
import storeService from "./utils/store.service";
import { loggedIn } from "./const.data";
import { Router } from "./router/Router";
import { FloatingMenu } from "./components/FloattingMenu/FloatingMenu";

export function App() {
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
