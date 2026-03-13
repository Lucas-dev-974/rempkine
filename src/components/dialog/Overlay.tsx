
interface OverlayProps {
    onClick: () => void;
    show?: boolean;
}

export function Overlay(props: OverlayProps) {
    return <div classList={{ "fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[200]": props.show, "hidden": !props.show }} onClick={props.onClick} />
}