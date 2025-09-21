export interface TextareaProps {
    onInput: (value: string) => void
    value?: string;
}

export function Textarea(props: TextareaProps) {
    return <textarea rows="10" onInput={(e) => props.onInput(e.target.value)}>
        {props.value ?? ""}
    </textarea>
}