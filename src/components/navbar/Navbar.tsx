import { useNavigate } from "@solidjs/router";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav class="text-white w-full h-[70px] items-center flex"
      style={{ "background": "linear-gradient(173deg,rgba(9, 151, 115, 1) 0%, rgba(67, 182, 146, 1) 100%)" }}>
      <div class="flex justify-between items-center px-5 md:px-20 w-full">
        <div class="flex gap-10 items-center justify-between sm:justify-normal">
          <p class="text-xl cursor-pointer font-[Nunito]" onClick={() => navigate("/")}>Kiné de poche</p>
        </div>

        {/* <UserMenu /> */}
      </div>
    </nav>
  );
}
