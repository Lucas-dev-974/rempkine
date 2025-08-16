import { createSignal, createEffect, on, Switch, Match } from "solid-js";
import { RouterUtils } from "./router.utils";
import { Home } from "../views/home/Home";
import { Authentication } from "../views/auth/Authentication";

export enum PagesEnum {
    home = "/",
    login = "/login",
    register = "/register",
}

export const [onPage, setPage] = createSignal<PagesEnum>(PagesEnum.home)
export const publicPages: PagesEnum[] = [PagesEnum.home, PagesEnum.login, PagesEnum.register]

export function Router() {
    createEffect(() => RouterUtils.initRouter());

    createEffect(on(onPage, async (page) => {
        RouterUtils.checkPublicPage(page)
        RouterUtils.updateUrl(page);
    }));

    const cleanParams = (onPage: PagesEnum) => {
        return onPage.toString().split("?")[0]
    }

    return <Switch>
        <Match when={cleanParams(onPage()) == PagesEnum.home}>
            <Home />
        </Match>
        <Match when={cleanParams(onPage()) == PagesEnum.login || cleanParams(onPage()) == PagesEnum.register}>
            <Authentication />
        </Match>
    </Switch>
}