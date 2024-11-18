import { Navbar } from "./components/navbar/Navbar";
import { Notification } from "./components/notification/Notification";
import { setEffect } from "./const.data";
import { RouteManager } from "./router/Router";

export function App() {
  setEffect();
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
