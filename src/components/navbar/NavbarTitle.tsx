import { useNavigate } from "@solidjs/router";

export function NavbarTitle() {
    const navigate = useNavigate();

    return (
        <p class="text-xl cursor-pointer font-[Nunito] text-white" onClick={() => navigate("/")}>Kiné de poche</p>
    )
}