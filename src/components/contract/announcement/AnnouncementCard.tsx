import { CalendarIcon } from "../../../icons/CalendarIcon";
import { HouseIcon } from "../../../icons/HouseIcon";
import { PeopleIcon } from "../../../icons/PeopleIcon";
import { PercentIcon } from "../../../icons/PercentIcon";
import { Button } from "../../buttons/Button";

export interface AnnoucementCardProps {
  duration: {
    start: Date;
    end: Date;
  };
  clientNumber: string;
  accommodation: boolean;
  remuneration: string;
}

export function AnnoucementCard(props: AnnoucementCardProps) {
  return (
    <div class="announcement bg-gray-300  max-w-[350px] min-w-[280px] rounded-xl">
      <img
        src="https://images.pexels.com/photos/20860586/pexels-photo-20860586/free-photo-of-physiotherapist-looking-at-patient-back.jpeg"
        class="rounded-t-xl "
      />

      <div class="content py-3 px-2">
        <p class="text-lg font-bold">Offre remplacement kiné à Saint Denis</p>

        <div class="flex flex-col gap-2 mt-5">
          <div class="flex items-center gap-1">
            <div class="w-5 h-5">
              <CalendarIcon />
            </div>
            <p class="text-sm font-bold">du 02/12/2024 au 06/12/2024</p>
          </div>

          <div class="flex items-center gap-1">
            <div class="w-5 h-5">
              <PeopleIcon />
            </div>
            <p class="text-sm font-bold">{props.clientNumber}</p>
          </div>

          <div class="flex items-center gap-1">
            <div class="w-5 h-5">
              <HouseIcon />
            </div>
            <p class="text-sm font-bold">
              {" "}
              cabinet {props.accommodation ? " + logement" : ""}
            </p>
          </div>

          <div class="flex items-center gap-1">
            <div class="w-5 h-5">
              <PercentIcon />
            </div>
            <p class="text-sm font-bold">{props.remuneration}</p>
          </div>
        </div>

        <div class="flex justify-end">
          <Button
            text="Proposer un contrat"
            onClick={() => {
              location.href = "/contract-edit";
            }}
          />
        </div>
      </div>
    </div>
  );
}
