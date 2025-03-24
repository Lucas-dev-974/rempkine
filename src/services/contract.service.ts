import { ContractEntity } from "../models/contract.entity";
import { FetcherService } from "./fetch.service";

class ContractService {
  async createContract(contract: ContractEntity): Promise<void> {
    const response = await FetcherService.post("/contract", contract);
    return response;
  }
}
export const contractService = new ContractService();
