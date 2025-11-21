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

  async listFromIDS(ids: (string | number)[]): Promise<ContractEntity[]> {
    const idsParam = ids.map(id => encodeURIComponent(String(id))).join(',');
    const response = await FetcherService.get("/contract/list-ids?ids=" + idsParam);
    return response;
  }

  async search(query: string): Promise<ContractEntity[]> {
    const encodedQuery = encodeURIComponent(query);
    const response = await FetcherService.get("/contract/search?q=" + encodedQuery);
    return response;
  }

  async signature(imgName: string): Promise<ContractEntity[]> {
    const encodedImgName = encodeURIComponent(imgName);
    const response = await FetcherService.get(
      "/contract/signature?imageName=" + encodedImgName
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
