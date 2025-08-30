interface TitleFormProps {
    title: string;
}

export function TitleForm(props: TitleFormProps) {
    return <h2 class="text-2xl font-bold  bg-primary p-3  rounded-t-md  text-white ">{props.title}</h2>
}