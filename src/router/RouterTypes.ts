import { createSignal } from "solid-js";

export enum PagesEnum {
    home = "/",
    login = "/login",
    register = "/register",
}

export const publicPages: PagesEnum[] = [PagesEnum.home, PagesEnum.login, PagesEnum.register];
export const [onPage, setPage] = createSignal<PagesEnum>(PagesEnum.home);
