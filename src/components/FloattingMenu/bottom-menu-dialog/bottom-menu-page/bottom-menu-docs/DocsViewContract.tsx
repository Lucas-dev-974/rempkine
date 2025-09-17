import { contractService } from "../../../../../services/contract.service";
import { ContractEntity } from "../../../../../models/contract.entity";
import { openDialogTool } from "../../../../dialog/DialogWrapper";
import { TrashIcon } from "../../../../../icons/TrashIcon";
import { loggedIn, setLoadContrat } from "../../../../../const.data";
import { OpenIcon } from "../../../../../icons/OpenIcon";
import { createSignal, onMount } from "solid-js";
import storeService from "../../../../../utils/store.service";
import { ButtonIcon } from "../../../../buttons/ButtonIcon";

export function DocsViewContract() {
  const [contracts, setContracts] = createSignal<ContractEntity[]>([]);

  async function SynchronizeContracts() {
    const contracts = storeService.proxy.contracts as Partial<ContractEntity>[]
    const request: Partial<ContractEntity>[] = await contractService.registerLocaleContractToBDD(contracts)
    storeService.proxy.contracts = request

  }

  onMount(async () => {
    const localContracts = storeService.proxy.contracts
    if (loggedIn()) {
      if (localContracts!.length > 0) {
        SynchronizeContracts()
      } else {
        storeService.proxy.contracts = await contractService.list()
      }
    }

    setContracts(storeService.proxy.contracts as ContractEntity[])
  });

  function openDialogTool_(contract: ContractEntity) {
    setLoadContrat(contract);
    openDialogTool();
  }

  async function InputSearchInputHandler(e: Event & { currentTarget: HTMLInputElement; target: HTMLInputElement }) {
    let contracts: ContractEntity[] = []
    if (loggedIn()) {
      contracts = await contractService.search(e.target.value);
    } else {
      contracts = storeService.proxy.contracts?.filter(contract =>
        contract.replacedName?.startsWith(e.target.value) ||
        contract.substituteName?.startsWith(e.target.value) ||
        contract.replacedEmail?.startsWith(e.target.value) ||
        contract.substituteEmail?.startsWith(e.target.value)
      ) as ContractEntity[]
    }
    setContracts(contracts as ContractEntity[]);
  }

  async function deleteContract(contract: ContractEntity) {
    if (loggedIn()) {
      await contractService.delete(contract.id);
      storeService.proxy.contracts = storeService.proxy.contracts?.filter(contract_ => contract_.id != contract.id)
      setContracts(contracts().filter((c) => c.id !== contract.id));
    } else {
      storeService.proxy.contracts = storeService.proxy.contracts!.filter((contract_: Partial<ContractEntity>) => contract_.id !== contract.id)
    }
  }

  function getLocalContract(contract: ContractEntity) {
    return storeService.proxy.contracts?.find(contract_ => contract_.id == contract.id)
  }

  return (
    <div class="mt-5 overflow-auto max-h-[60vh]">
      <div class="w-full my-2">
        <input
          type="text"
          class="rounded-full border px-4 py-1 shadow-lg"
          placeholder="Recherche"
          onInput={InputSearchInputHandler}
        />
      </div>
      <table class="min-w-full border border-gray-300 shadow-lg rounded-lg  ">
        <thead>
          <tr class="bg-blue-500 text-white">
            <th class="px-4 py-2 text-left">Remplaçé</th>
            <th class="px-4 py-2 text-center">Remplaçant</th>
            <th class="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {contracts().map((contract, index) => (
            <tr class={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-blue-100 transition-colors`} >
              <td class="px-4 py-2 border-b">{contract.replacedName}</td>
              <td class="px-4 py-2 border-b text-center">
                {contract.substituteName}
              </td>
              <td class="px-4 py-2 border-b text-right">
                <div class="flex gap-2 justify-end">
                  <ButtonIcon
                    size="medium"
                    icons={<OpenIcon />}
                    onClick={() => openDialogTool_(getLocalContract(contract) as ContractEntity)}
                  />
                  <ButtonIcon
                    size="medium"
                    icons={<TrashIcon />}
                    onClick={() => deleteContract(contract)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
