import { MenuIcon } from "../../icons/MenuIcon";
import "./navbar.css";

export function Navbar() {
  return (
    <nav class="navbar">
      <div class="navigation">
        <div class="logo">
          <a href="/">RempKiné</a>
        </div>

        <div class="nav-btn-group">
          <a href="/annonces">Annonces</a>
          <a href="#">....</a>
        </div>
      </div>

      <div class="mobile-nav flex items-center  sm:hidden">
        <div class="w-7 h-7 relative top-1">
          <MenuIcon />
        </div>
      </div>
    </nav>
  );
}
