import { ErrorHandlerService } from "../utils/error-handler.service";
import storeService from "../utils/store.service";

class Fetcher {
  host = import.meta.env.VITE_HOST ?? location.protocol + "//api." + location.host + "/api"
  token = storeService.proxy.token;

  async get(url: string) {
    try {
      const response = await this.fetcher(url, { method: "GET" });
      return await response;
    } catch (error) {
      throw error;
    }
  }

  async post(url: string, data: any) {
    try {
      const response = await this.fetcher(url, {
        method: "POST",
        body: data instanceof FormData ? data : JSON.stringify(data),
      });
      return await response;
    } catch (error) {
      throw error;
    }
  }

  async patch(url: string, data: any) {
    try {
      const response = await this.fetcher(url, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return await response;
    } catch (error) {
      throw error;
    }
  }

  async delete(url: string) {
    try {
      return await this.fetcher(url, { method: "DELETE" });
    } catch (error) {
      throw error;
    }
  }

  async fetcher(url: string, init?: RequestInit) {
    const headers: HeadersInit = {
      Authorization: "Bearer " + this.token,
    }

    if (!(init?.body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
    }

    try {
      const response = await fetch(this.host + url, {
        ...init,
        headers
      });

      // Gérer les réponses vides (204 No Content)
      if (response.status === 204) {
        return {};
      }

      let responseJson;
      try {
        responseJson = await response.json();
      } catch {
        // Si la réponse n'est pas du JSON valide
        responseJson = { error: "Réponse invalide du serveur" };
      }

      const okStatusCode = [200, 201, 204];

      if (!okStatusCode.includes(response.status)) {
        const errorMessage = responseJson?.error || `Erreur ${response.status}: ${response.statusText}`;
        const apiError = ErrorHandlerService.createApiError(
          errorMessage,
          response.status,
          responseJson
        );
        ErrorHandlerService.handleError(apiError);
        throw apiError;
      }

      return responseJson;
    } catch (error) {
      // Gérer les erreurs réseau
      if (error instanceof TypeError && error.message.includes("fetch")) {
        const networkError = ErrorHandlerService.createNetworkError(
          "Impossible de se connecter au serveur. Vérifiez votre connexion internet.",
          error
        );
        ErrorHandlerService.handleError(networkError);
        throw networkError;
      }
      // Re-lancer les erreurs déjà gérées
      throw error;
    }
  }
}

export const FetcherService = new Fetcher();
