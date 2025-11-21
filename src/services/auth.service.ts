import { setLoggedIn } from "../../public/const.data";
import { UserEntity } from "../models/user.entity";
import storeService from "../utils/store.service";
import { FetcherService } from "./fetch.service";

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
    try {
      const response = await FetcherService.patch("/auth/", user);
      this.setData(response);
      location.href = "/";
      return response;
    } catch (error) {
      // L'erreur est déjà gérée par FetcherService via ErrorHandlerService
      throw error;
    }
  }

  async login(user: Pick<UserEntity, "email" | "password">) {
    try {
      const response = await FetcherService.post("/auth/", user);
      this.setData(response);
      location.href = "/";
      return response;
    } catch (error) {
      // L'erreur est déjà gérée par FetcherService via ErrorHandlerService
      throw error;
    }
  }
}

export const authService = new AuthService();
