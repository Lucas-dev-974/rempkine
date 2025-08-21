import { createEffect, on, Switch, Match } from "solid-js";
import { RouterUtils } from "./router.utils";
import { Home } from "../views/home/Home";
import { Authentication } from "../views/auth/Authentication";
import { onPage, PagesEnum } from "./router.types";

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