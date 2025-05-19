import { createSignal, Show } from "solid-js";

import MobileSidebar from "./sidebar/MobileSidebar";
import DesktopSidebar from "./sidebar/DesktopSidebar";
import MainContent from "./MainContent";
import { Home, FileText } from "lucide-solid";
import { page } from "../../router/Router";
import { Notification } from "../notification/Notification";
import { DialogManagerProvider } from "./DialogManager";
import MobileMenuButton from "./btns/MobileMenuButton";

export function Layout(props: { children: any }) {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  const navItems = [
    { path: "/", label: "Accueil", icon: <Home size={20} /> },
    { path: "/contracts", label: "Contrats", icon: <FileText size={20} /> },
  ];

  return (
    <DialogManagerProvider>
      <div class="min-h-screen bg-neutral-50 flex">
        <Show when={page() !== "/auth"}>
          <MobileMenuButton
            sidebarOpen={sidebarOpen()}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen())}
          />
          {sidebarOpen() && (
            <MobileSidebar
              navItems={navItems}
              closeSidebar={() => setSidebarOpen(false)}
            />
          )}
          <DesktopSidebar navItems={navItems} />
        </Show>

        <MainContent>
          <Notification />
          {props.children}
        </MainContent>
      </div>
    </DialogManagerProvider>
  );
}

export default Layout;
