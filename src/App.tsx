import { Navbar } from "./components/navbar/Navbar";
import { RouteManager } from "./router/Router";

export function App() {
  return (
    <main>
      <Navbar />
      <div class="w-full md:px-20 px-1 mt-4">
        <RouteManager />
      </div>
    </main>
  );
}
