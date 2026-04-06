import { RegisterInformationsInLocal } from "../RegisterInformationsInLocal/RegisterInformationsInLocal";
import { NavbarTitle } from "./NavbarTitle";
import { UserMenu } from "./user-menu/UserMenu";

export function Navbar() {
  // const navigate = useNavigate();

  return (
    <nav class="w-full h-[70px] items-center flex"
      style={{ "background": "linear-gradient(173deg,rgba(9, 151, 115, 1) 0%, rgba(67, 182, 146, 1) 100%)" }}>

      <div class="flex justify-between items-center px-5 md:px-20 w-full">
        <div class="flex gap-10 items-center justify-between sm:justify-normal">
          <NavbarTitle />
        </div>

        <div class="flex gap-2 items-center">
          <RegisterInformationsInLocal isInNavbar={true} />
          <UserMenu />
        </div>
      </div>

    </nav>
  );
}
