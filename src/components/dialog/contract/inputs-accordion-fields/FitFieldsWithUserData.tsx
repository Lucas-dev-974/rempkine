import { Button } from "../../../buttons/Button";

export function FitFieldsWithUserData(props: {
  fillWithMyInformations: () => void;
}) {
  return (
    <div class="flex w-full justify-end">
      <Button
        text="Remplire avec mes informations"
        onClick={() => props.fillWithMyInformations()}
        size="xs"
      />
    </div>
  );
}
