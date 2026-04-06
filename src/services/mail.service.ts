import { ResponseTypeSendContractTo } from "../components/ContractDialog/PDFPrevisualisation/SendContractTo";
import { FetcherService } from "./fetch.service";

export type ResponseTypeReportBug = {
    message?: string;
    error?: string;
}

class MailService {
    async sendContratTo(form: FormData): Promise<ResponseTypeSendContractTo> {
        const response = await FetcherService.post("/mail/send-contract", form)
        return response as ResponseTypeSendContractTo;
    }

    async reportBug(form: FormData): Promise<ResponseTypeReportBug> {
        const response = await FetcherService.post("/mail/report-bug", form)
        return response as ResponseTypeReportBug;
    }
}

export const mailService = new MailService()