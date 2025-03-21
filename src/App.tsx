import { Notification } from "./components/notification/Notification";
import { FetcherService } from "./services/fetch.service";
import { Navbar } from "./components/navbar/Navbar";
import { RouteManager } from "./router/Router";
import { onMount } from "solid-js";

export function App() {
  onMount(() => FetcherService.setHost(import.meta.env.VITE_HOST));

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
