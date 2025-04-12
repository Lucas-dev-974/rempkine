import { contractService } from "../../../../../services/contract.service";
import { ContractEntity } from "../../../../../models/contract.entity";
import { openDialogTool } from "../../../../dialog/DialogWrapper";
import { TrashIcon } from "../../../../../icons/TrashIcon";
import { loggedIn, setLoadContrat } from "../../../../../const.data";
import { OpenIcon } from "../../../../../icons/OpenIcon";
import { createSignal, onMount } from "solid-js";
import storeService from "../../../../../utils/store.service";

export function DocsViewContract() {
  const [contracts, setContracts] = createSignal<ContractEntity[]>([]);

  onMount(async () => {
    if (!loggedIn()) {
      setContracts(
        await contractService.listFromIDS(storeService.proxy.contractIds)
      );
    } else {
      setContracts(await contractService.list());
    }
  });

  function openDialogTool_(contract: ContractEntity) {
    setLoadContrat(contract);
    openDialogTool();
  }

  async function InputSearchInputHandler(
    e: Event & { currentTarget: HTMLInputElement; target: HTMLInputElement }
  ) {
    const result = await contractService.search(e.target.value);
    setContracts(result);
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
            <tr
              class={`${
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              } hover:bg-blue-100 transition-colors`}
            >
              <td class="px-4 py-2 border-b">{contract.replacedName}</td>
              <td class="px-4 py-2 border-b text-center">
                {contract.substituteName}
              </td>
              <td class="px-4 py-2 border-b text-right">
                <button
                  class="rounded-full p-1 w-7"
                  onClick={() => openDialogTool_(contract)}
                >
                  <OpenIcon />
                </button>
                <button class="rounded-full p-1 w-7">
                  <TrashIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
