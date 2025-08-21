import { Show } from "solid-js";
import "./navbar.css";
import { UserMenu } from "./user-menu/UserMenu";
import { onPage, PagesEnum } from "../../router/Router";

export function Navbar() {
  return (
    <nav class="navbar">
      <div class="navigation">
        <div class="logo">
          <a href="/">Kiné de poche</a>
        </div>
      </div>

      <Show when={onPage() != PagesEnum.login && onPage() != PagesEnum.register}>
        <UserMenu />
      </Show>
    </nav>
  );
}
