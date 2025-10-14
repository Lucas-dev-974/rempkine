interface TitleFormProps {
    title: string;
}

export function TitleForm(props: TitleFormProps) {
    return <h2 class="font-[Nunito] text-center  text-xl font-normal   p-5  rounded-t-md  text-white "
        style={{ "background": "linear-gradient(173deg,rgba(9, 151, 115, 1) 0%, rgba(67, 182, 146, 1) 100%)" }}>{props.title}</h2>
}