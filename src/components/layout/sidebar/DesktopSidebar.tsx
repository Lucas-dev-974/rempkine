import { LogOut } from "lucide-solid";
import storeService from "../../../utils/store.service";
import { authService } from "../../../services/auth.service";
import { useNavigate } from "@solidjs/router";
import { navigateTo, page, setPage } from "../../../router/Router";
// import {
//   useNavigateOut,
//   UseNavigateOutOfRouter,
// } from "../../router/useNavigate";

export function DesktopSidebar({ navItems }: { navItems: any[] }) {
  return (
    <div class="hidden lg:flex lg:flex-shrink-0">
      <div class="w-64 flex flex-col">
        <div class="border-r border-neutral-200 pt-5 pb-4 flex flex-col h-full bg-white">
          <div class="px-6 pb-6">
            <h2 class="text-2xl font-bold text-primary-500">KinéRéunion</h2>
          </div>
          <nav class="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
              <a
                class={`cursor-pointer group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  page() === item.path
                    ? "bg-primary-50 text-primary-600"
                    : "text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                }`}
                onClick={() => navigateTo(item.path)}
              >
                <span class="mr-3">{item.icon}</span>
                {item.label}
              </a>
            ))}
            {storeService.proxy.isLogin && (
              <button
                onClick={authService.logout}
                class="w-full flex items-center px-4 py-3 text-sm font-medium rounded-md text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
              >
                <span class="mr-3">
                  <LogOut size={20} />
                </span>
                Déconnexion
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default DesktopSidebar;
