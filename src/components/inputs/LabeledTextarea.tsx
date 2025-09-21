import { createSignal, onMount } from "solid-js";
import { TextareaProps } from "./Textarea";
import "./LabeledTextarea.css";

interface LabeledTextareaProps extends TextareaProps {
    id: string;
    label: string;
    placeholder?: string;
    style?: "form";
    required?: boolean;
    rows?: number;
}

export function LabeledTextarea(props: LabeledTextareaProps) {
    const [classname, setClassname] = createSignal("labeled-textarea");

    onMount(() =>
        setClassname((prev) => (!!props.style ? `${prev}-${props.style}` : prev))
    );

    return (
        <div class={classname()}>
            <label for={props.id}>{props.label}</label>
            <textarea
                id={props.id}
                name={props.id}
                placeholder={props.placeholder ? props.placeholder : ""}
                onInput={(e) => props.onInput(e.target.value)}
                value={props.value || ""}
                required={props.required}
                rows={props.rows || 4}
            />
        </div>
    );
}