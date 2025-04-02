import { ContractEntity } from "../models/contract.entity";
import { FetcherService } from "./fetch.service";

class ContractService {
  async createContract(contract: ContractEntity): Promise<void> {
    const response = await FetcherService.post("/contract", contract);
    return response;
  }

  async list(): Promise<ContractEntity[]> {
    const response = await FetcherService.get("/contract");
    return response;
  }

  async search(query: string): Promise<ContractEntity[]> {
    const response = await FetcherService.get("/contract/search?q=" + query);
    return response;
  }
}
export const contractService = new ContractService();
