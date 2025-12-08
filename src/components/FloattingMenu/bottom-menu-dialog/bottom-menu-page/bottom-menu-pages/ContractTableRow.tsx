import { ContractEntity } from "../../../../../models/contract.entity";
import { ButtonIcon } from "../../../../buttons/ButtonIcon";
import { FiEdit } from "solid-icons/fi";
import { TiDeleteOutline } from "solid-icons/ti";

interface ContractTableRowActionsProps {
    contract: ContractEntity;
    onEdit: (contract: ContractEntity) => void;
    onDelete: (contract: ContractEntity) => void;
    getLocalContract?: (contract: ContractEntity) => ContractEntity | undefined;
}

export function ContractTableRowActions(props: ContractTableRowActionsProps) {
    return (
        <div class="flex gap-2 justify-end">
            <ButtonIcon
                size="large"
                icons={<FiEdit color="#099773" size={24} />}
                onClick={() => {
                    const localContract = props.getLocalContract
                        ? props.getLocalContract(props.contract)
                        : props.contract;
                    props.onEdit(localContract || props.contract);
                }}
            />
            <ButtonIcon
                size="large"
                icons={<TiDeleteOutline color="red" size={24} />}
                onClick={() => props.onDelete(props.contract)}
            />
        </div>
    );
}

