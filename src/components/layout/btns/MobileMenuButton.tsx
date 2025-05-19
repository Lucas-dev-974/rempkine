import { Menu, X } from "lucide-solid";
import { Show } from "solid-js";

export function MobileMenuButton({
  sidebarOpen,
  toggleSidebar,
}: {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}) {
  return (
    <div class="lg:hidden fixed top-4 left-4 z-50">
      <button
        onClick={toggleSidebar}
        class="p-2 rounded-md bg-white shadow-md text-primary-500 hover:text-primary-600 focus:outline-none"
      >
        <Show when={sidebarOpen} fallback={<Menu size={24} />}>
          <X size={24} />
        </Show>
      </button>
    </div>
  );
}

export default MobileMenuButton;
