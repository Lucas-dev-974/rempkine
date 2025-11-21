import { NotificationService } from "./notification.service";

export enum ErrorType {
    NETWORK = "NETWORK",
    API = "API",
    VALIDATION = "VALIDATION",
    UNKNOWN = "UNKNOWN",
}

export interface AppError {
    type: ErrorType;
    message: string;
    originalError?: Error | unknown;
    statusCode?: number;
}

export class ErrorHandlerService {
    /**
     * Gère les erreurs de manière centralisée
     */
    static handleError(error: AppError | Error | unknown): void {
        let appError: AppError;

        if (error instanceof Error) {
            appError = {
                type: ErrorType.UNKNOWN,
                message: error.message || "Une erreur inattendue s'est produite",
                originalError: error,
            };
        } else if (this.isAppError(error)) {
            appError = error;
        } else {
            appError = {
                type: ErrorType.UNKNOWN,
                message: "Une erreur inattendue s'est produite",
                originalError: error,
            };
        }

        // Log l'erreur en développement uniquement
        if (import.meta.env.DEV) {
            console.error("Error handled:", appError);
        }

        // Affiche une notification à l'utilisateur
        NotificationService.push({
            content: appError.message,
            type: "error",
        });
    }

    /**
     * Crée une erreur API
     */
    static createApiError(
        message: string,
        statusCode?: number,
        originalError?: unknown
    ): AppError {
        return {
            type: ErrorType.API,
            message,
            statusCode,
            originalError,
        };
    }

    /**
     * Crée une erreur réseau
     */
    static createNetworkError(
        message: string = "Erreur de connexion. Vérifiez votre connexion internet.",
        originalError?: unknown
    ): AppError {
        return {
            type: ErrorType.NETWORK,
            message,
            originalError,
        };
    }

    /**
     * Crée une erreur de validation
     */
    static createValidationError(
        message: string,
        originalError?: unknown
    ): AppError {
        return {
            type: ErrorType.VALIDATION,
            message,
            originalError,
        };
    }

    /**
     * Vérifie si l'erreur est une AppError
     */
    private static isAppError(error: unknown): error is AppError {
        return (
            typeof error === "object" &&
            error !== null &&
            "type" in error &&
            "message" in error
        );
    }
}


