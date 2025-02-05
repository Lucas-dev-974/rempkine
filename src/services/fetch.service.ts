import { NotificationService } from "../utils/notification.service";

class Fetcher {
  host = "http://localhost:1337/api";
  token = "";

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

  async fetcher(input: string, init?: RequestInit) {
    const response = await fetch(this.host + input, {
      ...init,
      headers: {
        Authorization: "Bearer " + this.token,
        "Content-Type": "application/json",
      },
    });

    const responseJson = await response.json();

    if (response.status != 200) {
      console.log("error ");

      NotificationService.push({
        content: responseJson.error.message,
        type: "error",
      });
    }

    return responseJson;
  }
}

export const fetcher = new Fetcher();
