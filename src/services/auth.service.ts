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
    const response = await FetcherService.patch("/auth/", user);
    if (response.error) {
      return;
    }
    this.setData(response);
    location.href = "/";
    return response;
  }

  async login(user: Pick<UserEntity, "email" | "password">) {
    const response = await FetcherService.post("/auth/", user);
    if (response.error) {
      return;
    }
    this.setData(response);
    location.href = "/";
    return response;
  }
}

export const authService = new AuthService();
