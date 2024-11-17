import { For, Show } from "solid-js";
import { AnnoucementCard } from "../components/contract/announcement/AnnouncementCard";
import { announcements } from "../models/announcement.entity";
import { Button } from "../components/buttons/Button";
import storeService from "../utils/store.service";

export function Home() {
  return (
    <div class="pt-8">
      <div class="flex gap-1 flex-wrap ">
        <div class="w-full sm:w-1/2 md:w-auto">
          <h1 class="text-2xl sm:text-3xl md:text-4xl my-3 font-bold text-gray-800">
            Trouve dès maintenant un remplaçant pour ton cabinet
          </h1>

          <p class="my-3">RempKiné, annonces de kiné pour les kiné </p>

          <Show when={!storeService.proxy.isLogin}>
            <div class="flex  flex-wrap">
              <Button
                class="my-1 w-full sm:w-auto"
                text="Je souhaite rejoindre"
                onClick={() => (location.href = "/register")}
              />
              <Button
                class="my-1 w-full sm:w-auto"
                text="Je souhaite me connecter"
                onClick={() => (location.href = "/login")}
              />
            </div>
          </Show>
        </div>
      </div>

      <div class="annoncements mt-5">
        <h2 class="font-bold text-xl my-2 text-gray-800">Annonces</h2>

        <div class="overflow-x-auto whitespace-nowrap scrollbar-hide p-4 flex gap-2 ">
          <For each={announcements}>
            {(item) => <AnnoucementCard {...item} />}
          </For>
        </div>
      </div>
    </div>
  );
}
