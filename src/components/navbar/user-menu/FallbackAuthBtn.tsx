import { useLocation, useNavigate } from "@solidjs/router";
import { loggedIn } from "../../../../public/const.data";
import { Show } from "solid-js";

export function FallbackAuthBtn() {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoginPage = location.pathname.includes("login");

    function NavigateTo() {
        if (!isLoginPage) {
            navigate("/login");
        } else {
            navigate("/register");
        }
    }

    return (
        <Show when={!loggedIn()}>
            <button class="font-[Nunito] text-xs md:text-sm px-4 py-2 rounded-lg cursor-pointer text-white duration-700 hover:shadow-lg border-none bg-transparent"
                onClick={NavigateTo}>{!isLoginPage ? "Se connecter" : "S'enregistrer"}</button>
        </Show>
    );
}
