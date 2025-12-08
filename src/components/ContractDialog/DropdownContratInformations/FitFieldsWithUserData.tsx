import { Button } from "../../buttons/Button";

interface FitFieldsWithUserDataProps {
  onFill: () => void;
  onClear: () => void;
  isFilled: boolean;
}

export function FitFieldsWithUserData(props: FitFieldsWithUserDataProps) {
  const handleClick = () => {
    if (props.isFilled) {
      props.onClear();
    } else {
      props.onFill();
    }
  };

  return (
    <div class="flex w-full justify-end">
      <Button
        text={props.isFilled ? "Retirer mes informations" : "Remplir avec mes informations"}
        onClick={handleClick}
        size="small"
        isDanger={props.isFilled}
      />
    </div>
  );
}
