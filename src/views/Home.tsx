import { For } from "solid-js";
import { AnnoucementCard } from "../components/contract/announcement/AnnouncementCard";
import { announcements } from "../models/announcement.entity";
import { Button } from "../components/buttons/Button";

export function Home() {
  return (
    <div>
      <div class="flex gap-1 flex-wrap ">
        <div class="w-full sm:w-1/2 md:w-auto">
          <h1 class="text-xl sm:text-3xl md:text-4xl">
            Trouve dès maintenant un remplaçant pour ton cabinet
          </h1>

          <p class="mt-1">RempKiné, annonces de kiné pour les kiné </p>

          <Button text="Je souhaite rejoindre" onClick={() => {}} />
        </div>

        <div class="w-full sm:w-1/2 md:w-1/4">
          <img
            class="rounded-lg mx-auto"
            src="https://images.pexels.com/photos/6076134/pexels-photo-6076134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
          />
        </div>
      </div>

      <div class="annoncements mt-10">
        <h2 class="font-bold text-xl my-2">Annonces</h2>

        <div class="overflow-x-auto whitespace-nowrap scrollbar-hide bg-gray-100 p-4">
          <div class="flex justify-center gap-5">
            <For each={announcements}>
              {(item) => <AnnoucementCard {...item} />}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
}
