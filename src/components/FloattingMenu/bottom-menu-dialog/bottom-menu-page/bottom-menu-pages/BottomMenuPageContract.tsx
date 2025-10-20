import { contractService } from "../../../../../services/contract.service";
import { ContractEntity } from "../../../../../models/contract.entity";
import { openDialogTool } from "../../../../dialog/DialogWrapper";
import { createEffect, createSignal, on, onMount } from "solid-js";
import storeService, { localeUpdateEnvent } from "../../../../../utils/store.service";
import { ButtonIcon } from "../../../../buttons/ButtonIcon";
import { bottomMenuPage, BottomMenuPageEnum, isBottomMenuVisible } from "../../BottomMenuDialog";
import { loggedIn, setLoadContrat } from "../../../../../../public/const.data";
import { FiEdit } from "solid-icons/fi";
import { TiDeleteOutline } from "solid-icons/ti";

export const [contracts, setContracts] = createSignal<ContractEntity[]>([]);
export function BottomMenuPageContract() {

  createEffect(on(localeUpdateEnvent, () => {
    setContracts(storeService.proxy.contracts as ContractEntity[])
  }))

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
  });

  // * next create Effect is an example of onMount and onCleanup for BottomMenu
  createEffect(on(isBottomMenuVisible, () => {
    if (isBottomMenuVisible()) {

      if (bottomMenuPage() === BottomMenuPageEnum.contracts) {
        console.log("on mount");
      }
    } else {
      console.log("cleanup");
    }
  }))

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
    <div class="m-0 ">
      <div class="w-full mb-2">
        <input
          type="text"
          class="rounded-full border px-4 py-1 shadow-lg w-1/2"
          placeholder="Recherche"
          onInput={InputSearchInputHandler}
        />
      </div>
      <div class="border border-gray-300 shadow-lg rounded-lg w-full  overflow-hidden">
        <div class="overflow-y-auto h-full">
          <table class="w-full font-[Nunito]">
            <thead class="sticky top-0 z-10" style={{ "background": "linear-gradient(173deg,rgba(9, 151, 115, 1) 0%, rgba(67, 182, 146, 1) 100%)" }}>
              <tr class="text-white text-sm">
                <th class="px-4 py-2 text-left w-1/3">Remplaçé</th>
                <th class="px-4 py-2 text-center w-1/3">Remplaçant</th>
                <th class="px-4 py-2 text-right w-1/3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts().map((contract, index) => (
                <tr class={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-blue-100 transition-colors text-sm`}>
                  <td class="px-4 py-2 border-b">{contract.replacedName}</td>
                  <td class="px-4 py-2 border-b text-center">
                    {contract.substituteName}
                  </td>
                  <td class="px-4 py-2 border-b text-right">
                    <div class="flex gap-2 justify-end">
                      <ButtonIcon
                        size="large"
                        icons={<FiEdit color="#099773" size={24} />}
                        onClick={() => openDialogTool_(getLocalContract(contract) as ContractEntity)}
                      />
                      <ButtonIcon
                        size="large"
                        icons={<TiDeleteOutline color="red" size={24} />}
                        onClick={() => deleteContract(contract)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
