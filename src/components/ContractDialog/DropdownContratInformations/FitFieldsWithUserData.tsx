import { Button } from "../../buttons/Button";

interface FitFieldsWithUserDataProps {
  onFill: () => void;
  onClear: () => void;
  isFilled: boolean;
  filledText?: string;
  clearedText?: string;
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
    <Button
      text={props.isFilled ? props.clearedText || "Retirer mes informations" : props.filledText || "Remplir avec mes informations"}
      onClick={handleClick}
      size="small"
      isDanger={props.isFilled}
    />
  );
}
