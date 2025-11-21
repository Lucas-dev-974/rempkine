import { FetcherService } from "./fetch.service";

class MailService {
    async sendContratTo(form: FormData) {
        const response = await FetcherService.post("/mail/send-contract", form)
        return response;
    }
}

export const mailService = new MailService()