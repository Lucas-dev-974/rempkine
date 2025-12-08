import { Accessor, createSignal } from "solid-js";
import { ContractEntity } from "../../models/contract.entity";
import { contractService } from "../../services/contract.service";
import { loggedIn } from "../../const.data";

export function useContractSearch(contracts: Accessor<ContractEntity[]>) {
    const [searchQuery, setSearchQuery] = createSignal<string>("");
    const [filteredContracts, setFilteredContracts] = createSignal<ContractEntity[]>(contracts());

    const performSearch = async (query: string) => {
        setSearchQuery(query);

        if (!query.trim()) {
            setFilteredContracts(contracts());
            return;
        }

        if (loggedIn()) {
            // Recherche via API
            const results = await contractService.search(query);
            setFilteredContracts(results);
        } else {
            // Recherche locale
            const lowerQuery = query.toLowerCase();
            const filtered = contracts().filter((contract) => {
                const replacedName = contract.replacedName?.toLowerCase() || "";
                const substituteName = contract.substituteName?.toLowerCase() || "";
                const replacedEmail = contract.replacedEmail?.toLowerCase() || "";
                const substituteEmail = contract.substituteEmail?.toLowerCase() || "";

                return (
                    replacedName.includes(lowerQuery) ||
                    substituteName.includes(lowerQuery) ||
                    replacedEmail.includes(lowerQuery) ||
                    substituteEmail.includes(lowerQuery)
                );
            });
            setFilteredContracts(filtered);
        }
    };

    return {
        searchQuery,
        filteredContracts,
        performSearch,
        setFilteredContracts,
    };
}


