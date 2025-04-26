import { error } from "pdf-lib";
import { NotificationService } from "../utils/notification.service";
import storeService from "../utils/store.service";

class Fetcher {
  host = "http://localhost:3001/api";
  token = storeService.proxy.token;

  constructor() {}
  setHost(host: string) {
    this.host = host;
  }

  async get(url: string) {
    const response = await this.fetcher(url, { method: "GET" });
    return await response;
  }

  async post(url: string, data: any) {
    const response = await this.fetcher(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return await response;
  }

  async patch(url: string, data: any) {
    const response = await this.fetcher(url, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return await response;
  }

  async delete(url: string) {
    const response = await this.fetcher(url, {
      method: "DELETE",
    });
    return await response;
  }

  async fetcher(url: string, init?: RequestInit) {
    const response = await fetch(this.host + url, {
      ...init,
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json",
      },
    });

    const responseJson = await response.json();

    const okStatusCode = [200, 201, 204];
    if (!okStatusCode.includes(response.status)) {
      // console.log("error ", responseJson);
      NotificationService.push({
        content: responseJson.error,
        type: "error",
      });

      throw new Error("RequestError");
    }

    return responseJson;
  }
}

export const FetcherService = new Fetcher();
