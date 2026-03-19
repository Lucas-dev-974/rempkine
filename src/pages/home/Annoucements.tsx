import { For } from "solid-js";
import { AnnouncementCard } from "./AnnouncementCard";
import { AnnouncementEntity } from "../../models/announcement.entity";

export function Announcements(props: { announcements: AnnouncementEntity[] }) {
  return (
    <div class="annoncements mt-5">
      <h2 class="font-bold text-lg sm:text-xl my-2 text-gray-800">Annonces</h2>

      <div class="overflow-x-auto whitespace-nowrap scrollbar-hide p-4 flex gap-2 ">
        <For each={props.announcements}>
          {(item) => <AnnouncementCard {...item} />}
        </For>
      </div>
    </div>
  );
}
