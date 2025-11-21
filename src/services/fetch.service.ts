import { ErrorHandlerService } from "../utils/error-handler.service";
import storeService from "../utils/store.service";
import { authService } from "./auth.service";

class Fetcher {
  private readonly DEFAULT_TIMEOUT = 30000; // 30 secondes
  host: string;

  constructor() {
    const envHost = import.meta.env.VITE_HOST;
    if (envHost) {
      this.host = envHost;
    } else {
      // Construction sécurisée de l'URL
      try {
        const url = new URL("/api", `${location.protocol}//api.${location.host}`);
        this.host = url.toString().replace(/\/$/, ""); // Retire le slash final
      } catch {
        // Fallback si la construction échoue
        this.host = `${location.protocol}//api.${location.host}/api`;
      }
    }
  }

  get token(): string | undefined {
    return storeService.proxy.token;
  }

  async get(url: string) {
    return await this.fetcher(url, { method: "GET" });
  }

  async post(url: string, data: unknown) {
    return await this.fetcher(url, {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  async patch(url: string, data: unknown) {
    return await this.fetcher(url, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete(url: string) {
    return await this.fetcher(url, { method: "DELETE" });
  }

  async fetcher(url: string, init?: RequestInit, timeout: number = this.DEFAULT_TIMEOUT) {
    const headers: HeadersInit = {};

    if (this.token) {
      headers.Authorization = "Bearer " + this.token;
    }

    if (!(init?.body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
    }

    // Créer un AbortController pour le timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(this.host + url, {
        ...init,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Gérer les réponses vides (204 No Content)
      if (response.status === 204) {
        return {};
      }

      // Vérifier le Content-Type avant de parser le JSON
      const contentType = response.headers.get("content-type");
      let responseJson: unknown;

      if (contentType && contentType.includes("application/json")) {
        try {
          responseJson = await response.json();
        } catch (error) {
          // Si le JSON est invalide malgré le Content-Type
          const networkError = ErrorHandlerService.createNetworkError(
            "Réponse invalide du serveur: JSON malformé",
            error
          );
          ErrorHandlerService.handleError(networkError);
          throw networkError;
        }
      } else {
        // Si ce n'est pas du JSON, retourner un objet vide ou le texte
        const text = await response.text();
        responseJson = text ? { data: text } : {};
      }

      const okStatusCode = [200, 201, 204];

      if (!okStatusCode.includes(response.status)) {
        // Gérer les erreurs 401 (Token manquant/invalide) - Déconnecter l'utilisateur
        if (response.status === 401 && storeService.proxy.isLogin) {
          // Déconnecter l'utilisateur silencieusement (vide le localStorage)
          authService.logout();
          // Ne pas lancer d'erreur, juste retourner un objet vide
          return {};
        }

        const errorMessage = (responseJson && typeof responseJson === 'object' && 'error' in responseJson && typeof responseJson.error === 'string')
          ? responseJson.error
          : `Erreur ${response.status}: ${response.statusText}`;
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
      clearTimeout(timeoutId);

      // Gérer les erreurs d'abort (timeout)
      if (error instanceof Error && error.name === "AbortError") {
        const timeoutError = ErrorHandlerService.createNetworkError(
          "La requête a pris trop de temps. Veuillez réessayer.",
          error
        );
        ErrorHandlerService.handleError(timeoutError);
        throw timeoutError;
      }

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
