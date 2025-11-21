import { setLoggedIn } from "../const.data";
import { UserEntity } from "../models/user.entity";
import storeService from "../utils/store.service";
import { FetcherService } from "./fetch.service";

// Utilitaire pour la navigation (évite les dépendances circulaires)
let navigateFn: ((path: string) => void) | null = null;

export function setNavigateFunction(navigate: (path: string) => void) {
  navigateFn = navigate;
}

class AuthService {
  private setData(response: any) {
    storeService.proxy.token = response.token;
    storeService.proxy.user = response.user;
    this.setGlobalIsLogin(true);
  }

  public setGlobalIsLogin(isLogin: boolean) {
    storeService.proxy.isLogin = isLogin;
    setLoggedIn(isLogin);
  }

  async register(user: Partial<UserEntity>) {
    const response = await FetcherService.patch("/auth/", user);
    this.setData(response);
    if (navigateFn) {
      navigateFn("/");
    } else {
      location.href = "/";
    }
    return response;
  }

  async login(user: Pick<UserEntity, "email" | "password">) {
    const response = await FetcherService.post("/auth/", user);
    this.setData(response);
    if (navigateFn) {
      navigateFn("/");
    } else {
      location.href = "/";
    }
    return response;
  }
}

export const authService = new AuthService();
