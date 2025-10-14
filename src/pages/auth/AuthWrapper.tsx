import { children, JSXElement } from "solid-js";
import { Navbar } from "../../components/navbar/Navbar";
import { Notification } from "../../components/notification/Notification";

interface AuthWrapperProps {
    children: JSXElement;
}

export function AuthWrapper(props: AuthWrapperProps) {
    const childs = children(() => props.children);
    return (
        <div class="flex flex-col  justify-center items-center">
            <Navbar />
            <Notification />
            <div class="w-full flex flex-col justify-center items-center " style={{ "height": "calc(100vh - 70px)" }}>
                {childs()}
            </div>
        </div>
    );

}