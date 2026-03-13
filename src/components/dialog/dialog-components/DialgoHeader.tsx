import { VsChromeClose } from "solid-icons/vs";

interface DialgoHeaderProps {
    title: string;
    onClose: () => void;
}

export function DialgoHeader(props: DialgoHeaderProps) {
    return <div class="text-white text-lg p-3  font-bold lg:text-2xl items-center flex justify-between bg-primary rounded-t-lg"
        style="background: linear-gradient(190deg,rgba(9, 151, 115, 1) 0%, rgba(67, 182, 146, 1) 100%);">
        <h3 class="text-xl font-bold m-0 font-[Nunito]">{props.title}</h3>

        <button class="bg-none border-none text-3xl cursor-pointer text-red-500 bg-transparent" onClick={props.onClose}>
            <VsChromeClose size={24} />
        </button>
    </div>
}