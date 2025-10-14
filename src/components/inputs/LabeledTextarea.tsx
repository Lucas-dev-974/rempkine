import "./LabeledTextarea.css";

export interface TextareaProps {
    onInput: (value: string) => void
    value?: string;
}

interface LabeledTextareaProps extends TextareaProps {
    id: string;
    label: string;
    placeholder?: string;
    style?: "form";
    required?: boolean;
    rows?: number;
}

export function LabeledTextarea(props: LabeledTextareaProps) {
    return (
        <div class="grid grid-cols-1">
            <label class="font-[Nunito]" for={props.id}>{props.label}</label>
            <textarea
                class="font-[Nunito] mt-1 block w-full  py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none resize-none"
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