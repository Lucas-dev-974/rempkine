import { JSX } from "solid-js";

interface BottomSlideEffectContainerProps {
    children: JSX.Element;
    isVisible: boolean;
}

export function BottomSlideEffectContainer(props: BottomSlideEffectContainerProps) {

    setTimeout(() => {
        props.isVisible = true;
    }, 500);
    return <div class="fixed bottom-0 left-0 w-full bg-white rounded-t-lg shadow-lg transform transition-transform duration-1000 h-[600px]"
        classList={{
            "translate-y-full": !props.isVisible,
            "translate-y-0": props.isVisible,
        }}
        onClick={(e) => e.stopPropagation()}
    >{props.children}</div>
}