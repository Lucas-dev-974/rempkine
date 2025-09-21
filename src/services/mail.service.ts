import { FetcherService } from "./fetch.service";

class MailService {
    async sendContratTo(form: FormData) {

        const response = await FetcherService.post("/mail/send-contract", form)

        console.log(response);

    }
}

export const mailService = new MailService()