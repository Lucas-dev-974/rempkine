import { ContractList } from "../components/contract/contract-list/ContractList";
import { Button } from "../components/buttons/Button";
import { Title1 } from "../components/titles/Title1";
import { Motion } from "@motionone/solid";

export function Contracts() {
  function createContract() {
    location.href = "/contract-edit";
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="pt-10 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-28 text-center lg:text-left">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <div class="flex  justify-between items-center">
            <Title1 text="Mes contrats" color="primary" />
            <Button onClick={createContract} text="Proposer un contrat" />
          </div>

          <ContractList />
        </Motion.div>
      </div>
    </div>
  );
}
