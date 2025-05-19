import { Motion } from "@motionone/solid";
import { LogOut } from "lucide-solid";
import { authService } from "../../../services/auth.service";
import storeService from "../../../utils/store.service";
import { navigateTo } from "../../../router/Router";

export function MobileSidebar({
  navItems,
  closeSidebar,
}: {
  navItems: any[];
  closeSidebar: () => void;
}) {
  return (
    <Motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ duration: 0.3 }}
      class="fixed inset-0 z-40 lg:hidden"
    >
      <div
        class="fixed inset-0 bg-neutral-900 bg-opacity-50"
        onClick={closeSidebar}
      ></div>
      <div class="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg">
        <div class="flex flex-col h-full">
          <div class="px-6 py-6">
            <h2 class="text-2xl font-bold text-primary-500">KinéRéunion</h2>
          </div>
          <nav class="flex-1 px-4 pb-4 space-y-1">
            {navItems.map((item) => (
              <a
                class={`cursor-pointer group flex items-center px-4 py-3 text-sm font-semibold rounded-md ${
                  location.pathname === item.path
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
    </Motion.div>
  );
}

export default MobileSidebar;
