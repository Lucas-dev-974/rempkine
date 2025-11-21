import { children, JSXElement, Setter, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Navbar } from "../../components/navbar/Navbar";
import { Notification } from "../../components/notification/Notification";
import { setNavigateFunction } from "../../services/auth.service";

interface AuthWrapperProps {
    children: JSXElement;
    setFormRef: Setter<HTMLFormElement>;
    handleSubmit: (e: SubmitEvent) => void;
}

export function AuthWrapper(props: AuthWrapperProps) {
    const childs = children(() => props.children);
    const navigate = useNavigate();

    onMount(() => {
        setNavigateFunction(navigate);
    });

    return (
        <div class="flex flex-col  justify-center items-center">
            <Navbar />
            <Notification />
            <div class="w-full flex flex-col justify-center items-center " style={{ "height": "calc(100vh - 70px)" }}>
                <form ref={props.setFormRef} onSubmit={props.handleSubmit} class="m-0 mx-auto shadow-xl shadow-slate-300 rounded-lg space-y my-5  w-[90%] md:w-2/3 lg:w-1/4">
                    {childs()}
                </form>
            </div>
        </div>
    );

}