import { ContractEntity } from "../models/contract.entity";
import { FetcherService } from "./fetch.service";

class ContractService {
  async createContract(contract: Partial<ContractEntity>): Promise<Partial<ContractEntity>> {
    const response = await FetcherService.post("/contract", contract);
    return response;
  }

  async update(contract: Partial<ContractEntity>): Promise<Partial<ContractEntity>> {
    const response = await FetcherService.patch("/contract", contract);
    return response;
  }

  async list(): Promise<ContractEntity[]> {
    const response = await FetcherService.get("/contract");
    return response;
  }

  async listFromIDS(ids: []): Promise<ContractEntity[]> {
    const response = await FetcherService.get("/contract/list-ids?ids=" + ids);
    return response;
  }

  async search(query: string): Promise<ContractEntity[]> {
    const response = await FetcherService.get("/contract/search?q=" + query);
    return response;
  }

  async signature(imgName: string): Promise<ContractEntity[]> {
    const response = await FetcherService.get(
      "/contract/signature?imageName=" + imgName
    );
    return response;
  }

  async delete(id: string | number): Promise<void> {
    return await FetcherService.delete("/contract/" + id);
  }

  async registerLocaleContractToBDD(contracts: Partial<ContractEntity>[]) {
    return await FetcherService.post("/contract/register-local-contrats", { contracts })
  }
}
export const contractService = new ContractService();
