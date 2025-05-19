import { navigateTo } from "../../../../router/Router";
import { loggedIn } from "../../../../const.data";
import { useDialogManager } from "../../../../components/layout/DialogManager";
import { DialogContentContratEditorTool } from "../../../../components/dialog/contract/DialogContentContratEditorTool";
import { Button } from "../../../../components/buttons/Button";

export function HeroButtons() {
  const { show } = useDialogManager();

  function openContractTool() {
    show(<DialogContentContratEditorTool />, "Créer un contrat");
  }

  return (
    <div class="mt-10 flex justify-center lg:justify-start gap-2 flex-wrap">
      <Button
        onClick={() => navigateTo(loggedIn() ? "/dashboard" : "/auth")}
        text={loggedIn() ? "Accéder à mon espace" : "Commencer maintenant"}
      />
      <Button onClick={openContractTool} text="Créer un contrat" />
    </div>
  );
}
