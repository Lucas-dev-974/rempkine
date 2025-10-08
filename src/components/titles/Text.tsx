interface TextProps {
  text: string;
}

export function Text(props: TextProps) {
  return <p class="font-xs md:font-base text-gray-700 text-base font-[Nunito] m-0">{props.text}</p>;
}
