import { ResponseTypeSendContractTo } from "../components/ContractDialog/PDFPrevisualisation/SendContractTo";
import { FetcherService } from "./fetch.service";

class MailService {
    async sendContratTo(form: FormData): Promise<ResponseTypeSendContractTo> {
        const response = await FetcherService.post("/mail/send-contract", form)
        return response as ResponseTypeSendContractTo;
    }
}

export const mailService = new MailService()