
import { createSignal } from "solid-js";
import { onPage, PagesEnum, publicPages, setPage } from "./router.types";
import { loggedIn } from "../const.data";

export const [urlParams, setUrlParams] = createSignal(new URLSearchParams(window.location.search))

export class RouterUtils {
    static initRouter() {
        const initialPath = window.location.pathname + window.location.search;
        this.handleNavigation(initialPath);

        window.addEventListener('popstate', () => {
            this.handleNavigation(window.location.pathname + window.location.search);
        });
    }

    static updateUrl(path: string) {
        window.history.pushState({}, '', path);
    }

    static handleNavigation(path: string) {
        const basePath = path.split('?')[0];
        const page = Object.values(PagesEnum).find(p => p === basePath);

        if (page) {
            setPage(path as PagesEnum);
        } else {
            // Optionnel: Gérer les pages non trouvées, par exemple rediriger vers une page 404.
            // Pour l'instant, on ne fait rien si la page de base n'est pas reconnue.
        }
    }

    static checkPublicPage(page: PagesEnum) {
        if (!publicPages.includes(page) && onPage() != PagesEnum.login && !loggedIn()) {
            setPage(PagesEnum.login)
        }
    }



    static requestAppPageParams(page: PagesEnum, params: any) {
        const queryParams = new URLSearchParams(params);
        const fullPath = `${page}?${queryParams.toString()}`;
        setUrlParams(queryParams)
        setPage(fullPath as PagesEnum);
        this.updateUrl(fullPath);
    }

    static getUrlParams() {
        const query = new URLSearchParams(location.search)
        setUrlParams(query)
    }
}