import { contractService } from "../../../../../services/contract.service";
import { ContractEntity } from "../../../../../models/contract.entity";
import { DIALOG_NAMES, openDialogTool } from "../../../../dialog/DialogWrapper";
import { createEffect, createSignal, on, onMount } from "solid-js";
import storeService, { localeUpdateEvent } from "../../../../../utils/store.service";
import { loggedIn, setLoadContrat } from "../../../../../const.data";
import { ConfirmationDialog } from "../../../../dialog/ConfirmationDialog";
import { SearchInput } from "../../../../inputs/SearchInput";
import { DataTable } from "../../../../table/DataTable";
import { TableColumn } from "../../../../table/TableTypes";
import { ContractTableRowActions } from "./ContractTableRow";
import { useContractSearch } from "../../../../../utils/hooks/useContractSearch";

export const [contracts, setContracts] = createSignal<ContractEntity[]>([]);

export function BottomMenuPageContract() {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = createSignal(false);
  const [contractToDelete, setContractToDelete] = createSignal<ContractEntity | null>(null);

  const { filteredContracts, performSearch, setFilteredContracts } = useContractSearch(contracts);

  createEffect(on(localeUpdateEvent, () => {
    const updatedContracts = storeService.proxy.contracts as ContractEntity[];
    setContracts(updatedContracts);
    setFilteredContracts(updatedContracts);
  }))

  // async function SynchronizeContracts() {
  //   const contracts = storeService.proxy.contracts as Partial<ContractEntity>[]
  //   const request = await contractService.registerLocaleContractToBDD(contracts)
  //   storeService.proxy.contracts = request
  // }

  onMount(async () => {
    if (loggedIn()) {
      const contracts = await contractService.list();
      setContracts(contracts);
    } else {
      // const ids = storeService.proxy.contracts?.map(contract => [contract.id, contract.token]) as [[string | number, string]];
      let idsTokens = []
      for (const contract of storeService.proxy.contracts!) {
        idsTokens.push([contract.id, contract.token]);
      }


      const contracts = await contractService.listFromIDSToken(idsTokens as [number, string][]);
      setContracts(contracts);
    }

    // const localContracts = storeService.proxy.contracts;
    // // Initialiser les contrats avec les données du store
    // if (localContracts && localContracts.length > 0) {
    //   const contractsList = localContracts as ContractEntity[];
    //   setContracts(contractsList);
    //   setFilteredContracts(contractsList);
    // }

    // if (loggedIn()) {
    //   if (localContracts!.length > 0) {
    //     // await SynchronizeContracts();
    //     // Mettre à jour après synchronisation
    //     const updatedContracts = storeService.proxy.contracts as ContractEntity[];
    //     setContracts(updatedContracts);
    //     setFilteredContracts(updatedContracts);
    //   } else {
    //     const contractsList = await contractService.list();
    //     storeService.proxy.contracts = contractsList;
    //     setContracts(contractsList);
    //     setFilteredContracts(contractsList);
    //   }
    // }
  });

  function openDialogTool_(contract: ContractEntity) {
    setLoadContrat(contract);
    openDialogTool(DIALOG_NAMES.editContract);
  }

  function requestDeleteContract(contract: ContractEntity) {
    setContractToDelete(contract);
    setShowDeleteConfirmation(true);
  }

  async function confirmDeleteContract() {
    const contract = contractToDelete();
    if (!contract) return;

    setShowDeleteConfirmation(false);

    if (loggedIn()) {
      await contractService.delete(contract.id);
      storeService.proxy.contracts = storeService.proxy.contracts?.filter(contract_ => contract_.id !== contract.id);
    } else {
      storeService.proxy.contracts = storeService.proxy.contracts!.filter((contract_: Partial<ContractEntity>) => contract_.id !== contract.id);
    }

    const updatedContracts = storeService.proxy.contracts as ContractEntity[];
    setContracts(updatedContracts);
    setFilteredContracts(updatedContracts.filter((c) => c.id !== contract.id));

    setContractToDelete(null);
  }

  function cancelDeleteContract() {
    setShowDeleteConfirmation(false);
    setContractToDelete(null);
  }

  function getLocalContract(contract: ContractEntity): ContractEntity | undefined {
    return storeService.proxy.contracts?.find(contract_ => contract_.id === contract.id) as ContractEntity | undefined;
  }

  const tableColumns: TableColumn<ContractEntity>[] = [
    {
      key: "replacedName",
      label: "Remplaçé",
      align: "left",
      width: "33%",
    },
    {
      key: "substituteName",
      label: "Remplaçant",
      align: "center",
      width: "33%",
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      width: "33%",
      render: (contract) => (
        <ContractTableRowActions
          contract={contract}
          onEdit={openDialogTool_}
          onDelete={requestDeleteContract}
          getLocalContract={getLocalContract}
        />
      ),
    },
  ];

  return (
    <div class="m-0">
      <SearchInput
        placeholder="Recherche"
        onInput={performSearch}
      />
      <DataTable
        columns={tableColumns}
        data={filteredContracts()}
        emptyMessage="Aucun contrat trouvé"
      />

      <ConfirmationDialog
        isOpen={showDeleteConfirmation()}
        title="Supprimer le contrat"
        message={`Êtes-vous sûr de vouloir supprimer le contrat entre ${contractToDelete()?.replacedName || "le remplaçant"} et ${contractToDelete()?.substituteName || "le substitut"} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDeleteContract}
        onCancel={cancelDeleteContract}
      />
    </div>
  );
}
