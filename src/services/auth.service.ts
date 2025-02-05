import { setLoggedIn } from "../const.data";
import { UserEntity, user1 } from "../models/user.entity";
import storeService from "../utils/store.service";
import { fetcher } from "./fetch.service";

type loginResponse = {};
class AuthService {
  private setData(response: any) {
    setLoggedIn(true);
    storeService.proxy.token = response.token;
    storeService.proxy.user = response.user;
  }

  async register(user: Partial<UserEntity>) {
    const response = await fetcher.post("/auth/register", user);
    console.log(response);

    if (response.error) {
      setLoggedIn(false);
      return;
    }
    this.setData(response);
    location.href = "/";
    return response;
  }

  async login(user: Pick<UserEntity, "email" | "password">) {
    const response = await fetcher.post("/auth/login", user);

    if (response.error) {
      setLoggedIn(false);
      return;
    }
    this.setData(response);
    location.href = "/";
    return response;
  }
}

export const authService = new AuthService();
