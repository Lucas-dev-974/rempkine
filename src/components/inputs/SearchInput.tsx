interface SearchInputProps {
    placeholder?: string;
    onInput: (value: string) => void;
    class?: string;
    value?: string;
}

export function SearchInput(props: SearchInputProps) {
    return (
        <div class={`w-full mb-2 ${props.class || ""}`}>
            <input
                type="text"
                class="rounded-full border px-4 py-2 sm:py-1 shadow-lg  sm:w-1/2 text-sm sm:text-base font-[Nunito]"
                placeholder={props.placeholder || "Recherche"}
                value={props.value || ""}
                onInput={(e) => props.onInput(e.currentTarget.value)}
            />
        </div>
    );
}


