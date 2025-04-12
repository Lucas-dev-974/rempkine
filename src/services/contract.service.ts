import { ContractEntity } from "../models/contract.entity";
import { NotificationService } from "../utils/notification.service";
import { FetcherService } from "./fetch.service";

class ContractService {
  async createContract(
    contract: Partial<ContractEntity>
  ): Promise<Partial<ContractEntity>> {
    const response = await FetcherService.post("/contract", contract);
    NotificationService.push({
      content: "Contrat sauvegarder",
      type: "info",
    });
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
}
export const contractService = new ContractService();
