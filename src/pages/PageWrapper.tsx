import { children, JSXElement, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Navbar } from "../components/navbar/Navbar";
import { Notification } from "../components/notification/Notification";
import { FloatingMenu } from "../components/FloattingMenu/floating-menu/FloatingMenu";
import { setNavigateFunction } from "../services/auth.service";

interface PageWrapperProps {
    children: JSXElement;
}

export function PageWrapper(props: PageWrapperProps) {
    const childs = children(() => props.children);
    const navigate = useNavigate();

    onMount(() => {
        setNavigateFunction(navigate);
    });

    return (
        <div class="font-[Nunito]">
            <Navbar />
            <FloatingMenu />
            <Notification />
            <div class="md:px-20 lg:w-2/4 mx-auto px-4 ">
                {childs()}
            </div>
        </div>
    );
}