import { createSignal, createContext, useContext, JSX, Show } from "solid-js";

type DialogManagerContextType = {
  show: (dialog: JSX.Element, title: string) => void;
  hide: () => void;
};

const DialogManagerContext = createContext<DialogManagerContextType>();

export function DialogManagerProvider(props: { children: any }) {
  const [dialog, setDialog] = createSignal<JSX.Element | null>(null);
  const [title, setTitle] = createSignal<string | null>(null);

  const show = (dialog: JSX.Element, title: string) => {
    setDialog(() => dialog);
    setTitle(() => title);
  };

  const hide = () => setDialog(null);

  return (
    <DialogManagerContext.Provider value={{ show, hide }}>
      {props.children}
      <Show when={dialog()}>
        <div
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 transition overflow-hidden"
          onClick={hide}
        >
          <div
            class="bg-white rounded shadow-lg relative h-[90vh] w-screen max-w-2xl "
            onClick={(e) => e.stopPropagation()}
          >
            <div class="dialog-header flex items-center justify-center mb-4 bg-primary-500 py-5 px-3 rounded-t">
              <h2 class="text-2xl font-bold text-white">
                {title() ? title() : "Dialog"}
              </h2>
            </div>

            <div class="dialog-content overflow-auto h-[90%]">{dialog()}</div>
            <button
              class="absolute top-2 right-2 text-white hover:text-neutral-800"
              onClick={hide}
            >
              ✕
            </button>
          </div>
        </div>
      </Show>
    </DialogManagerContext.Provider>
  );
}

export function useDialogManager() {
  const ctx = useContext(DialogManagerContext);
  if (!ctx)
    throw new Error(
      "useDialogManager must be used within DialogManagerProvider"
    );
  return ctx;
}
