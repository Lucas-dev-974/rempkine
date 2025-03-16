import { FilesOutlineIcon } from "../../icons/FilesOutlineIcon";

export function FloatingMenu() {
  return (
    <div class="fixed bottom-5 w-full flex justify-center overflow-visible z-0">
      <div class="bg-slate-300 shadow-2xl rounded-xl px-5 py-4 ">
        <div class="min-w-5 flex flex-col items-center gap-2">
          <FilesOutlineIcon />
          <p class="text-xs">Fichiers</p>
        </div>
      </div>
    </div>
  );
}
