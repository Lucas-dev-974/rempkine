import { FloatingMenu } from "./components/FloattingMenu/FloatingMenu";
import { Notification } from "./components/notification/Notification";
import { mailService } from "./services/mail.service";
import { createEffect, on, onMount } from "solid-js";
import { Navbar } from "./components/navbar/Navbar";
import storeService from "./utils/store.service";
import { Router } from "./router/Router";
import { loggedIn } from "./const.data";


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
