import { children, JSXElement } from "solid-js";
import { Navbar } from "../components/navbar/Navbar";
import { Notification } from "../components/notification/Notification";
import { FloatingMenu } from "../components/FloattingMenu/FloatingMenu";

interface PageWrapperProps {
    children: JSXElement;
}

export function PageWrapper(props: PageWrapperProps) {
    const childs = children(() => props.children)

    return (
        <div>
            <Navbar />
            <FloatingMenu />
            <Notification />
            <div class="md:px-20 lg:w-2/4 mx-auto px-4 ">
                {childs()}
            </div>
        </div>
    );
}