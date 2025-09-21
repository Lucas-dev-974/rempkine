import { NotificationService } from "../utils/notification.service";
import storeService from "../utils/store.service";

class Fetcher {
  host = import.meta.env.VITE_HOST ?? location.protocol + "//api." + location.host + "/api"
  token = storeService.proxy.token;

  constructor() {
    console.log("fetcher host", this.host);
  }

  async get(url: string) {
    const response = await this.fetcher(url, { method: "GET" });
    return await response;
  }

  async post(url: string, data: any) {
    const response = await this.fetcher(url, {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
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
    return await this.fetcher(url, { method: "DELETE" });
  }

  async fetcher(url: string, init?: RequestInit) {

    const headers: HeadersInit = {
      Authorization: "Bearer " + this.token,
    }

    if (!(init?.body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
    }

    console.log("header:", headers);


    const response = await fetch(this.host + url, {
      ...init,
      headers
    });

    const responseJson = await response.json() ?? "ok";
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
