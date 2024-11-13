import { Button } from "../components/buttons/Button";
import { ContractList } from "../components/contract/contract-list/ContractList";

export function Contracts() {
  function createContract() {
    location.href = "/contract-edit";
  }

  return (
    <div>
      <div class="flex  justify-between items-center">
        <h1 class="text-xl ">Mes contrats</h1>
        <Button onClick={createContract} text="Proposer un contrat" />
      </div>

      <ContractList />
    </div>
  );
}
